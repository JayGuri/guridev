# Photography workflow

The gallery in the Photography section is driven entirely by
**`lib/photos.manifest.json`**, which is generated from your originals.

## Adding photos

1. Drop image files into **`lib/Images/`** (HEIC, JPG, PNG all work — HEIC is
   converted automatically). RAW (`.dng` etc.) is skipped; export a JPG.
2. Run:

   ```bash
   npm run photos
   ```

3. Commit the updated `lib/photos.manifest.json` (and `lib/photos.curated.json`
   if you edited it).

`lib/Images/` is **gitignored** — originals never go into the repo. Keep your
own backup of that folder.

## What `npm run photos` does

- de-dups by file content, skips RAW
- reads EXIF and samples pixels, then **auto-tags**: light (`golden hour`,
  `blue hour`, `night` — from the real sun position at that GPS + time),
  palette (`warm tones`, `low-key`, `high contrast`, …), framing (`wide`,
  `tele`), a coarse **place** from GPS, orientation, and a tiny inline blur
  placeholder
- merges **`lib/photos.curated.json`** — the title + subject/composition tags
  written by hand per photo (`street`, `architecture`, `leading lines`,
  `frame within a frame`, …). The script only ever *adds* auto tags on top and
  caps the total at 5 so cards never crowd.
- if Cloudinary credentials are present, uploads any not-yet-uploaded originals

## Curating (titles + subject tags)

Edit **`lib/photos.curated.json`**. Keyed by the original filename. Fields:

| field | meaning |
|---|---|
| `title` | shown on the tile + in the lightbox |
| `place` | e.g. `"Old Québec"`, `"Munnar, Kerala"` — grouped into filter regions in `lib/photography.js` |
| `tags` | subject / composition tags (2–3 is plenty; the script adds the rest) |
| `featured` | include in the featured set |
| `hidden` | exclude from the site entirely |

The pipeline never overwrites this file.

## Hosting (Cloudinary — free tier)

The build script pushes originals to your Cloudinary account and the site
serves optimized, CDN-cached versions (`f_auto,q_auto`). Until it's configured,
tiles show a soft blurred placeholder.

Add to **`.env.local`** (get these from the Cloudinary dashboard → Settings →
API Keys):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Then `npm run photos` uploads everything. Re-runs only upload new files.
