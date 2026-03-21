'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Terminal color palette (GitHub dark) ─────────────────────────────────────
const T = {
  bg:     '#0d1117',
  bg2:    '#161b22',
  bg3:    '#21262d',
  border: '#30363d',
  text:   '#e6edf3',
  muted:  '#7d8590',
  dim:    '#3d444d',
  green:  '#3fb950',
  blue:   '#79c0ff',
  orange: '#ffa657',
  purple: '#bc8cff',
  red:    '#f85149',
};

// ── Nav commands ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'home',
    targetId: 'hero',
    mobileVisible: true,
    label: (
      <>
        <span style={{ color: T.green }}>cd</span>
        {' '}
        <span style={{ color: T.orange }}>./home</span>
      </>
    ),
  },
  {
    id: 'dev',
    targetId: 'work',
    mobileVisible: true,
    label: (
      <>
        <span style={{ color: T.blue }}>--</span>
        <span style={{ color: T.green }}>dev</span>
      </>
    ),
  },
  {
    id: 'research',
    targetId: 'research',
    mobileVisible: false,
    label: (
      <>
        <span style={{ color: T.blue }}>--</span>
        <span style={{ color: T.green }}>research</span>
      </>
    ),
  },
  {
    id: 'photography',
    targetId: 'photography',
    mobileVisible: true,
    label: (
      <>
        <span style={{ color: T.blue }}>--</span>
        <span style={{ color: T.green }}>photography</span>
      </>
    ),
  },
  {
    id: 'projects',
    targetId: 'work',
    mobileVisible: false,
    label: (
      <>
        <span style={{ color: T.green }}>ls</span>
        <span style={{ color: T.blue }}> -la</span>
        <span style={{ color: T.orange }}> ./projects</span>
      </>
    ),
  },
  {
    id: 'about',
    targetId: 'about',
    mobileVisible: false,
    label: (
      <>
        <span style={{ color: T.green }}>cat</span>
        <span style={{ color: T.orange }}> about.md</span>
      </>
    ),
  },
  {
    id: 'contact',
    targetId: 'contact',
    mobileVisible: true,
    label: (
      <>
        <span style={{ color: T.green }}>curl</span>
        <span style={{ color: T.orange }}> contact.json</span>
      </>
    ),
  },
];

const SECTION_IDS = ['hero', 'about', 'work', 'research', 'photography', 'me', 'contact'];

// Map section ID → nav item ID for active highlighting
const SECTION_TO_NAV = {
  hero:        'home',
  about:       'about',
  work:        'dev',
  research:    'research',
  photography: 'photography',
  me:          'about',
  contact:     'contact',
};

// ── Theme via useSyncExternalStore ────────────────────────────────────────────
const THEME_EVENT = 'app-theme-change';

function subscribeTheme(cb) {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
}
function getThemeSnapshot() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ── NavButton ─────────────────────────────────────────────────────────────────
function NavButton({ item, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    padding: '4px 11px',
    borderRadius: '6px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    border: isActive
      ? '1px solid rgba(56,139,253,0.35)'
      : hovered
        ? `1px solid ${T.border}`
        : '1px solid transparent',
    background: isActive ? '#1f2937' : hovered ? T.bg3 : 'transparent',
    color: isActive || hovered ? T.text : T.muted,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {item.label}
    </button>
  );
}

// ── Clock via useSyncExternalStore ────────────────────────────────────────────
const fmtTime = () =>
  typeof window === 'undefined'
    ? ''
    : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

let clockListeners = [];
let clockInterval = null;

function subscribeClockStore(cb) {
  clockListeners.push(cb);
  if (!clockInterval) {
    clockInterval = setInterval(() => {
      clockListeners.forEach((fn) => fn());
    }, 30000);
  }
  return () => {
    clockListeners = clockListeners.filter((fn) => fn !== cb);
    if (clockListeners.length === 0 && clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  };
}

function Clock() {
  const time = useSyncExternalStore(subscribeClockStore, fmtTime, () => '');
  return <span>{time}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TerminalNav() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark');

  // Sync data-theme on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show after 80px scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const activeNavId = SECTION_TO_NAV[activeSection] ?? 'home';
  const sectionLabel = activeSection === 'me' ? '~/me' : `~/${activeSection}`;

  // Build nav items with separators, filtering mobile on client
  const navRow = [];
  NAV_ITEMS.forEach((item, i) => {
    if (i > 0) {
      navRow.push(
        <span
          key={`sep-${i}`}
          className="t-sep"
          style={{ color: T.dim, fontSize: '12px', userSelect: 'none' }}
        >
          |
        </span>
      );
    }
    navRow.push(
      <span key={item.id} className={item.mobileVisible ? '' : 't-desktop-only'}>
        <NavButton
          item={item}
          isActive={activeNavId === item.id}
          onClick={() => scrollTo(item.targetId)}
        />
      </span>
    );
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* ── Layer 1: Title bar ─────────────────────────────────────── */}
          <div
            className="t-titlebar"
            style={{
              height: '44px',
              background: T.bg2,
              borderBottom: `1px solid ${T.bg3}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              {[
                { color: T.red,    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { color: '#febc2e', onClick: null },
                { color: '#28c840', onClick: null },
              ].map(({ color, onClick }, i) => (
                <div
                  key={i}
                  onClick={onClick ?? undefined}
                  style={{
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    background: color,
                    cursor: onClick ? 'pointer' : 'default',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Center: path + branch */}
            <div
              style={{
                fontSize: '12px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: T.orange }}>~/portfolio</span>
              <span style={{ color: T.muted }}>·</span>
              <span style={{ color: T.purple }}>⎇ main</span>
            </div>

            {/* Right spacer (mirrors left for centering) */}
            <div style={{ width: '60px' }} />
          </div>

          {/* ── Layer 2: Nav command bar ───────────────────────────────── */}
          <div
            style={{
              height: '44px',
              background: T.bg2,
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0 18px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Prompt */}
            <span
              style={{
                color: T.green,
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
                marginRight: '6px',
              }}
            >
              ❯
            </span>

            {/* Nav buttons */}
            {navRow}

            {/* Spacer pushes theme toggle + cursor to the right */}
            <div style={{ flex: 1 }} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'transparent',
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                padding: '3px 7px',
                color: T.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; }}
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
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
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Blinking cursor */}
            <div
              style={{
                width: '8px',
                height: '14px',
                background: T.green,
                flexShrink: 0,
                animation: 'tblink 1s step-end infinite',
              }}
            />
          </div>

          {/* ── Layer 3: Status bar ────────────────────────────────────── */}
          <div
            style={{
              height: '24px',
              background: '#388bfd',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: '11px',
              color: '#fff',
              gap: '8px',
              userSelect: 'none',
            }}
          >
            <span>NORMAL</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span className="t-status-full">{sectionLabel}</span>
            <span className="t-status-full" style={{ opacity: 0.6 }}>|</span>
            <span className="t-status-full">utf-8</span>
            <div style={{ marginLeft: 'auto' }}>
              <Clock />
            </div>
          </div>

          <style>{`
            @keyframes tblink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            /* Hide title bar on mobile */
            @media (max-width: 767px) {
              .t-titlebar { display: none !important; }
              .t-desktop-only { display: none !important; }
              .t-status-full { display: none !important; }
            }
            /* Hide scrollbar in webkit */
            div::-webkit-scrollbar { display: none; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
