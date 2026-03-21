'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

// Only plays on the first page load within a browser session.
// sessionStorage persists across soft navigations but clears when the tab closes,
// giving the animation a fresh run on each new visit without repeating on every route change.
export default function LoadingScreen() {
  const hasLoaded = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem('hasLoaded') === 'true',
    () => false
  );

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (hasLoaded) return;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem('hasLoaded', 'true');
      document.body.style.overflow = '';
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasLoaded]);

  if (hasLoaded || dismissed) return null;

  return (
    <AnimatePresence>
      {!hasLoaded && !dismissed && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            delay: 1.7,
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#080809',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {/* ── Initials ───────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '4px', overflow: 'hidden' }}>
            {['J', 'G'].map((letter, i) => (
              <motion.span
                key={letter}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: i === 0 ? 0.3 : 0.5,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: '72px',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  display: 'inline-block',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* ── Rule line ──────────────────────────────────────── */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 1.1,
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{
              width: '100px',
              height: '1px',
              background: '#ffffff',
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
