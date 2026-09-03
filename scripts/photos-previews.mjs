// One-off: render web-safe JPEG previews of every source image (incl. HEIC) plus
// an EXIF + derived-tag digest, so a human (or Claude) can curate subject tags
// and titles. Nothing here is committed or deployed.
//
//   node scripts/photos-previews.mjs <outDir>

import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  SRC_DIR, listSourceImages, hashFile, shortId, readExif, deriveTags, decodeForSharp,
} from './_photos-shared.mjs';

const outDir = process.argv[2];
if (!outDir) {
  console.error('usage: node scripts/photos-previews.mjs <outDir>');
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const { images, skippedRaw } = await listSourceImages();
const seenHashes = new Map();
const digest = [];

for (const name of images) {
  const abs = path.join(SRC_DIR, name);
  const ext = path.extname(name);
  const { hash, buf } = await hashFile(abs);
  if (seenHashes.has(hash)) {
    digest.push({ file: name, duplicateOf: seenHashes.get(hash) });
    continue;
  }
  seenHashes.set(hash, name);
  const id = shortId(hash);

  try {
    const { data, needsAutoOrient } = await decodeForSharp(buf, ext);
    let s = sharp(data, { failOn: 'none' });
    if (needsAutoOrient) s = s.rotate();
    const meta = await s.clone().metadata();
    const stats = await s.clone().stats();

    const safe = name.replace(/[^a-z0-9.-]+/gi, '_');
    const previewName = `${safe}.__.${id}.jpg`;
    await s.resize(1180, 1180, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(path.join(outDir, previewName));

    const exif = await readExif(buf);
    const derived = deriveTags(exif, stats, meta);

    digest.push({
      file: name,
      id,
      preview: previewName,
      dims: `${meta.width}x${meta.height}`,
      exif: {
        camera: exif.camera, lens: exif.lens,
        focal: exif.focalLength, focal35: exif.focalLength35,
        f: exif.aperture, shutter: exif.shutterLabel, iso: exif.iso,
        shotAt: exif.shotAt, gps: exif.gps,
      },
      derivedTags: derived,
    });
    process.stdout.write('.');
  } catch (e) {
    digest.push({ file: name, error: e.message.split('\n')[0] });
    process.stdout.write('x');
  }
}

await writeFile(path.join(outDir, '_digest.json'), JSON.stringify(digest, null, 2));
console.log(`\n\n${digest.filter((d) => d.preview).length} previews -> ${outDir}`);
if (skippedRaw.length) console.log(`skipped RAW: ${skippedRaw.join(', ')}`);
const dupes = digest.filter((d) => d.duplicateOf);
if (dupes.length) console.log(`duplicates: ${dupes.map((d) => `${d.file} == ${d.duplicateOf}`).join(', ')}`);
const errs = digest.filter((d) => d.error);
if (errs.length) console.log(`errors:\n  ${errs.map((d) => `${d.file}: ${d.error}`).join('\n  ')}`);
