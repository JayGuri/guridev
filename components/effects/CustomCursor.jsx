'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const isTouch = useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia('(pointer: coarse)').matches,
    () => true
  );
  const [isHovering, setIsHovering] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      const factor = 0.1;
      ringPos.current.x += (target.current.x - ringPos.current.x) * factor;
      ringPos.current.y += (target.current.y - ringPos.current.y) * factor;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    // Hover detection on interactive elements
    const timer = setTimeout(() => {
      const interactives = document.querySelectorAll('a, button, [role="button"]');
      const enter = () => setIsHovering(true);
      const leave = () => setIsHovering(false);

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    }, 200);

    // Photography section observer
    const photoEl = document.getElementById('photography');
    let photoObserver;
    if (photoEl) {
      photoObserver = new IntersectionObserver(
        ([entry]) => setIsPhoto(entry.isIntersecting),
        { threshold: 0.3 }
      );
      photoObserver.observe(photoEl);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
      photoObserver?.disconnect();
    };
  }, [isTouch]);

  if (isTouch) return null;

  const accentVar = isPhoto ? 'var(--accent-photo)' : 'var(--accent-dev)';
  const dotSize = isHovering ? 4 : 6;
  const ringSize = isHovering ? 52 : 38;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: '50%',
          background: accentVar,
          opacity: isHovering ? 0.5 : 1,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          zIndex: 9998,
          pointerEvents: 'none',
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderRadius: '50%',
          border: `1.5px solid ${isPhoto ? 'rgba(232,147,90,0.5)' : 'rgba(124,111,247,0.5)'}`,
          background: 'transparent',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  );
}
