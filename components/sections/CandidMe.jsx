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

function TridentShield() {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden="true">
      <path d="M2 3 L15 1 L28 3 V16 C28 25 22 30 15 33 C8 30 2 25 2 16 Z"
        fill="#B31217" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
        <path d="M15 10 V25" />
        <path d="M15 12 C 10 12, 9 15, 9 19 M15 12 C 20 12, 21 15, 21 19" />
        <path d="M9 19 L8 16 M21 19 L22 16 M15 10 L15 7" />
      </g>
      <circle cx="15" cy="26.5" r="1.6" fill="#fff" />
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
    <section id="me" style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}>
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
