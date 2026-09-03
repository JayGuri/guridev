'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photoFull, photoBlur, hasImage } from '@/lib/photography';

const EASE = [0.16, 1, 0.3, 1];

function exifLine(p) {
  const e = p.exif || {};
  const bits = [
    e.camera,
    e.focalLength ? `${e.focalLength}mm` : null,
    e.aperture ? `f/${e.aperture}` : null,
    e.shutter,
    e.iso ? `ISO ${e.iso}` : null,
  ].filter(Boolean);
  return bits.join('  ·  ');
}

function shotDate(p) {
  if (!p.shotAt) return null;
  try {
    return new Date(p.shotAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return null; }
}

export default function Lightbox({ photos, index, onClose, onNext, onPrev }) {
  const [dir, setDir] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { setDir(1); onNext(); }
      else if (e.key === 'ArrowLeft') { setDir(-1); onPrev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  if (!photos?.length || index == null) return null;
  const photo = photos[index];
  const live = hasImage(photo);

  const navBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)',
    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(4,4,5,0.96)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', maxWidth: 'min(1100px, 94vw)', maxHeight: '90vh', width: '100%', alignItems: 'center' }}
        className="lb-panel"
      >
        <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {live ? (
            <img src={photoFull(photo)} alt={photo.title}
              style={{ maxWidth: '100%', maxHeight: '74vh', objectFit: 'contain', display: 'block', borderRadius: '4px' }} />
          ) : (
            <div style={{
              width: 'min(520px, 80vw)', aspectRatio: String(photo.aspect || 1.4),
              borderRadius: '4px', overflow: 'hidden', position: 'relative',
              background: `#111 center/cover no-repeat url(${photoBlur(photo)})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(18px)', background: 'rgba(0,0,0,0.25)' }} />
              <span style={{ position: 'relative', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(232,147,90,0.85)' }}>
                NOT YET DEVELOPED
              </span>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lb-info" style={{ width: '100%', maxWidth: '820px', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '20px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{photo.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>
                {photo.place}{shotDate(photo) ? ` · ${shotDate(photo)}` : ''}
              </p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              {index + 1} / {photos.length}
            </span>
          </div>

          {exifLine(photo) && (
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em', marginTop: '10px' }}>
              {exifLine(photo)}
            </p>
          )}

          {photo.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {photo.tags.map((t) => (
                <span key={t} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(232,147,90,0.9)', background: 'rgba(232,147,90,0.12)', border: '1px solid rgba(232,147,90,0.28)', borderRadius: '999px', padding: '3px 10px' }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <button onClick={(e) => { e.stopPropagation(); setDir(-1); onPrev(); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        style={{ ...navBtn, left: '20px' }} aria-label="Previous">
        <ChevronLeft size={22} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); setDir(1); onNext(); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        style={{ ...navBtn, right: '20px' }} aria-label="Next">
        <ChevronRight size={22} />
      </button>
      <button onClick={onClose}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        style={{ ...navBtn, top: '20px', right: '20px', transform: 'none' }} aria-label="Close">
        <X size={20} />
      </button>
    </motion.div>
  );
}
