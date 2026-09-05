'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Moon, Code2, Camera } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const NOW = [
  ['building', 'always something'],
  ['reading', 'Atomic Habits'],
  ['listening', 'Post Malone'],
  ['watching', 'United, hopefully winning'],
];

// Manchester United crest — a homage, not the trademarked badge: heraldic
// shield, a ship in full sail across the top band, and the red devil with a
// trident below.
function TridentShield() {
  return (
    <svg width="42" height="49" viewBox="0 0 34 40" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* shield */}
      <path d="M3 4 L17 1.5 L31 4 V17 C31 27.5 24.5 34.6 17 38.5 C9.5 34.6 3 27.5 3 17 Z"
        fill="#DA020E" stroke="rgba(255,255,255,0.30)" strokeWidth="1.1" />
      {/* inner keyline */}
      <path d="M5.6 6 L17 4 L28.4 6 V16.4 C28.4 25.2 23 31.4 17 35 C11 31.4 5.6 25.2 5.6 16.4 Z"
        fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.7" />
      {/* top band + ship in full sail */}
      <path d="M6 13 H28" stroke="#fff" strokeWidth="0.7" opacity="0.55" />
      <g fill="#fff">
        <path d="M10.5 10.4 Q17 12.6 23.5 10.4 L22 12.7 Q17 14 12 12.7 Z" />
        <path d="M13.2 4.6 q1.6 -1.7 3 0 v4.6 h-3 Z" />
        <path d="M17.8 4.6 q1.6 -1.7 3 0 v4.6 h-3 Z" />
      </g>
      <g stroke="#fff" strokeWidth="0.9" strokeLinecap="round">
        <path d="M14.7 4 v6.2 M19.3 4 v6.2" />
        <path d="M10.8 14 q1.4 0.9 2.8 0 M20.4 14 q1.4 0.9 2.8 0" opacity="0.7" />
      </g>
      {/* red devil */}
      <g fill="#0c0c0c">
        <path d="M14.1 16.7 q-1.9 -1.4 -1.1 -3.1 q1.1 0.4 1.6 1.5 q0.4 -1.3 1.4 -1.9 q1 0.6 1.4 1.9 q0.5 -1.1 1.6 -1.5 q0.8 1.7 -1.1 3.1 q1.3 1.2 1.1 3 q-0.5 2 -3 2 q-2.5 0 -3 -2 q-0.2 -1.8 1.1 -3 Z" />
        <path d="M14 21.3 q3 1.7 6 0 l0.7 5 q-0.9 2.5 -2 4.4 l-1 -3.6 h-1.4 l-1 3.6 q-1.1 -1.9 -2 -4.4 Z" />
        <path d="M13.9 22 l-3.4 2.2 1 1.7 3.2 -1.8 Z" />
        <path d="M20.1 21.6 l2.9 -2 q1.2 2.1 0.4 4.2 q-1 -1.6 -2 -1.1 Z" />
      </g>
      {/* trident in the raised hand */}
      <g stroke="#0c0c0c" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M23.4 15.5 V25" />
        <path d="M21.4 15.9 v2.4 M23.4 14.9 v2.6 M25.4 15.9 v2.4" />
        <path d="M21 18.1 H25.8" />
      </g>
    </svg>
  );
}

export default function CandidMe() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.15 });

  const card = (i) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { delay: 0.06 * i, duration: 0.6, ease: EASE },
  });

  return (
    <section id="me" style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div className="candid-layout" style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '64px', alignItems: 'start' }}>

        {/* Left — statement */}
        <motion.div
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-photo)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-photo)' }} />
            the human
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 22px' }}>
            More than the sum of my commits.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '360px' }}>
            Away from the editor there&apos;s a football team I refuse to give up on, a city that
            never slows down, and a camera that comes everywhere. It all feeds the same habit —
            pay attention, then make something of it.
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '28px', letterSpacing: '0.04em' }}>
            — Jay, usually up too late
          </p>
        </motion.div>

        {/* Right — bento */}
        <div ref={gridRef} className="candid-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>

          {/* Manchester United */}
          <motion.div {...card(0)} className="cm-card cm-united" style={{ gridColumn: 'span 2' }}>
            <div className="cm-united-glow" />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <TridentShield />
              <div>
                <h3 className="cm-h">Glory Glory.</h3>
                <p className="cm-p">Manchester United through every rebuild, every long season. Some loyalties aren&apos;t up for review.</p>
              </div>
            </div>
          </motion.div>

          {/* Mumbai */}
          <motion.div {...card(1)} className="cm-card">
            <MapPin size={20} strokeWidth={2} style={{ color: 'var(--accent-photo)' }} />
            <h3 className="cm-h" style={{ marginTop: '12px' }}>Mumbai native</h3>
            <p className="cm-p">DJ Sanghvi, local trains, organised chaos. The city&apos;s pace is the only one I know.</p>
            <div className="cm-rail"><span className="cm-rail-dot" /></div>
          </motion.div>

          {/* Nights */}
          <motion.div {...card(2)} className="cm-card">
            <Moon size={20} strokeWidth={2} style={{ color: 'var(--accent-dev)' }} className="cm-moon" />
            <h3 className="cm-h" style={{ marginTop: '12px' }}>After midnight</h3>
            <p className="cm-p">The ideas worth keeping tend to arrive around 2am. I&apos;ve stopped arguing with the schedule.</p>
          </motion.div>

          {/* Two hands */}
          <motion.div {...card(3)} className="cm-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span className="cm-ic"><Code2 size={16} strokeWidth={2} /></span>
              <span style={{ width: '20px', height: '1px', background: 'var(--border-hover)' }} />
              <span className="cm-ic"><Camera size={16} strokeWidth={2} /></span>
            </div>
            <h3 className="cm-h">One types, one shoots</h3>
            <p className="cm-p">Code and photography are the same reflex pointed at different things — notice it, frame it, keep it before it changes.</p>
          </motion.div>

          {/* Right now */}
          <motion.div {...card(4)} className="cm-card" style={{ gridColumn: 'span 2' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '14px' }}>right now</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="cm-now">
              {NOW.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-photo)' }}>{k}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .cm-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 18px; padding: 22px; position: relative; overflow: hidden;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .cm-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
        .cm-h { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text-primary); }
        .cm-p { font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.65; color: var(--text-secondary); margin-top: 7px; max-width: 46ch; }
        .cm-ic { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 9px; background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-secondary); }

        .cm-united { border-color: rgba(179,18,23,0.35); }
        .cm-united-glow {
          position: absolute; width: 220px; height: 220px; border-radius: 50%;
          right: -70px; top: -110px; pointer-events: none;
          background: radial-gradient(circle, rgba(179,18,23,0.28), transparent 70%);
          animation: cm-pulse 3.4s ease-in-out infinite;
        }
        .cm-rail { position: absolute; left: 22px; right: 22px; bottom: 18px; height: 1px; background: var(--border-subtle); overflow: visible; }
        .cm-rail-dot { position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent-photo); animation: cm-rail 3.6s linear infinite; }
        .cm-moon { animation: cm-spin 14s linear infinite; }

        @keyframes cm-pulse { 0%, 100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes cm-rail { 0% { left: 0; } 100% { left: 100%; } }
        @keyframes cm-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .cm-united-glow, .cm-rail-dot, .cm-moon { animation: none !important; }
        }
        @media (max-width: 900px) {
          .candid-layout { grid-template-columns: 1fr !important; gap: 44px !important; }
        }
        @media (max-width: 560px) {
          .candid-bento { grid-template-columns: 1fr !important; }
          .candid-bento > * { grid-column: span 1 !important; }
          .cm-now { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
