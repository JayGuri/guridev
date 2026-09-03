// Photo pipeline.  `npm run photos`
//
//   1. scans lib/Images (HEIC / JPG / PNG; skips RAW), de-dups by content hash
//   2. reads EXIF + samples pixels -> derives light / palette / framing tags,
//      orientation, a tiny inline blur placeholder, and a coarse place
//   3. merges lib/photos.curated.json (titles + subject tags a human wrote)
//   4. if CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET are in .env.local, uploads
//      any not-yet-uploaded originals to Cloudinary (it handles HEIC -> web)
//   5. writes lib/photos.manifest.json — the single source the site reads
//
// Re-run any time. New files in lib/Images are picked up; existing ones are
// left alone unless their bytes changed. Curated edits always win.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import sharp from 'sharp';
import {
  SRC_DIR, MANIFEST_PATH, CURATED_PATH,
  listSourceImages, hashFile, shortId, decodeForSharp,
  readExif, deriveTags, mergeTags, orientationOf, regionFromGps,
} from './_photos-shared.mjs';

const require = createRequire(import.meta.url);
const CLOUD_FOLDER = 'portfolio/photography';

// ── tiny .env.local reader (no dep) ─────────────────────────────────────────
function loadEnv() {
  const out = {};
  if (!existsSync('.env.local')) return out;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = loadEnv();
const CLOUD_NAME = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || '';
const CAN_UPLOAD = Boolean(CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

// ── load state ─────────────────────────────────────────────────────────────
const curated = JSON.parse(await readFile(CURATED_PATH, 'utf8'));
let prev = { photos: [] };
if (existsSync(MANIFEST_PATH)) {
  try { prev = JSON.parse(await readFile(MANIFEST_PATH, 'utf8')); } catch { /* rebuild */ }
}
const prevById = new Map((prev.photos || []).map((p) => [p.id, p]));

const { images, skippedRaw } = await listSourceImages();

// ── scan ───────────────────────────────────────────────────────────────────
const seen = new Map();          // hash -> filename (first wins)
const photos = [];
let fresh = 0;

for (const name of images) {
  const abs = path.join(SRC_DIR, name);
  const ext = path.extname(name);
  const { hash, buf } = await hashFile(abs);
  if (seen.has(hash)) continue;
  seen.set(hash, name);

  const id = shortId(hash);
  const cur = curated[name] || {};
  const existing = prevById.get(id);

  // unchanged bytes + already analysed -> keep the heavy fields, refresh curation
  if (existing && existing.hash === hash) {
    photos.push({
      ...existing,
      title: cur.title || existing.title,
      place: cur.place || existing.place,
      featured: Boolean(cur.featured),
      hidden: Boolean(cur.hidden),
      tags: mergeTags(cur.tags || existing.subjectTags || [], existing.derivedTags || []),
      subjectTags: cur.tags || existing.subjectTags || [],
    });
    continue;
  }

  fresh += 1;
  const { data, needsAutoOrient } = await decodeForSharp(buf, ext);
  let pipe = sharp(data, { failOn: 'none' });
  if (needsAutoOrient) pipe = pipe.rotate();

  const meta = await pipe.clone().metadata();
  const stats = await pipe.clone().stats();
  const exif = await readExif(buf);
  const derived = deriveTags(exif, stats, meta);
  const blur = await pipe.clone().resize(24, 24, { fit: 'inside' }).webp({ quality: 32 }).toBuffer();

  photos.push({
    id,
    hash,
    file: name,
    publicId: `${CLOUD_FOLDER}/${id}`,
    title: cur.title || 'Untitled',
    place: cur.place || regionFromGps(exif.gps) || null,
    featured: Boolean(cur.featured),
    hidden: Boolean(cur.hidden),
    orientation: orientationOf(derived),
    aspect: meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : 1.5,
    width: null,
    height: null,
    shotAt: exif.shotAt,
    exif: {
      camera: exif.camera,
      lens: exif.lens,
      focalLength: exif.focalLength35 || exif.focalLength,
      aperture: exif.aperture,
      shutter: exif.shutterLabel,
      iso: exif.iso,
    },
    subjectTags: cur.tags || [],
    derivedTags: derived,
    tags: mergeTags(cur.tags || [], derived),
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    uploaded: false,
  });
  process.stdout.write('.');
}
if (fresh) process.stdout.write('\n');

// ── upload ─────────────────────────────────────────────────────────────────
let uploaded = 0;
let uploadErrors = 0;
if (CAN_UPLOAD) {
  const { v2: cloudinary } = require('cloudinary');
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  for (const p of photos) {
    if (p.uploaded || p.hidden) continue;
    try {
      const res = await cloudinary.uploader.upload(path.join(SRC_DIR, p.file), {
        public_id: p.id,
        folder: CLOUD_FOLDER,
        overwrite: false,
        unique_filename: false,
        resource_type: 'image',
        format: 'jpg',
      });
      p.publicId = res.public_id;
      p.width = res.width;
      p.height = res.height;
      p.aspect = +(res.width / res.height).toFixed(4);
      p.uploaded = true;
      uploaded += 1;
      process.stdout.write('^');
    } catch (e) {
      uploadErrors += 1;
      process.stdout.write('!');
      console.error(`\n  upload failed for ${p.file}: ${e.message}`);
    }
  }
  if (uploaded || uploadErrors) process.stdout.write('\n');
}

// ── write manifest ─────────────────────────────────────────────────────────
photos.sort((a, b) => {
  const ta = a.shotAt ? Date.parse(a.shotAt) : 0;
  const tb = b.shotAt ? Date.parse(b.shotAt) : 0;
  return tb - ta;
});

const manifest = {
  generatedAt: new Date().toISOString(),
  cloudName: CLOUD_NAME || null,
  count: photos.filter((p) => !p.hidden).length,
  uploadedCount: photos.filter((p) => p.uploaded && !p.hidden).length,
  photos,
};
await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

// ── report ─────────────────────────────────────────────────────────────────
console.log(`\n${manifest.count} photos in the manifest (${fresh} newly analysed).`);
console.log(`${manifest.uploadedCount}/${manifest.count} live on Cloudinary${CAN_UPLOAD ? '' : ' — set CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local to upload'}.`);
if (uploaded) console.log(`uploaded ${uploaded} this run.`);
if (uploadErrors) console.log(`${uploadErrors} uploads failed — rerun to retry.`);
if (skippedRaw.length) console.log(`skipped RAW (export a JPG to include): ${skippedRaw.join(', ')}`);
const noCur = photos.filter((p) => !curated[p.file] && !p.hidden);
if (noCur.length) console.log(`no curation yet for: ${noCur.map((p) => p.file).join(', ')}`);
