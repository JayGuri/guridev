'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Only plays on the first page load within a browser session.
// sessionStorage persists across soft navigations but clears when the tab closes,
// giving the animation a fresh run on each new visit without repeating on every route change.
export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(null); // null = not yet determined

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (hasLoaded) {
      // Already seen — skip entirely
      setIsLoading(false);
      return;
    }

    // First visit this session — lock scroll while animating
    document.body.style.overflow = 'hidden';
    setIsLoading(true);

    // Step 3 finishes at ~2.4s (delay 1.7 + duration 0.7).
    // Add a small buffer so the exit is fully painted before unmounting.
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasLoaded', 'true');
      document.body.style.overflow = '';
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Haven't determined state yet — render nothing to avoid flash
  if (isLoading === null) return null;

  return (
    <AnimatePresence>
      {isLoading && (
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
