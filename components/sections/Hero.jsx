'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Role words and their accent colours
const ROLES = ['Developer', 'Researcher', 'Photographer', 'Builder'];

const ROLE_COLORS = {
  Developer: '#7C6FF7',
  Researcher: '#7C6FF7',
  Builder: '#7C6FF7',
  Photographer: '#E8935A',
};

// Eases reused across multiple elements
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_IN_EXPO = [0.76, 0, 0.24, 1];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const prefersReduced = useReducedMotion();

  // Helpers: with reduced motion every element appears instantly in place.
  const fadeUp = (delay = 0) =>
    prefersReduced
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE_OUT_EXPO },
        };

  const bigSlide = (delay = 0, distance = 60) =>
    prefersReduced
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.9, ease: EASE_OUT_EXPO },
        };

  // ── Morphing role word ───────────────────────────────────────────────
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2500
    );
    return () => clearInterval(id);
  }, []);

  const currentRole = ROLES[roleIndex];

  // ── Scroll indicator visibility ──────────────────────────────────────
  const [scrollVisible, setScrollVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrollVisible(window.scrollY <= 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mouse parallax glow ──────────────────────────────────────────────
  // Store both the target (raw mouse) and the smoothed current position in refs
  // to avoid unnecessary re-renders — only the DOM transform is mutated.
  const glowRef = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      // Normalise to -0.5 … +0.5 relative to viewport centre
      mouseTarget.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      };
    };

    const animate = () => {
      const lerp = 0.05;
      mouseCurrent.current.x +=
        (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
      mouseCurrent.current.y +=
        (mouseTarget.current.y - mouseCurrent.current.y) * lerp;

      if (glowRef.current) {
        const tx = mouseCurrent.current.x / 25;
        const ty = mouseCurrent.current.y / 25;
        glowRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      {/* ── Background glow ──────────────────────────────────────────── */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,111,247,0.12), transparent)',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '900px',
        }}
      >
        {/* a) Location pill */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReduced ? {} : { delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }}
          style={{
            display: 'inline-block',
            border: '1px solid var(--border-subtle)',
            background: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '32px',
          }}
        >
          Mumbai, India
        </motion.div>

        {/* b) Name */}
        <motion.h1
          {...bigSlide(0.4, 60)}
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(56px, 9vw, 112px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: '8px',
          }}
        >
          Jay Guri
        </motion.h1>

        {/* c) Morphing role word */}
        <div
          style={{
            height: 'clamp(58px, 8vw, 96px)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRole}
              initial={
                prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }
              }
              transition={
                prefersReduced
                  ? {}
                  : {
                      enter: { duration: 0.5, ease: EASE_OUT_EXPO },
                      exit: { duration: 0.3, ease: EASE_IN_EXPO },
                      duration: 0.5,
                      ease: EASE_OUT_EXPO,
                    }
              }
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(48px, 7vw, 90px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: ROLE_COLORS[currentRole],
                transition: 'color 0.3s',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              {currentRole}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* d) Tagline */}
        <motion.p
          {...fadeUp(1.0)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            lineHeight: 1.6,
            marginBottom: '48px',
          }}
        >
          I build things that work. I shoot things that stay.
        </motion.p>

        {/* e) CTA buttons */}
        <motion.div
          {...fadeUp(1.2)}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={() => scrollTo('work')}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
              background: 'var(--accent-dev)',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            See my work
          </button>

          <button
            onClick={() => scrollTo('photography')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(232,147,90,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--accent-photo)',
              color: 'var(--accent-photo)',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            View photos
          </button>
        </motion.div>
      </div>

      {/* f) Terminal shortcut hint — fades in after 3s, bottom-left */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReduced ? {} : { delay: 3.2, duration: 0.7, ease: EASE_OUT_EXPO }}
        style={{
          position: 'absolute',
          bottom: '44px',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Blinking terminal cursor */}
        <span style={{
          display: 'inline-block',
          width: '7px',
          height: '14px',
          background: '#3fb950',
          borderRadius: '1px',
          animation: 'termHintBlink 1s step-end infinite',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.02em',
        }}>
          press{' '}
          <kbd style={{
            fontFamily: 'inherit',
            fontSize: '11px',
            color: '#3fb950',
            background: 'rgba(63,185,80,0.1)',
            border: '1px solid rgba(63,185,80,0.3)',
            borderRadius: '4px',
            padding: '1px 5px',
          }}>Ctrl</kbd>
          {' + '}
          <kbd style={{
            fontFamily: 'inherit',
            fontSize: '11px',
            color: '#3fb950',
            background: 'rgba(63,185,80,0.1)',
            border: '1px solid rgba(63,185,80,0.3)',
            borderRadius: '4px',
            padding: '1px 5px',
          }}>{'\u0060'}</kbd>
          {' '}to open terminal
        </span>
        <style>{`@keyframes termHintBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </motion.div>

      {/* g) Scroll indicator */}
      <AnimatePresence>
        {scrollVisible && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReduced ? {} : { delay: 1.8, duration: 0.7 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '1px',
                height: '48px',
                background: 'var(--text-tertiary)',
                animation: 'scrollPulse 1.5s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              scroll
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator keyframe — scoped inside the section */}
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}
