'use client';

import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import FilmGrain from '@/components/effects/FilmGrain';
import Lightbox from '@/components/ui/Lightbox';
import { PHOTOS, CATEGORIES, cld, blurUrl } from '@/lib/photography';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const SHUTTER_EASE = [0.76, 0, 0.24, 1];

function PhotoCard({ photo, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className="darkroom-photo"
      style={{
        breakInside: 'avoid',
        marginBottom: '12px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <Image
        src={cld(photo.publicId, 'w_800,c_fill,f_auto,q_80')}
        blurDataURL={blurUrl(photo.publicId)}
        placeholder="blur"
        width={800}
        height={600}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        alt={photo.title}
      />

      {/* Hover overlay */}
      <div className="darkroom-overlay">
        <div className="darkroom-overlay-text">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#fff',
              fontWeight: 500,
            }}
          >
            {photo.title}
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '2px',
            }}
          >
            {photo.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Darkroom() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredPhotos =
    activeCategory === 'all'
      ? PHOTOS
      : PHOTOS.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="photography"
      style={{
        background: '#080809',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 24px',
      }}
    >
      <FilmGrain />

      {/* ── Shutter panels ── */}
      <motion.div
        initial={{ y: 0 }}
        animate={inView ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER_EASE }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#080809',
          zIndex: 10,
        }}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={inView ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: SHUTTER_EASE }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#080809',
          zIndex: 10,
        }}
      />

      {/* ── Header ── */}
      <div style={{ position: 'relative', zIndex: 20, maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
          style={{ textAlign: 'center' }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-photo)',
              marginBottom: '16px',
            }}
          >
            · photography ·
          </p>
          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Stories the eye misses.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '12px',
            }}
          >
            Mumbai through a Sony &alpha;7 III.
          </p>
        </motion.div>

        {/* ── Category filter ── */}
        <div
          className="darkroom-filter"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            margin: '48px 0',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                style={{
                  flexShrink: 0,
                  background: active ? 'var(--accent-photo)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: active
                    ? '1px solid var(--accent-photo)'
                    : '1px solid rgba(255,255,255,0.15)',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Photo grid ── */}
        <div
          className="darkroom-grid"
          style={{
            columns: '3',
            columnGap: '12px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <PhotoCard
                  photo={photo}
                  index={i}
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Footer note ── */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '60px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
            fontStyle: 'italic',
          }}
        >
          Shot on Sony &alpha;7 III &middot; All photos &copy; Jay Guri
        </p>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            photos={filteredPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNext={() =>
              setLightboxIndex((i) => (i + 1) % filteredPhotos.length)
            }
            onPrev={() =>
              setLightboxIndex(
                (i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length
              )
            }
          />
        )}
      </AnimatePresence>

      {/* ── Responsive + hover styles ── */}
      <style>{`
        .darkroom-filter::-webkit-scrollbar { display: none; }

        .darkroom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
        }
        .darkroom-overlay-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px 16px 16px;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          transform: translateY(10px);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .darkroom-photo:hover .darkroom-overlay {
          background: rgba(0,0,0,0.5);
        }
        .darkroom-photo:hover .darkroom-overlay-text {
          transform: translateY(0);
          opacity: 1;
        }

        @media (max-width: 1023px) {
          .darkroom-grid { columns: 2 !important; }
        }
        @media (max-width: 639px) {
          .darkroom-grid { columns: 1 !important; }
        }
      `}</style>
    </section>
  );
}
