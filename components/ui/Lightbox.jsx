'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cld, blurUrl } from '@/lib/photography';

export default function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }) {
  const [direction, setDirection] = useState(0);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (currentIndex > prevIndex.current) setDirection(1);
    else if (currentIndex < prevIndex.current) setDirection(-1);
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') { setDirection(1); onNext(); }
      else if (e.key === 'ArrowLeft') { setDirection(-1); onPrev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  if (!photos || !photos.length || currentIndex == null) return null;

  const photo = photos[currentIndex];

  const btnStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Image container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '88vh',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={photo.publicId}
            initial={{ opacity: 0.7, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.7, x: direction * -20 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={cld(photo.publicId, 'w_2400,f_auto,q_90')}
              blurDataURL={blurUrl(photo.publicId)}
              placeholder="blur"
              width={2400}
              height={1600}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '88vh',
                objectFit: 'contain',
                display: 'block',
              }}
              alt={photo.title}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom info bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '40px 24px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
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
                color: 'rgba(255,255,255,0.5)',
                marginTop: '4px',
              }}
            >
              {photo.location}
            </p>
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); setDirection(-1); onPrev(); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        style={{
          ...btnStyle,
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); setDirection(1); onNext(); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        style={{
          ...btnStyle,
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        style={{
          ...btnStyle,
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}
