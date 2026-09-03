// Shared helpers for the photo pipeline.
// Discovery, de-dup, EXIF read, and the deterministic tag derivation that runs
// on every photo (new or old) without needing anyone to look at the image.

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import exifr from 'exifr';
import heicConvert from 'heic-convert';
import SunCalc from 'suncalc';

// sharp (bundled with Next) reads HEIC metadata but can't decode HEVC pixel
// data, so HEIC gets a pure-JS pass through heic-convert first. libheif applies
// the stored rotation during decode, so the result is already upright.
export async function decodeForSharp(buf, ext) {
  const e = ext.toLowerCase().replace('.', '');
  if (e === 'heic' || e === 'heif') {
    const jpeg = await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.94 });
    return { data: Buffer.from(jpeg), needsAutoOrient: false };
  }
  return { data: buf, needsAutoOrient: true };
}

export const SRC_DIR = 'lib/Images';
export const MANIFEST_PATH = 'lib/photos.manifest.json';
export const CURATED_PATH = 'lib/photos.curated.json';

export const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp']);
export const SKIP_RAW = new Set(['.dng', '.raw', '.cr2', '.cr3', '.nef', '.arw', '.raf']);

// ── Controlled vocabulary ───────────────────────────────────────────────────
// Curated (needs eyes) tags live in photos.curated.json. The script only ever
// *adds* the derived ones below, then caps the total so cards never crowd.
export const DERIVED_TAGS = {
  time: ['golden hour', 'blue hour', 'night'],
  exposure: ['long exposure', 'available light'],
  palette: ['monochrome', 'warm tones', 'cool tones', 'high-key', 'low-key', 'high contrast'],
  framing: ['wide', 'tele'],
  orientation: ['portrait', 'landscape', 'square', 'panorama'],
};
export const MAX_TAGS = 5;

// Coarse offline reverse-geocode — only the regions this library actually
// contains, so the manifest can fill a `place` when curation doesn't.
const REGIONS = [
  { name: 'Québec City',      latMin: 46.75, latMax: 47.00, lngMin: -71.40, lngMax: -71.05 },
  { name: 'Montréal',         latMin: 45.40, latMax: 45.70, lngMin: -73.75, lngMax: -73.45 },
  { name: 'Toronto',          latMin: 43.55, latMax: 43.85, lngMin: -79.55, lngMax: -79.20 },
  { name: 'Niagara Falls',    latMin: 43.02, latMax: 43.15, lngMin: -79.12, lngMax: -79.00 },
  { name: 'Bruce Peninsula',  latMin: 44.80, latMax: 45.30, lngMin: -81.70, lngMax: -81.10 },
  { name: 'Ahmedabad',        latMin: 22.90, latMax: 23.20, lngMin:  72.45, lngMax:  72.75 },
  { name: 'Kutch',            latMin: 23.00, latMax: 23.90, lngMin:  69.00, lngMax:  70.50 },
  { name: 'Kovalam, Kerala',  latMin: 15.40, latMax: 15.75, lngMin:  73.60, lngMax:  73.90 },
  { name: 'Kerala',           latMin: 8.20,  latMax: 12.80, lngMin:  74.80, lngMax:  77.60 },
  { name: 'Mumbai',           latMin: 18.85, latMax: 19.45, lngMin:  72.72, lngMax:  73.15 },
];

export function regionFromGps(gps) {
  if (!gps) return null;
  const { lat, lng } = gps;
  for (const r of REGIONS) {
    if (lat >= r.latMin && lat <= r.latMax && lng >= r.lngMin && lng <= r.lngMax) return r.name;
  }
  return null;
}

export async function listSourceImages() {
  let entries;
  try {
    entries = await readdir(SRC_DIR, { withFileTypes: true });
  } catch {
    return { images: [], skippedRaw: [] };
  }
  const images = [];
  const skippedRaw = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (SKIP_RAW.has(ext)) { skippedRaw.push(e.name); continue; }
    if (!SUPPORTED.has(ext)) continue;
    images.push(e.name);
  }
  images.sort();
  return { images, skippedRaw };
}

export async function hashFile(absPath) {
  const buf = await readFile(absPath);
  return { hash: createHash('sha1').update(buf).digest('hex'), buf };
}

export function shortId(hash) {
  return `p_${hash.slice(0, 10)}`;
}

// ── EXIF ────────────────────────────────────────────────────────────────────
export async function readExif(buf) {
  let x = {};
  try {
    x = (await exifr.parse(buf, {
      tiff: true, exif: true, gps: true, ifd0: true,
      pick: [
        'Make', 'Model', 'LensModel', 'LensMake',
        'FNumber', 'ApertureValue', 'ExposureTime', 'ShutterSpeedValue',
        'ISO', 'ISOSpeedRatings', 'PhotographicSensitivity',
        'FocalLength', 'FocalLengthIn35mmFormat',
        'DateTimeOriginal', 'CreateDate', 'OffsetTimeOriginal',
        'Flash', 'Orientation',
        'latitude', 'longitude', 'GPSLatitude', 'GPSLongitude',
      ],
    })) || {};
  } catch {
    x = {};
  }

  const iso = x.ISO ?? x.ISOSpeedRatings ?? x.PhotographicSensitivity ?? null;
  const shutter = typeof x.ExposureTime === 'number' ? x.ExposureTime : null;
  const fnum = typeof x.FNumber === 'number' ? x.FNumber : (typeof x.ApertureValue === 'number' ? +(1.4142 ** x.ApertureValue).toFixed(1) : null);
  const focal = typeof x.FocalLength === 'number' ? x.FocalLength : null;
  const focal35 = typeof x.FocalLengthIn35mmFormat === 'number' ? x.FocalLengthIn35mmFormat : null;
  const shot = x.DateTimeOriginal || x.CreateDate || null;

  // proper signed GPS (a `pick` list skips exifr's lat/long synthesis)
  let lat = null, lng = null;
  try {
    const g = await exifr.gps(buf);
    if (g && Number.isFinite(g.latitude) && Number.isFinite(g.longitude)) {
      lat = g.latitude;
      lng = g.longitude;
    }
  } catch { /* no gps */ }

  // exifr revives DateTimeOriginal against the *runtime* timezone, not the
  // photo's, so read the raw wall-clock string and combine it with
  // OffsetTimeOriginal to get a real UTC instant + the true local hour.
  let shotHour = null;
  let shotLocal = null;
  let shotAtUTC = null;
  try {
    const raw = await exifr.parse(buf, { reviveValues: false, pick: ['DateTimeOriginal', 'CreateDate'] });
    const s = raw?.DateTimeOriginal || raw?.CreateDate;
    const m = typeof s === 'string' && /^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/.exec(s);
    if (m) {
      shotHour = parseInt(m[4], 10);
      shotLocal = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
      const off = /^[+-]\d{2}:\d{2}$/.test(x.OffsetTimeOriginal || '') ? x.OffsetTimeOriginal : 'Z';
      const d = new Date(`${shotLocal}:${m[6]}${off}`);
      if (!Number.isNaN(d.getTime())) shotAtUTC = d.toISOString();
    }
  } catch { /* ignore */ }
  if (!shotAtUTC && shot) shotAtUTC = new Date(shot).toISOString();

  return {
    shotHour,
    shotLocal,
    camera: [x.Make, x.Model].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || null,
    lens: x.LensModel || null,
    iso: iso ? Math.round(iso) : null,
    shutter,
    shutterLabel: shutter ? (shutter >= 1 ? `${shutter}s` : `1/${Math.round(1 / shutter)}s`) : null,
    aperture: fnum ? +fnum.toFixed(1) : null,
    focalLength: focal ? Math.round(focal) : null,
    focalLength35: focal35 ? Math.round(focal35) : null,
    flash: typeof x.Flash === 'number' ? (x.Flash & 1) === 1 : null,
    shotAt: shotAtUTC,
    gps: (typeof lat === 'number' && typeof lng === 'number') ? { lat: +lat.toFixed(5), lng: +lng.toFixed(5) } : null,
  };
}

// ── Deterministic tags from EXIF + pixel stats ──────────────────────────────
// `stats` is the object from sharp(...).stats(); `meta` from sharp(...).metadata()
export function deriveTags(exif, stats, meta) {
  const tags = new Set();
  const w = meta?.width || 0;
  const h = meta?.height || 0;

  // orientation (account for EXIF rotation already applied by sharp autoOrient)
  if (w && h) {
    const ar = w / h;
    if (ar >= 2.2 || ar <= 1 / 2.2) tags.add('panorama');
    else if (Math.abs(ar - 1) < 0.06) tags.add('square');
    else if (ar > 1) tags.add('landscape');
    else tags.add('portrait');
  }

  // time of day — real sun position from GPS + timestamp (falls back to the
  // wall-clock hour when there's no GPS)
  if (exif.shotAt && exif.gps) {
    const t = new Date(exif.shotAt).getTime();
    const s = SunCalc.getTimes(new Date(exif.shotAt), exif.gps.lat, exif.gps.lng);
    const MIN = 60_000;
    const inWin = (a, b, pad = 0) => t >= a - pad && t <= b + pad;
    if (t < s.dawn.getTime() - 15 * MIN || t > s.dusk.getTime() + 15 * MIN) {
      tags.add('night');
    } else if (inWin(s.dawn.getTime(), s.sunrise.getTime()) || inWin(s.sunset.getTime(), s.dusk.getTime())) {
      tags.add('blue hour');
    } else if (inWin(s.sunriseEnd.getTime(), s.goldenHourEnd.getTime(), 20 * MIN)
            || inWin(s.goldenHour.getTime() - 25 * MIN, s.sunsetStart.getTime())) {
      tags.add('golden hour');
    }
  } else if (exif.shotHour != null && exif.camera) {
    // no GPS but a real original — a coarse night guess is still safe
    const hr = exif.shotHour;
    if (hr >= 20 || hr < 5) tags.add('night');
  }
  if (!tags.has('night') && exif.iso && exif.shutter && exif.iso >= 2000 && exif.shutter >= 1 / 60) {
    tags.add('night');
  }

  // exposure feel
  if (exif.shutter && exif.shutter >= 0.5) tags.add('long exposure');
  else if (exif.iso && exif.iso >= 1000 && exif.flash !== true) tags.add('available light');

  // framing — only the ends of the range are interesting
  const f = exif.focalLength35 || (exif.focalLength ? exif.focalLength * 1.5 : null);
  if (f) {
    if (f <= 20) tags.add('wide');
    else if (f >= 90) tags.add('tele');
  }

  // palette from sharp stats — conservative. "monochrome" is left to the
  // curator: a mean-channel test flags too many merely-muted scenes.
  if (stats?.channels?.length >= 3) {
    const [r, g, b] = stats.channels;
    const mean = (r.mean + g.mean + b.mean) / 3;
    const stdev = (r.stdev + g.stdev + b.stdev) / 3;

    if (r.mean - b.mean > 28) tags.add('warm tones');
    else if (b.mean - r.mean > 28) tags.add('cool tones');
    if (mean < 50) tags.add('low-key');
    else if (mean > 205) tags.add('high-key');
    if (stdev > 78) tags.add('high contrast');
  }

  return [...tags];
}

export const ORIENTATION_TAGS = DERIVED_TAGS.orientation;

// Merge curated (subject/composition) tags with derived ones, keep it tight.
// Orientation isn't a visible tag — it's returned separately for layout.
export function mergeTags(curated = [], derived = []) {
  const pick = (bucket) => bucket.filter((t) => derived.includes(t));
  const order = [
    ...curated,
    ...pick(DERIVED_TAGS.time).slice(0, 1),
    ...pick(DERIVED_TAGS.exposure).slice(0, 1),
    ...pick(DERIVED_TAGS.framing).slice(0, 1),
    ...pick(DERIVED_TAGS.palette).slice(0, 1),
  ];
  const seen = new Set();
  const out = [];
  for (const t of order) {
    const k = String(t).toLowerCase().trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
}

export function orientationOf(derived = []) {
  return DERIVED_TAGS.orientation.find((t) => derived.includes(t)) || 'landscape';
}
