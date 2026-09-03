import manifest from './photos.manifest.json';

const CLOUD = manifest.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// ── Regions — group the fine-grained places for the filter ──────────────────
const REGION_MAP = [
  ['Québec', ['Old Québec', 'Québec City']],
  ['Montréal', ['Montréal', 'Notre-Dame, Montréal']],
  ['Toronto', ['Toronto']],
  ['Niagara', ['Niagara Falls']],
  ['Ontario', ['Bruce Peninsula', 'Georgian Bay', 'Thousand Islands', 'St. Lawrence River']],
  ['Kerala', ['Kerala', 'Kerala backwaters', 'Kovalam, Kerala', 'Munnar, Kerala']],
  ['Ahmedabad', ['Ahmedabad']],
  ['Kutch', ['Kutch']],
  ['Mumbai', ['Mumbai']],
];

function regionOf(place) {
  if (!place) return 'Elsewhere';
  for (const [region, places] of REGION_MAP) {
    if (places.includes(place)) return region;
  }
  return place;
}

// ── Photos ─────────────────────────────────────────────────────────────────
// Every visible photo, newest first (the manifest is already sorted).
export const PHOTOS = manifest.photos
  .filter((p) => !p.hidden)
  .map((p) => ({ ...p, region: regionOf(p.place) }));

export const FEATURED = PHOTOS.filter((p) => p.featured);

// Regions present, in map order, with counts.
export const REGIONS = REGION_MAP
  .map(([region]) => ({ region, count: PHOTOS.filter((p) => p.region === region).length }))
  .filter((r) => r.count > 0);

// The most-used tags, for an optional theme filter.
export const TOP_TAGS = Object.entries(
  PHOTOS.flatMap((p) => p.tags).reduce((a, t) => ((a[t] = (a[t] || 0) + 1), a), {}),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([tag]) => tag);

// ── URLs ────────────────────────────────────────────────────────────────────
// Cloudinary once uploaded; the inline blur otherwise, so the grid still
// renders (softly) before `npm run photos` has pushed anything.
export function photoSrc(photo, transform = 'f_auto,q_auto,w_1600,c_limit') {
  if (photo?.uploaded && CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${transform}/${photo.publicId}`;
  }
  return photo?.blurDataURL || null;
}

export const photoThumb = (photo) => photoSrc(photo, 'f_auto,q_auto,w_800,c_limit');
export const photoFull = (photo) => photoSrc(photo, 'f_auto,q_auto,w_2400,c_limit');
export const photoBlur = (photo) => photo?.blurDataURL || null;
export const hasImage = (photo) => Boolean(photo?.uploaded && CLOUD);
