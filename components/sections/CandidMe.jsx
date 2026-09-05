'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Moon, Gamepad2, Trophy, Dumbbell, Disc3 } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

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
  const inView = useInView(gridRef, { once: true, amount: 0.12 });

  const card = (i) => ({
    initial: { opacity: 0, y: 26 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { delay: 0.05 * i, duration: 0.55, ease: EASE },
  });

  return (
    <section id="me" style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div className="candid-layout" style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '64px', alignItems: 'start' }}>

        {/* Left — statement */}
        <motion.div
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE }}
          className="candid-statement"
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-photo)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-photo)' }} />
            the human
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 22px' }}>
            More than the sum of my commits.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '380px' }}>
            The way in was a modded copy of GTA — watching a terminal scroll while it
            installed. Everything since has been the same reflex pointed at different
            things: a football club I won&apos;t give up on, a trophy shelf I keep
            padding, a camera that follows me around.
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '24px', letterSpacing: '0.03em' }}>
            currently — reading <span style={{ color: 'var(--text-primary)' }}>Atomic Habits</span>, replaying <span style={{ color: 'var(--text-primary)' }}>TLOU Remastered</span>, chasing platinum #9
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '14px', letterSpacing: '0.04em' }}>
            — Jay, usually up too late
          </p>
        </motion.div>

        {/* Right — bento */}
        <div ref={gridRef} className="candid-bento">

          {/* Manchester United */}
          <motion.div {...card(0)} className="cm-card cm-united cm-span2">
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
            <span className="cm-ic cm-ic--photo"><MapPin size={16} strokeWidth={2} /></span>
            <h3 className="cm-h" style={{ marginTop: '12px' }}>Mumbai, all of it</h3>
            <p className="cm-p">DJ Sanghvi, local trains, organised chaos. The city&apos;s pace is the only one I know.</p>
            <div className="cm-rail"><span className="cm-rail-dot" /></div>
          </motion.div>

          {/* Nights */}
          <motion.div {...card(2)} className="cm-card">
            <span className="cm-ic cm-ic--dev"><Moon size={16} strokeWidth={2} className="cm-moon" /></span>
            <h3 className="cm-h" style={{ marginTop: '12px' }}>After midnight</h3>
            <p className="cm-p">The ideas worth keeping tend to land around 2am. I&apos;ve stopped arguing with the schedule.</p>
          </motion.div>

          {/* Origin */}
          <motion.div {...card(3)} className="cm-card cm-span2">
            <span className="cm-ic cm-ic--dev"><Gamepad2 size={16} strokeWidth={2} /></span>
            <h3 className="cm-h" style={{ marginTop: '12px' }}>Where it started</h3>
            <p className="cm-p">GTA first — then downloading mods for it. Watching the terminal scroll while they installed is when a computer stopped being just the part you can see.</p>
          </motion.div>

          {/* Platinums */}
          <motion.div {...card(4)} className="cm-card cm-span2">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <span className="cm-ic cm-ic--photo"><Trophy size={16} strokeWidth={2} /></span>
                <h3 className="cm-h" style={{ marginTop: '12px' }}>Story first, platinum second</h3>
                <p className="cm-p">Eight platinums on the shelf — the Spider-Man pair, both God of Wars, the full Uncharted run. I&apos;ll restart a finished game purely for the trophy.</p>
              </div>
              <span className="cm-count">08</span>
            </div>
          </motion.div>

          {/* Sport */}
          <motion.div {...card(5)} className="cm-card">
            <span className="cm-ic cm-ic--photo"><Dumbbell size={16} strokeWidth={2} /></span>
            <h3 className="cm-h" style={{ marginTop: '12px' }}>On the field</h3>
            <p className="cm-p">Football, table tennis, swimming — competitive about all three, better at some than others.</p>
          </motion.div>

          {/* Music */}
          <motion.div {...card(6)} className="cm-card">
            <span className="cm-ic cm-ic--dev"><Disc3 size={16} strokeWidth={2} className="cm-disc" /></span>
            <h3 className="cm-h" style={{ marginTop: '12px' }}>On loop</h3>
            <p className="cm-p">Post Malone, mostly. <span style={{ fontStyle: 'italic' }}>Sunflower</span> never actually left the rotation.</p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .candid-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .cm-span2 { grid-column: span 2; }
        .cm-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px; position: relative; overflow: hidden;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .cm-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .cm-h { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text-primary); }
        .cm-p { font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.65; color: var(--text-secondary); margin-top: 7px; max-width: 52ch; }
        .cm-ic {
          width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 9px; background: var(--bg-surface); border: 1px solid var(--border-subtle);
        }
        .cm-ic--dev { color: var(--accent-dev); border-color: rgba(124,111,247,0.28); background: rgba(124,111,247,0.08); }
        .cm-ic--photo { color: var(--accent-photo); border-color: rgba(232,147,90,0.28); background: rgba(232,147,90,0.08); }
        .cm-count {
          font-family: 'Clash Display', sans-serif; font-size: 40px; font-weight: 600;
          color: var(--accent-photo); opacity: 0.32; line-height: 1; flex-shrink: 0;
        }

        .cm-united { border-color: rgba(218,2,14,0.32); }
        .cm-united-glow {
          position: absolute; width: 220px; height: 220px; border-radius: 50%;
          right: -70px; top: -110px; pointer-events: none;
          background: radial-gradient(circle, rgba(218,2,14,0.26), transparent 70%);
          animation: cm-pulse 3.4s ease-in-out infinite;
        }
        .cm-rail { position: absolute; left: 22px; right: 22px; bottom: 16px; height: 1px; background: var(--border-subtle); overflow: visible; }
        .cm-rail-dot { position: absolute; top: -2px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent-photo); animation: cm-rail 3.6s linear infinite; }
        .cm-moon { animation: cm-spin 16s linear infinite; }
        .cm-disc { animation: cm-spin 5s linear infinite; }

        @keyframes cm-pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes cm-rail { 0% { left: 0; } 100% { left: 100%; } }
        @keyframes cm-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .cm-united-glow, .cm-rail-dot, .cm-moon, .cm-disc { animation: none !important; }
        }
        @media (max-width: 900px) {
          .candid-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 560px) {
          .candid-bento { grid-template-columns: 1fr !important; }
          .cm-span2 { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
