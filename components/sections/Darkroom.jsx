'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef, useMemo } from 'react';
import FilmGrain from '@/components/effects/FilmGrain';
import DomeGallery from '@/components/ui/DomeGallery';
import { PHOTOS, REGIONS, photoThumb } from '@/lib/photography';

const EASE = [0.16, 1, 0.3, 1];
const SHUTTER = [0.76, 0, 0.24, 1];

const FILTERS = ['All', ...REGIONS.map((r) => r.region)];

function exifLine(p) {
  const e = p.exif || {};
  return [
    e.camera,
    e.focalLength ? `${e.focalLength}mm` : null,
    e.aperture ? `f/${e.aperture}` : null,
    e.shutter,
    e.iso ? `ISO ${e.iso}` : null,
  ].filter(Boolean).join('  ·  ');
}

function shotDate(p) {
  if (!p.shotAt) return null;
  try {
    return new Date(p.shotAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return null; }
}

export default function Darkroom() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });

  const [filter, setFilter] = useState('All');

  const shots = useMemo(
    () => (filter === 'All' ? PHOTOS : PHOTOS.filter((p) => p.region === filter)),
    [filter],
  );

  // Feed the dome: real image + everything the enlarged caption needs.
  const domeImages = useMemo(
    () =>
      shots.map((p) => {
        const date = shotDate(p);
        return {
          src: photoThumb(p),
          alt: p.title,
          aspect: p.aspect,
          featured: p.featured,
          title: p.title,
          place: [p.place, date].filter(Boolean).join(' · '),
          exif: exifLine(p),
          tags: (p.tags || []).slice(0, 5).join(' | '),
        };
      }),
    [shots],
  );

  // 4 rows of masonry — enough vertical room for the 2×1 / 1×2 / 2×2 tiles to
  // interlock like brickwork, still shallow enough (with fit 0.44) that nothing
  // clips top or bottom. Columns ≈ half the photo count so every frame lands on
  // the wall at a readable size.
  const DOME_ROWS = 4;
  const segs = Math.max(14, Math.min(28, Math.round(domeImages.length * 0.46)));

  return (
    <section
      ref={sectionRef}
      id="photography"
      style={{ background: '#080809', position: 'relative', overflow: 'hidden', padding: 'var(--section-pad-y) 24px' }}
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
            Shot on an iPhone 14&nbsp;Pro — Canada, Kerala, Kutch, and one very loud night in Ahmedabad.
          </p>
        </motion.div>

        {/* Region filter */}
        <div className="dk-filter" style={{ display: 'flex', justifyContent: 'center', gap: '9px', margin: '40px 0 26px', flexWrap: 'wrap' }}>
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

        {/* The dome. Mounted unconditionally — it gates its own animation to
            when it's on screen, so it doesn't lean on a whileInView trigger. */}
        <div className="dk-dome">
          <div className="dk-dome-glow" />
          <DomeGallery
            key={filter}
            images={domeImages}
            segments={segs}
            rows={DOME_ROWS}
            grayscale={false}
            overlayBlurColor="#080809"
            imageBorderRadius="9px"
            openedImageBorderRadius="18px"
            padFactor={0.1}
            fit={0.44}
            minRadius={320}
            maxVerticalRotationDeg={6}
            autoRotate
            autoRotateSpeed={0.045}
          />

          {/* Mirrorless-viewfinder chrome — pure overlay, clicks pass through to the dome */}
          <div className="dk-vf" aria-hidden="true">
            <span className="dk-vf-vignette" />
            <span className="dk-vf-third dk-vf-third-v1" /><span className="dk-vf-third dk-vf-third-v2" />
            <span className="dk-vf-third dk-vf-third-h1" /><span className="dk-vf-third dk-vf-third-h2" />
            <span className="dk-vf-c dk-vf-tl" /><span className="dk-vf-c dk-vf-tr" />
            <span className="dk-vf-c dk-vf-bl" /><span className="dk-vf-c dk-vf-br" />
            <span className="dk-vf-hud dk-vf-hud-tl"><span className="dk-vf-rec" />REC</span>
            <span className="dk-vf-hud dk-vf-hud-tr">iPHONE 14 PRO · ƒ1.8</span>
            <span className="dk-vf-hud dk-vf-hud-bl">AF-C</span>
            <span className="dk-vf-hud dk-vf-hud-br">{PHOTOS.length} FRAMES</span>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          {PHOTOS.length} frames · drag to spin · click one for the details
        </p>
      </div>

      <style>{`
        .dk-dome {
          position: relative;
          height: clamp(540px, 82vh, 780px);
          overflow: hidden;
          background: #080809;
        }
        .dk-dome-glow {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 52% at 50% 50%, rgba(232,147,90,0.09), transparent 72%);
        }
        .dk-filter::-webkit-scrollbar { display: none; }
        @media (max-width: 560px) {
          .dk-dome { height: clamp(440px, 66vh, 560px); }
        }

        /* Mirrorless-EVF chrome laid over the dome */
        .dk-vf { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
        .dk-vf-vignette {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 90px 20px rgba(0,0,0,0.55);
          border: 1px solid rgba(232,147,90,0.12);
        }
        .dk-vf-third { position: absolute; background: rgba(232,147,90,0.07); }
        .dk-vf-third-v1 { left: 33.33%; top: 0; bottom: 0; width: 1px; }
        .dk-vf-third-v2 { left: 66.66%; top: 0; bottom: 0; width: 1px; }
        .dk-vf-third-h1 { top: 33.33%; left: 0; right: 0; height: 1px; }
        .dk-vf-third-h2 { top: 66.66%; left: 0; right: 0; height: 1px; }
        .dk-vf-c { position: absolute; width: 26px; height: 26px; border: 1.5px solid rgba(232,147,90,0.5); }
        .dk-vf-tl { top: 16px; left: 16px; border-right: 0; border-bottom: 0; }
        .dk-vf-tr { top: 16px; right: 16px; border-left: 0; border-bottom: 0; }
        .dk-vf-bl { bottom: 16px; left: 16px; border-right: 0; border-top: 0; }
        .dk-vf-br { bottom: 16px; right: 16px; border-left: 0; border-top: 0; }
        .dk-vf-hud {
          position: absolute; display: flex; align-items: center; gap: 5px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em;
          color: rgba(232,147,90,0.75); text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        }
        .dk-vf-hud-tl { top: 22px; left: 50px; }
        .dk-vf-hud-tr { top: 22px; right: 50px; }
        .dk-vf-hud-bl { bottom: 22px; left: 50px; }
        .dk-vf-hud-br { bottom: 22px; right: 50px; }
        .dk-vf-rec { width: 6px; height: 6px; border-radius: 50%; background: #E8935A; animation: dk-vf-blink 1.4s ease-in-out infinite; }
        @keyframes dk-vf-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        @media (prefers-reduced-motion: reduce) {
          .dk-vf-rec { animation: none; }
        }
      `}</style>
    </section>
  );
}
