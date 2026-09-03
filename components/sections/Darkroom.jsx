'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useState, useRef, useMemo } from 'react';
import FilmGrain from '@/components/effects/FilmGrain';
import Lightbox from '@/components/ui/Lightbox';
import { PHOTOS, CATEGORIES, cld, blurUrl } from '@/lib/photography';

const EASE = [0.16, 1, 0.3, 1];
const SHUTTER = [0.76, 0, 0.24, 1];

const isPlaceholder = (p) => p.placeholder || (p.publicId || '').startsWith('photography/placeholder');

// Pad the real roll up to a full-looking contact sheet.
function buildRoll() {
  const cats = ['street', 'portrait', 'architecture', 'street', 'nature', 'portrait', 'street', 'architecture'];
  const real = PHOTOS.map((p, i) => ({ ...p, frame: i + 1 }));
  const out = [...real];
  for (let i = real.length; i < 8; i++) {
    out.push({ id: `roll-${i}`, placeholder: true, category: cats[i % cats.length], location: 'Mumbai', title: 'Latent frame', frame: i + 1 });
  }
  return out;
}

function Frame({ photo, index, onOpen }) {
  const ph = isPlaceholder(photo);
  return (
    <div
      className={`dk-frame${ph ? ' dk-frame--latent' : ''}`}
      onClick={ph ? undefined : onOpen}
      style={{ cursor: ph ? 'default' : 'pointer' }}
    >
      <span className="dk-frame-no">{String(photo.frame).padStart(2, '0')}<span style={{ opacity: 0.4 }}> / 36</span></span>

      {ph ? (
        <>
          <span className="dk-cross" />
          <span className="dk-frame-cat">{photo.category}</span>
          <span className="dk-frame-exif">f/1.8 · 1/{250 + index * 60}s · ISO {200 + index * 100}</span>
          <span className="dk-frame-dev">developing…</span>
        </>
      ) : (
        <Image
          src={cld(photo.publicId, 'w_800,c_fill,f_auto,q_80')}
          blurDataURL={blurUrl(photo.publicId)}
          placeholder="blur"
          width={800}
          height={534}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          alt={photo.title}
        />
      )}

      {!ph && (
        <div className="dk-overlay">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#fff', fontWeight: 500 }}>{photo.title}</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{photo.location}</p>
        </div>
      )}
    </div>
  );
}

export default function Darkroom() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const roll = useMemo(buildRoll, []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const frames = activeCategory === 'all' ? roll : roll.filter((p) => p.category === activeCategory);
  const realFrames = frames.filter((p) => !isPlaceholder(p));

  return (
    <section
      ref={sectionRef}
      id="photography"
      style={{ background: '#080809', position: 'relative', overflow: 'hidden', padding: '120px 24px' }}
    >
      <FilmGrain />

      {/* Shutter panels */}
      <motion.div initial={{ y: 0 }} animate={inView ? { y: '-100%' } : { y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: '#080809', zIndex: 10 }} />
      <motion.div initial={{ y: 0 }} animate={inView ? { y: '100%' } : { y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#080809', zIndex: 10 }} />

      <div style={{ position: 'relative', zIndex: 20, maxWidth: '1120px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }} style={{ textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-photo)', marginBottom: '16px' }}>
            · photography ·
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.03 }}>
            Stories the eye misses.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginTop: '14px' }}>
            Mumbai, on foot, through a Sony &alpha;7&nbsp;III.
          </p>
        </motion.div>

        {/* Roll status */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', margin: '36px 0 24px' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(232,147,90,0.65)', border: '1px solid rgba(232,147,90,0.22)', borderRadius: '999px', padding: '7px 16px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-photo)', animation: 'dk-blink 1.6s ease-in-out infinite' }} />
            ROLL 001 · 35MM · MUMBAI · IN DEVELOPMENT
          </span>
        </motion.div>

        {/* Category filter */}
        <div className="dk-filter" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  background: active ? 'var(--accent-photo)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${active ? 'var(--accent-photo)' : 'rgba(255,255,255,0.15)'}`,
                  padding: '7px 18px', borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif', fontSize: '12.5px', fontWeight: 500,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Contact sheet */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="dk-sheet"
        >
          <div className="dk-sprockets" />
          <div className="dk-grid">
            {frames.map((photo, i) => (
              <Frame
                key={photo.id}
                photo={photo}
                index={i}
                onOpen={() => {
                  const realIdx = realFrames.findIndex((p) => p.id === photo.id);
                  if (realIdx >= 0) setLightboxIndex(realIdx);
                }}
              />
            ))}
          </div>
          <div className="dk-sprockets" />
        </motion.div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: '44px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
          full gallery in development · all frames &copy; Jay Guri
        </p>
      </div>

      {lightboxIndex != null && realFrames.length > 0 && (
        <Lightbox
          photos={realFrames}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => (i + 1) % realFrames.length)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + realFrames.length) % realFrames.length)}
        />
      )}

      <style>{`
        @keyframes dk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .dk-sheet {
          background: #050505; border: 1px solid rgba(232,147,90,0.14);
          border-radius: 14px; padding: 4px; overflow: hidden;
        }
        .dk-sprockets {
          height: 16px;
          background-image: radial-gradient(circle at 8px 50%, #050505 3.5px, transparent 4px);
          background-size: 22px 16px;
          background-color: #0d0d0e;
        }
        .dk-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
          padding: 6px 4px;
        }
        .dk-frame {
          position: relative; aspect-ratio: 3 / 2; overflow: hidden;
          background: linear-gradient(135deg, #14100c, #0a0a0b 60%, #0e0c14);
          border: 1px solid rgba(232,147,90,0.08);
        }
        .dk-frame-no {
          position: absolute; top: 6px; left: 8px; z-index: 2;
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          color: rgba(232,147,90,0.55); letter-spacing: 0.05em;
        }
        .dk-frame-cat {
          position: absolute; bottom: 6px; left: 8px; z-index: 2;
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          color: rgba(232,147,90,0.4); text-transform: uppercase; letter-spacing: 0.1em;
        }
        .dk-frame-exif {
          position: absolute; bottom: 6px; right: 8px; z-index: 2;
          font-family: 'JetBrains Mono', monospace; font-size: 7px;
          color: rgba(232,147,90,0.28); letter-spacing: 0.03em;
        }
        .dk-cross {
          position: absolute; top: 50%; left: 50%; width: 16px; height: 16px;
          transform: translate(-50%, -50%);
          background:
            linear-gradient(rgba(232,147,90,0.28), rgba(232,147,90,0.28)) center / 100% 1px no-repeat,
            linear-gradient(rgba(232,147,90,0.28), rgba(232,147,90,0.28)) center / 1px 100% no-repeat;
        }
        .dk-frame-dev {
          position: absolute; inset: 0; z-index: 3;
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em;
          color: rgba(232,147,90,0.8); background: rgba(232,147,90,0.06);
          opacity: 0; transition: opacity 0.25s ease;
        }
        .dk-frame--latent:hover .dk-frame-dev { opacity: 1; }

        .dk-overlay {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 30px 12px 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.72));
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .dk-frame:not(.dk-frame--latent):hover .dk-overlay { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .dk-sheet span[style*="animation"] { animation: none !important; }
        }
        @media (max-width: 900px) { .dk-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 560px) { .dk-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
