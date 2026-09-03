'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef, useMemo } from 'react';
import FilmGrain from '@/components/effects/FilmGrain';
import Lightbox from '@/components/ui/Lightbox';
import { PHOTOS, REGIONS, photoThumb, photoBlur, hasImage } from '@/lib/photography';

const EASE = [0.16, 1, 0.3, 1];
const SHUTTER = [0.76, 0, 0.24, 1];

const FILTERS = ['All', ...REGIONS.map((r) => r.region)];

function Tile({ photo, onOpen }) {
  const live = hasImage(photo);
  return (
    <button
      onClick={onOpen}
      className={`dk-tile${live ? '' : ' dk-tile--latent'}`}
      style={{ aspectRatio: photo.aspect || (photo.orientation === 'portrait' ? 0.75 : 1.5) }}
    >
      <img
        src={live ? photoThumb(photo) : photoBlur(photo)}
        alt={photo.title}
        loading="lazy"
        className="dk-tile-img"
        style={live ? undefined : { filter: 'blur(14px) saturate(1.1)', transform: 'scale(1.15)' }}
      />
      {!live && <span className="dk-tile-dev">developing…</span>}
      <span className="dk-tile-frame" />
      <div className="dk-tile-meta">
        <p className="dk-tile-title">{photo.title}</p>
        <p className="dk-tile-place">{photo.place}</p>
      </div>
    </button>
  );
}

export default function Darkroom() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });

  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const shots = useMemo(
    () => (filter === 'All' ? PHOTOS : PHOTOS.filter((p) => p.region === filter)),
    [filter],
  );

  return (
    <section
      ref={sectionRef}
      id="photography"
      style={{ background: '#080809', position: 'relative', overflow: 'hidden', padding: '120px 24px' }}
    >
      <FilmGrain />

      <motion.div initial={{ y: 0 }} animate={inView ? { y: '-100%' } : { y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: '#080809', zIndex: 10 }} />
      <motion.div initial={{ y: 0 }} animate={inView ? { y: '100%' } : { y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#080809', zIndex: 10 }} />

      <div style={{ position: 'relative', zIndex: 20, maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }} style={{ textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-photo)', marginBottom: '16px' }}>
            · photography ·
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.03 }}>
            An eye that wanders.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginTop: '14px' }}>
            Shot on an iPhone 14&nbsp;Pro &mdash; Canada, Kerala, Kutch, and one very loud night in Ahmedabad.
          </p>
        </motion.div>

        {/* Region filter */}
        <div className="dk-filter" style={{ display: 'flex', justifyContent: 'center', gap: '9px', margin: '40px 0 34px', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  background: active ? 'var(--accent-photo)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${active ? 'var(--accent-photo)' : 'rgba(255,255,255,0.15)'}`,
                  padding: '7px 16px', borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif', fontSize: '12.5px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="dk-grid"
        >
          {shots.map((photo, i) => (
            <Tile key={photo.id} photo={photo} onOpen={() => setLightboxIndex(i)} />
          ))}
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: '44px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
          {PHOTOS.length} frames · iPhone 14 Pro · click a frame for the details
        </p>
      </div>

      {lightboxIndex != null && (
        <Lightbox
          photos={shots}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => (i + 1) % shots.length)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + shots.length) % shots.length)}
        />
      )}

      <style>{`
        .dk-grid { columns: 3; column-gap: 14px; }
        @media (max-width: 900px) { .dk-grid { columns: 2; } }
        @media (max-width: 560px) { .dk-grid { columns: 1; } }

        .dk-tile {
          display: block; width: 100%; margin: 0 0 14px; padding: 0;
          border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
          overflow: hidden; position: relative; cursor: pointer;
          background: #0e0e10; break-inside: avoid;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .dk-tile:hover { border-color: rgba(232,147,90,0.4); transform: translateY(-3px); }
        .dk-tile-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .dk-tile--latent { background: linear-gradient(135deg, #14100c, #0b0b0d); }
        .dk-tile-dev {
          position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em;
          color: rgba(232,147,90,0.7);
        }
        .dk-tile-frame {
          position: absolute; inset: 6px; border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none; border-radius: 6px;
        }
        .dk-tile-meta {
          position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end;
          padding: 32px 14px 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.78));
          opacity: 0; transform: translateY(8px); transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .dk-tile:hover .dk-tile-meta { opacity: 1; transform: translateY(0); }
        .dk-tile-title { font-family: 'Clash Display', sans-serif; font-size: 14px; font-weight: 600; color: #fff; }
        .dk-tile-place { font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }

        .dk-filter::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
