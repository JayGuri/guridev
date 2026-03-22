'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProjectModal from '@/components/ui/ProjectModal';

const EASE = [0.16, 1, 0.3, 1];
const RoomScene = dynamic(() => import('../effects/RoomScene'), { ssr: false });

const SCREEN_LABELS = {
  dev:      { label: 'The Builder',    color: '#7C6FF7' },
  research: { label: 'The Researcher', color: '#E8935A' },
  aiml:     { label: 'AI / ML',        color: '#28C840' },
};

// ── Terminal header ───────────────────────────────────────────────────────────
function TerminalHeader() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ts = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 620),
      setTimeout(() => setStep(3), 820),
      setTimeout(() => setStep(4), 980),
      setTimeout(() => setStep(5), 1140),
      setTimeout(() => setStep(6), 1340),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView]);

  const mono = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px', lineHeight: 1.9, whiteSpace: 'pre',
  };

  return (
    <div ref={ref} style={{
      background: '#0d1117', border: '1px solid #30363d',
      borderRadius: '12px', padding: '20px 24px',
      marginBottom: '32px', maxWidth: '580px',
    }}>
      <div style={{ display: 'flex', gap: '7px', marginBottom: '16px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
      </div>
      {step >= 1 && <div style={mono}><span style={{ color: '#28C840' }}>visitor@portfolio</span><span style={{ color: '#7d8590' }}>:</span><span style={{ color: '#FFA657' }}>~/work</span><span style={{ color: '#e6edf3' }}> ❯ ls -la ./projects</span></div>}
      {step >= 1 && <div style={{ height: '4px' }} />}
      {step >= 2 && <div style={mono}><span style={{ color: '#28C840' }}>total 3 projects · last updated Mar 2025</span></div>}
      {step >= 2 && <div style={{ height: '4px' }} />}
      {step >= 3 && <div style={mono}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 01 · ARFL Platform     </span><span style={{ color: '#FFA657' }}>[ml]</span></div>}
      {step >= 4 && <div style={mono}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 02 · Multi-Hazard EWS  </span><span style={{ color: '#B48EFF' }}>[research]</span></div>}
      {step >= 5 && <div style={mono}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 03 · EEG/EMG Detection </span><span style={{ color: '#B48EFF' }}>[research]</span></div>}
      {step >= 5 && <div style={{ height: '4px' }} />}
      {step >= 6 && (
        <div style={{ ...mono, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: '#28C840' }}>visitor@portfolio</span>
          <span style={{ color: '#e6edf3' }}> ❯ </span>
          <span className="ds-cursor" />
        </div>
      )}
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function DevStudio() {
  const [activeScreen,    setActiveScreen]    = useState(null);
  // isZoomedIn fires ~900ms after click, after the camera animation arrives
  const [isZoomedIn,      setIsZoomedIn]      = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!activeScreen) { setIsZoomedIn(false); return; }
    const t = setTimeout(() => setIsZoomedIn(true), 900);
    return () => clearTimeout(t);
  }, [activeScreen]);

  const handleScreenClick = (id) => {
    if (activeScreen === id) return;
    setIsZoomedIn(false);
    setActiveScreen(id);
  };

  const handleBack = () => {
    setIsZoomedIn(false);
    setActiveScreen(null);
  };

  const sl = activeScreen ? SCREEN_LABELS[activeScreen] : null;

  return (
    <section id="work" style={{ background: 'var(--bg-base)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section label */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-tertiary)', marginBottom: '16px',
        }}>· work ·</p>

        {/* Terminal header */}
        <TerminalHeader />

        {/* ── 3D canvas — full hero ── */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            width: '100%',
            height: 'clamp(480px, 65vh, 700px)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            background: '#040405',
          }}>

            <RoomScene
              activeScreen={activeScreen}
              isZoomedIn={isZoomedIn}
              onScreenClick={handleScreenClick}
              onOpenProject={(p) => setSelectedProject(p)}
            />

            {/* Cinematic vignette */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 88% 65% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
            }} />

            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.018) 0px,rgba(0,0,0,0.018) 1px,transparent 1px,transparent 4px)',
            }} />

            {/* ── Back button (visible when a screen is selected) ── */}
            <AnimatePresence>
              {activeScreen && (
                <motion.button
                  key="back"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={handleBack}
                  style={{
                    position: 'absolute', top: '14px', left: '14px', zIndex: 10,
                    background: 'rgba(6,6,10,0.82)', backdropFilter: 'blur(14px)',
                    border: `1px solid ${sl?.color ?? '#444'}40`,
                    borderRadius: '10px', padding: '8px 16px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                    color: sl?.color ?? '#aaa', cursor: 'pointer',
                    letterSpacing: '0.04em',
                  }}
                >
                  ← overview
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Active screen label (top-right, appears when zoomed) ── */}
            <AnimatePresence>
              {isZoomedIn && sl && (
                <motion.div
                  key="label"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    position: 'absolute', top: '14px', right: '14px', zIndex: 10,
                    background: 'rgba(6,6,10,0.82)', backdropFilter: 'blur(14px)',
                    border: `1px solid ${sl.color}40`,
                    borderRadius: '10px', padding: '6px 14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                    color: sl.color, pointerEvents: 'none',
                  }}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: sl.color, boxShadow: `0 0 6px ${sl.color}`,
                  }} />
                  {sl.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── "Click a monitor" hint (bottom-right, overview only) ── */}
            <AnimatePresence>
              {!activeScreen && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', bottom: '14px', right: '14px', zIndex: 4,
                    background: 'rgba(6,6,10,0.72)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '5px 12px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                    color: '#7d8590', pointerEvents: 'none',
                  }}
                >
                  click a monitor →
                </motion.div>
              )}
            </AnimatePresence>

            {/* Render label — always visible bottom-left */}
            <div style={{
              position: 'absolute', bottom: '14px', left: '14px', zIndex: 4,
              background: 'rgba(6,6,10,0.72)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '5px 12px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              color: '#7d8590', pointerEvents: 'none',
            }}>
              render: three.js · interactive
            </div>
          </div>
        </div>
      </div>

      {/* Full project modal — opened from inside the 3D screen */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .ds-cursor {
          display: inline-block; width: 8px; height: 14px;
          background: #28C840;
          animation: ds-cursor-blink 1s step-end infinite;
          vertical-align: middle; margin-left: 2px;
        }
        @keyframes ds-cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </section>
  );
}
