'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', accent: 'dev' },
  { id: 'about', accent: 'dev' },
  { id: 'work', accent: 'dev' },
  { id: 'research', accent: 'dev' },
  { id: 'photography', accent: 'photo' },
  { id: 'me', accent: 'photo' },
  { id: 'contact', accent: 'dev' },
];

const THEME_EVENT = 'app-theme-change';

function subscribeTheme(callback) {
  window.addEventListener(THEME_EVENT, callback);
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    mq.removeEventListener('change', callback);
  };
}

function getThemeSnapshot() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark');

  // Sync data-theme attribute with external store
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show/hide on scroll threshold
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observers = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const activeMeta = SECTIONS.find((s) => s.id === activeSection);
  const dotActiveColor =
    activeMeta?.accent === 'photo' ? 'var(--accent-photo)' : 'var(--accent-dev)';

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="floating-nav"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(15,15,18,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* JG monogram */}
          <span
            onClick={() => scrollTo('hero')}
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: '16px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            JG
          </span>

          {/* Section dots — hidden on mobile via CSS */}
          <div
            className="floating-nav-dots"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {SECTIONS.map(({ id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  aria-label={`Go to ${id}`}
                  style={{
                    width: isActive ? '20px' : '7px',
                    height: '7px',
                    borderRadius: isActive ? '999px' : '50%',
                    background: isActive ? dotActiveColor : 'var(--border-hover)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'border-color 0.2s ease',
            }}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-secondary)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-secondary)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <style>{`
            @media (max-width: 767px) {
              .floating-nav-dots { display: none !important; }
            }
          `}</style>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
