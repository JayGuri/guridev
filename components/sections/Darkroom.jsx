'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import FilmGrain from '@/components/effects/FilmGrain';
import Lightbox from '@/components/ui/Lightbox';
import { PHOTOS, AREAS, areaOf, photoThumb, photoBlur } from '@/lib/photography';

const EASE = [0.16, 1, 0.3, 1];
const INITIAL = 12;

export default function Darkroom() {
  const [area, setArea] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [lightboxAt, setLightboxAt] = useState(-1);

  const shots = useMemo(
    () => (area === 'All' ? PHOTOS : PHOTOS.filter((p) => areaOf(p) === area)),
    [area],
  );
  const visible = expanded ? shots : shots.slice(0, INITIAL);
  const hidden = shots.length - visible.length;

  const pick = (a) => { setArea(a); setExpanded(false); };

  return (
    <section
      id="photography"
      style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <FilmGrain />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1120px', margin: '0 auto' }}>
        <SectionHeader
          label="photography"
          title="An eye that wanders."
          intro="Shot on an iPhone 14 Pro — Canadian rooftops and rivers, Kerala backwaters, the white nothing of the Rann of Kutch. Click any frame for the full size and its EXIF."
          accent="photo"
          maxWidth={680}
        />

        {/* filters — four areas, down from nine city-level pills */}
        <div className="dk-filters">
          {[{ area: 'All', count: PHOTOS.length }, ...AREAS].map(({ area: a, count }) => (
            <button
              key={a}
              onClick={() => pick(a)}
              className={`dk-pill${area === a ? ' is-on' : ''}`}
            >
              {a} <span className="dk-count">{count}</span>
            </button>
          ))}
        </div>

        {/* masonry — CSS columns keeps every photo at its true aspect ratio */}
        <div className="dk-masonry">
          {visible.map((p, i) => {
            const src = photoThumb(p);
            const blur = photoBlur(p);
            if (!src) return null;
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.5, ease: EASE }}
                className="dk-frame"
                style={{ backgroundImage: blur ? `url(${blur})` : undefined }}
                onClick={() => setLightboxAt(PHOTOS.indexOf(p))}
                aria-label={`Open ${p.title}`}
              >
                <img
                  src={src}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: p.aspect || 0.75 }}
                />
                <span className="dk-caption">
                  <span className="dk-title">{p.title}</span>
                  {p.place && <span className="dk-place">{p.place}</span>}
                </span>
              </motion.button>
            );
          })}
        </div>

        {hidden > 0 && (
          <div className="dk-more-wrap">
            <button className="dk-more" onClick={() => setExpanded(true)}>
              <Camera size={15} strokeWidth={2} />
              Show {hidden} more {hidden === 1 ? 'frame' : 'frames'}
            </button>
          </div>
        )}
      </div>

      {lightboxAt >= 0 && (
        <Lightbox
          photos={PHOTOS}
          index={lightboxAt}
          onClose={() => setLightboxAt(-1)}
          onNext={() => setLightboxAt((n) => (n + 1) % PHOTOS.length)}
          onPrev={() => setLightboxAt((n) => (n - 1 + PHOTOS.length) % PHOTOS.length)}
        />
      )}

      <style>{`
        .dk-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .dk-pill {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); background: transparent;
          border: 1px solid var(--border-subtle); border-radius: 999px;
          padding: 7px 15px; cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .dk-pill:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .dk-pill.is-on {
          color: var(--accent-photo);
          border-color: rgba(232,147,90,0.45);
          background: rgba(232,147,90,0.1);
        }
        .dk-count {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--text-tertiary); letter-spacing: 0.04em;
        }
        .dk-pill.is-on .dk-count { color: var(--accent-photo); opacity: 0.75; }

        .dk-masonry { columns: 4; column-gap: 12px; }
        @media (max-width: 1200px) { .dk-masonry { columns: 3; } }
        @media (max-width: 820px)  { .dk-masonry { columns: 2; column-gap: 10px; } }
        @media (max-width: 380px)  { .dk-masonry { columns: 2; column-gap: 8px; } }

        .dk-frame {
          position: relative; display: block; width: 100%;
          margin: 0 0 10px; padding: 0;
          border: 1px solid var(--border-subtle); border-radius: 12px;
          overflow: hidden; cursor: pointer;
          background-size: cover; background-position: center;
          break-inside: avoid;
          transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
        }
        .dk-frame img {
          display: block; width: 100%; height: auto;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .dk-frame:hover {
          border-color: rgba(232,147,90,0.5);
          transform: translateY(-3px);
          box-shadow: 0 18px 40px -20px rgba(0,0,0,0.8);
        }
        .dk-frame:hover img { transform: scale(1.045); }
        .dk-frame:focus-visible { outline: 2px solid var(--accent-photo); outline-offset: 3px; }

        .dk-caption {
          position: absolute; inset: auto 0 0 0;
          display: flex; flex-direction: column; gap: 2px;
          padding: 22px 11px 10px; text-align: left;
          background: linear-gradient(to top, rgba(6,6,8,0.92), rgba(6,6,8,0.55) 55%, transparent);
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.24s ease, transform 0.24s ease;
        }
        .dk-frame:hover .dk-caption, .dk-frame:focus-visible .dk-caption { opacity: 1; transform: translateY(0); }
        .dk-title { font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; color: #fff; }
        .dk-place {
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
          letter-spacing: 0.05em; color: rgba(255,255,255,0.62);
        }

        .dk-more-wrap { display: flex; justify-content: center; margin-top: 10px; }
        .dk-more {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
          color: var(--text-secondary); background: transparent;
          border: 1px solid var(--border-subtle); border-radius: 10px;
          padding: 11px 20px; cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .dk-more:hover { color: var(--accent-photo); border-color: rgba(232,147,90,0.45); transform: translateY(-2px); }

        /* touch devices have no hover — keep captions visible there */
        @media (hover: none) {
          .dk-caption { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dk-frame, .dk-frame img, .dk-caption { transition: none !important; }
          .dk-frame:hover { transform: none; }
          .dk-frame:hover img { transform: none; }
        }
      `}</style>
    </section>
  );
}
