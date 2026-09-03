'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

const noopSubscribe = () => () => {};

// Boot log — reads like the site compiling itself. Each line lights up in sequence.
const BOOT_STEPS = [
  { label: 'loading identity', tag: 'about' },
  { label: 'compiling the studio', tag: 'work' },
  { label: 'developing negatives', tag: 'photos' },
  { label: 'brewing chai', tag: 'always' },
];

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN = [0.76, 0, 0.24, 1];

// Only plays on the first page load within a browser session.
// sessionStorage persists across soft navigations but clears when the tab closes,
// giving the animation a fresh run on each new visit without repeating on every route change.
export default function LoadingScreen() {
  const hasLoaded = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem('hasLoaded') === 'true',
    () => false
  );
  const prefersReduced = useReducedMotion();

  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (hasLoaded) return;
    document.body.style.overflow = 'hidden';

    const total = prefersReduced ? 700 : 2500;
    const timer = setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem('hasLoaded', 'true');
      document.body.style.overflow = '';
    }, total);

    let stepTimers = [];
    if (!prefersReduced) {
      stepTimers = BOOT_STEPS.map((_, i) =>
        setTimeout(() => setStep(i + 1), 420 + i * 300)
      );
    } else {
      setStep(BOOT_STEPS.length);
    }

    return () => {
      clearTimeout(timer);
      stepTimers.forEach(clearTimeout);
    };
  }, [hasLoaded, prefersReduced]);

  if (hasLoaded || dismissed) return null;

  return (
    <AnimatePresence>
      {!hasLoaded && !dismissed && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { y: '-100%' }}
          transition={{
            delay: prefersReduced ? 0 : 1.75,
            duration: prefersReduced ? 0.3 : 0.7,
            ease: EASE_IN,
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(124,111,247,0.10), transparent 70%), #060608',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
          }}
        >
          {/* ── Monogram ───────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
            {['J', 'G'].map((letter, i) => (
              <motion.span
                key={letter}
                initial={prefersReduced ? { y: 0, opacity: 1 } : { y: 52, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: prefersReduced ? 0 : i === 0 ? 0.25 : 0.42,
                  duration: 0.65,
                  ease: EASE_OUT,
                }}
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(64px, 12vw, 92px)',
                  fontWeight: 600,
                  color: '#F4F2ED',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                  display: 'inline-block',
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: prefersReduced ? 0 : 0.7, duration: 0.4, ease: EASE_OUT }}
              style={{
                width: 'clamp(9px, 1.6vw, 12px)',
                height: 'clamp(9px, 1.6vw, 12px)',
                borderRadius: '2px',
                background: '#7C6FF7',
                marginLeft: '6px',
                marginBottom: 'clamp(6px, 1.4vw, 10px)',
              }}
            />
          </div>

          {/* ── Boot log ───────────────────────────────────────── */}
          <div
            style={{
              width: 'min(320px, 78vw)',
              display: 'flex',
              flexDirection: 'column',
              gap: '7px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
            }}
          >
            {BOOT_STEPS.map((s, i) => {
              const done = step > i;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: done ? 1 : 0.22 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    color: '#8A8880',
                  }}
                >
                  <span style={{ color: done ? '#28C840' : '#3A3A40', width: '10px' }}>
                    {done ? '✓' : '·'}
                  </span>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ color: '#4A4845', fontSize: '10px', letterSpacing: '0.06em' }}>
                    {s.tag}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* ── Progress rail ──────────────────────────────────── */}
          <div
            style={{
              width: 'min(320px, 78vw)',
              height: '2px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: prefersReduced ? 0 : 0.35,
                duration: prefersReduced ? 0.3 : 1.5,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              style={{
                height: '100%',
                width: '100%',
                background: 'linear-gradient(90deg, #7C6FF7, #9d93ff)',
                transformOrigin: 'left',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
