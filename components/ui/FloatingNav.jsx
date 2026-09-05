'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

// Section id → label. Order matches the page. `photo` sections carry the
// orange accent; everything else is the purple dev accent.
const SECTIONS = [
  { id: 'work',             label: 'Work' },
  { id: 'research',         label: 'Research' },
  { id: 'experience',       label: 'Experience' },
  { id: 'skills',           label: 'Skills' },
  { id: 'education',        label: 'Education' },
  { id: 'extracurriculars', label: 'Leadership' },
  { id: 'photography',      label: 'Photography', photo: true },
  { id: 'contact',          label: 'Contact' },
];

// Extra ids we watch only to keep the active state honest (hero clears it,
// #me belongs to the photography stretch).
const OBSERVED = ['hero', ...SECTIONS.map((s) => s.id), 'me'];
const ALIAS = { me: 'photography' };

const THEME_EVENT = 'app-theme-change';

function subscribeTheme(cb) {
  window.addEventListener(THEME_EVENT, cb);
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => {
    window.removeEventListener(THEME_EVENT, cb);
    mq.removeEventListener('change', cb);
  };
}
function getThemeSnapshot() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
  } catch { /* private mode */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function FloatingNav() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Reveal once the hero is mostly scrolled past.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setRevealed(window.scrollY > window.innerHeight * 0.6);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Active section — most-visible of the observed ids.
  useEffect(() => {
    const seen = new Map();
    const obs = OBSERVED.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => {
          seen.set(id, e.intersectionRatio);
          let best = null; let bestRatio = 0;
          for (const [k, r] of seen) if (r > bestRatio) { best = k; bestRatio = r; }
          if (!best || best === 'hero' || bestRatio < 0.1) { setActive(null); return; }
          setActive(ALIAS[best] ?? best);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75] },
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o && o.disconnect());
  }, []);

  // Lock scroll + Esc-to-close while the mobile overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  const go = useCallback((id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const cls = (s) =>
    `${active === s.id ? 'is-active' : ''}${s.photo ? ' is-photo' : ''}`.trim();

  return (
    <>
      <AnimatePresence>
        {mounted && revealed && (
          <motion.nav
            key="fnav"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fnav"
            aria-label="Primary"
          >
            <div className="fnav-pill">
              <button className="fnav-mono" onClick={() => go('hero')} aria-label="Back to top">JG</button>

              <span className="fnav-div fnav-div--links" />

              <div className="fnav-links">
                {SECTIONS.map((s) => (
                  <button key={s.id} className={`fnav-link ${cls(s)}`} onClick={() => go(s.id)}>
                    <span className="fnav-caret">❯</span>{s.label}
                  </button>
                ))}
              </div>

              <span className="fnav-div fnav-div--links" />

              <button className="fnav-toggle" onClick={toggleTheme} aria-label="Toggle colour theme">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              <button
                className="fnav-burger"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <span /><span /><span />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fnav-overlay"
            className="fnav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            <button className="fnav-overlay-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>

            <nav className="fnav-overlay-list" aria-label="Sections">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EASE }}
                  className={`fnav-overlay-link ${cls(s)}`}
                  onClick={() => go(s.id)}
                >
                  <span className="fnav-overlay-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="fnav-overlay-caret">❯</span>
                  {s.label}
                </motion.button>
              ))}
            </nav>

            <div className="fnav-overlay-foot">
              <button onClick={toggleTheme}>
                {theme === 'dark' ? 'light mode' : 'dark mode'}
              </button>
              <a href="https://github.com/jayguri" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/jay-guri-223b16289" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Full-width flex strip so Framer Motion's transform (y-slide) never
           fights a CSS translateX used for centring. */
        .fnav {
          position: fixed; top: 20px; left: 0; right: 0;
          z-index: 1100; display: flex; justify-content: center;
          padding: 0 12px; pointer-events: none;
        }
        .fnav-pill {
          pointer-events: auto; max-width: 100%;
          display: flex; align-items: center; gap: 3px;
          padding: 7px 10px 7px 15px;
          background: rgba(15,15,18,0.82);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          box-shadow: 0 10px 34px rgba(0,0,0,0.30);
        }
        :root[data-theme="light"] .fnav-pill { background: rgba(255,255,255,0.82); }
        @media (prefers-color-scheme: light) {
          :root:not([data-theme="dark"]) .fnav-pill { background: rgba(255,255,255,0.82); }
        }

        .fnav-mono {
          font-family: 'Clash Display', sans-serif; font-size: 15px; font-weight: 600;
          letter-spacing: 0.02em; color: var(--text-primary);
          background: none; border: 0; cursor: pointer; padding: 0 5px;
        }
        .fnav-div { width: 1px; height: 18px; background: var(--border-subtle); margin: 0 7px; flex-shrink: 0; }

        .fnav-links { display: flex; align-items: center; gap: 1px; }
        .fnav-link {
          display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          background: none; border: 0; border-radius: 999px; padding: 5px 11px;
          cursor: pointer; transition: color 0.16s ease, background 0.16s ease;
        }
        .fnav-caret {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--text-tertiary); transition: color 0.16s ease;
        }
        .fnav-link:hover { color: var(--text-primary); }
        .fnav-link:hover .fnav-caret { color: var(--accent-dev); }
        .fnav-link.is-active { color: var(--accent-dev); background: rgba(124,111,247,0.13); }
        .fnav-link.is-active .fnav-caret { color: var(--accent-dev); }
        .fnav-link.is-active.is-photo { color: var(--accent-photo); background: rgba(232,147,90,0.13); }
        .fnav-link.is-active.is-photo .fnav-caret { color: var(--accent-photo); }

        .fnav-toggle {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; flex-shrink: 0;
          background: transparent; border: 1px solid var(--border-subtle); border-radius: 8px;
          color: var(--text-secondary); cursor: pointer; transition: color 0.15s ease, border-color 0.15s ease;
        }
        .fnav-toggle:hover { color: var(--text-primary); border-color: var(--border-hover); }

        .fnav-burger {
          display: none; flex-direction: column; align-items: center; justify-content: center;
          gap: 4px; width: 34px; height: 30px; flex-shrink: 0;
          background: none; border: 0; cursor: pointer; padding: 0;
        }
        .fnav-burger span { width: 16px; height: 1.5px; background: var(--text-secondary); border-radius: 2px; transition: background 0.15s ease; }
        .fnav-burger:hover span { background: var(--text-primary); }

        @media (max-width: 960px) {
          .fnav-links, .fnav-div--links { display: none; }
          .fnav-burger { display: flex; }
        }

        /* ── Mobile overlay ─────────────────────────────────────────── */
        .fnav-overlay {
          position: fixed; inset: 0; z-index: 1200;
          display: flex; flex-direction: column; justify-content: center;
          padding: 88px 32px 40px;
          background: rgba(8,8,9,0.97);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        }
        :root[data-theme="light"] .fnav-overlay { background: rgba(250,250,247,0.98); }
        @media (prefers-color-scheme: light) {
          :root:not([data-theme="dark"]) .fnav-overlay { background: rgba(250,250,247,0.98); }
        }
        .fnav-overlay-close {
          position: absolute; top: 22px; right: 22px;
          width: 42px; height: 42px; border-radius: 11px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          color: var(--text-secondary); font-size: 15px; cursor: pointer;
        }
        .fnav-overlay-list { display: flex; flex-direction: column; gap: 2px; }
        .fnav-overlay-link {
          display: flex; align-items: center; gap: 14px; text-align: left;
          font-family: 'Clash Display', sans-serif; font-weight: 600;
          font-size: clamp(26px, 7vw, 40px); letter-spacing: -0.02em; line-height: 1.15;
          color: var(--text-primary); background: none; border: 0; padding: 8px 0; cursor: pointer;
        }
        .fnav-overlay-idx {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500;
          color: var(--text-tertiary); width: 22px; flex-shrink: 0;
        }
        .fnav-overlay-caret { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text-tertiary); flex-shrink: 0; }
        .fnav-overlay-link.is-active { color: var(--accent-dev); }
        .fnav-overlay-link.is-active.is-photo { color: var(--accent-photo); }
        .fnav-overlay-link.is-active .fnav-overlay-caret { color: inherit; }
        .fnav-overlay-foot {
          display: flex; flex-wrap: wrap; gap: 18px; margin-top: 30px; padding-top: 22px;
          border-top: 1px solid var(--border-subtle);
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
        }
        .fnav-overlay-foot a, .fnav-overlay-foot button {
          color: var(--text-secondary); text-decoration: none;
          background: none; border: 0; cursor: pointer; font: inherit; padding: 0;
        }
        .fnav-overlay-foot a:hover, .fnav-overlay-foot button:hover { color: var(--text-primary); }
        @media (min-width: 961px) { .fnav-overlay { display: none; } }

        @media (prefers-reduced-motion: reduce) {
          .fnav, .fnav-overlay, .fnav-overlay-link { transition: none !important; }
        }
      `}</style>
    </>
  );
}
