'use client';

import { useRef, useEffect } from 'react';

// Infinite horizontal marquee.
// Duplicates the logos array so the loop is visually seamless.
// Speed is controlled via a ref so hover slow-down never causes a
// re-render / animation restart — the rAF loop just reads the ref.
export default function LogoLoop({
  logos = [],
  speed = 80,
  direction = 'left',
  logoHeight = 40,
  gap = 48,
  hoverSpeed = 20,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#000',
  ariaLabel = 'Logo marquee',
}) {
  const trackRef   = useRef(null);
  const posRef     = useRef(0);
  const rafRef     = useRef(null);
  const lastTRef   = useRef(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // For right-to-left we start at zero and decrement.
    // setWidth is half the track (since we duplicated logos).
    const getSetWidth = () => track.scrollWidth / 2;

    // Start right-direction at negative setWidth so it scrolls into view.
    if (direction === 'right') {
      posRef.current = -getSetWidth();
    }

    const animate = (time) => {
      if (!lastTRef.current) lastTRef.current = time;
      // Cap delta to 50ms so a background tab doesn't cause a jump on resume.
      const delta = Math.min((time - lastTRef.current) / 1000, 0.05);
      lastTRef.current = time;

      const spd = hoveredRef.current ? hoverSpeed : speed;
      const setW = getSetWidth();

      if (direction === 'left') {
        posRef.current -= spd * delta;
        if (posRef.current <= -setW) posRef.current += setW;
      } else {
        posRef.current += spd * delta;
        if (posRef.current >= 0) posRef.current -= setW;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, hoverSpeed, direction]); // only restarts if props themselves change

  // Duplicate for seamless wrap
  const items = [...logos, ...logos];

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      {/* Edge fade-out overlays */}
      {fadeOut && (
        <>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', zIndex: 2,
            background: `linear-gradient(to right, ${fadeOutColor} 20%, transparent)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', zIndex: 2,
            background: `linear-gradient(to left, ${fadeOutColor} 20%, transparent)`,
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Moving track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${gap}px`,
          width: 'max-content',
          height: '100%',
          willChange: 'transform',
          paddingLeft: `${gap}px`,
        }}
      >
        {items.map((logo, i) => (
          <div
            key={i}
            title={logo.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              height: `${logoHeight}px`,
              flexShrink: 0,
              cursor: 'default',
              fontSize: `${logoHeight * 0.7}px`,
              color: 'var(--text-secondary)',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (scaleOnHover) e.currentTarget.style.transform = 'scale(1.25)';
              e.currentTarget.style.color = 'var(--accent-dev, #7C6FF7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = '';
            }}
          >
            {logo.node}
            {logo.title && (
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                color: 'inherit',
                whiteSpace: 'nowrap',
              }}>
                {logo.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
