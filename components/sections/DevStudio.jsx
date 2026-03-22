'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProjectModal from '@/components/ui/ProjectModal';

const EASE = [0.16, 1, 0.3, 1];

const RoomScene = dynamic(() => import('@/components/effects/RoomScene'), { ssr: false });

const SCREEN_META = {
  dev:      { label: 'The Builder',    color: '#7C6FF7', cmd: 'cd --dev' },
  aiml:     { label: 'AI / ML',        color: '#28C840', cmd: 'cd --aiml' },
  research: { label: 'The Researcher', color: '#E8935A', cmd: 'cd --research' },
};

function TerminalHeader() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ts = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 480),
      setTimeout(() => setStep(3), 700),
      setTimeout(() => setStep(4), 900),
      setTimeout(() => setStep(5), 1100),
      setTimeout(() => setStep(6), 1280),
      setTimeout(() => setStep(7), 1460),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView]);

  const mono = { fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.85, whiteSpace: 'pre' };
  const Line = ({ show, children }) =>
    show ? <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: EASE }} style={mono}>{children}</motion.div> : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, ease: EASE }}
      style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', padding: '18px 22px', marginBottom: '28px', maxWidth: '560px' }}
    >
      <div style={{ display: 'flex', gap: '7px', marginBottom: '14px' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
      </div>
      <Line show={step >= 1}><span style={{ color: '#28C840' }}>visitor@portfolio</span><span style={{ color: '#7d8590' }}>:</span><span style={{ color: '#ffa657' }}>~/work</span><span style={{ color: '#e6edf3' }}> ❯ ls -la ./projects</span></Line>
      {step >= 2 && <div style={{ height: '4px' }} />}
      <Line show={step >= 2}><span style={{ color: '#28C840' }}>total 7 projects · last updated 2025</span></Line>
      {step >= 2 && <div style={{ height: '4px' }} />}
      <Line show={step >= 3}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 01 · CLIfolio           </span><span style={{ color: '#7C6FF7' }}>[dev]</span></Line>
      <Line show={step >= 4}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 02 · ARFL Platform      </span><span style={{ color: '#28C840' }}>[aiml]</span></Line>
      <Line show={step >= 5}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 03 · Multi-Hazard EWS   </span><span style={{ color: '#E8935A' }}>[research]</span></Line>
      <Line show={step >= 6}><span style={{ color: '#28C840' }}>-rw-r--r--</span><span style={{ color: '#79c0ff' }}> 04 · EEG/EMG Detection  </span><span style={{ color: '#E8935A' }}>[research]</span></Line>
      {step >= 7 && <div style={{ height: '4px' }} />}
      {step >= 7 && (
        <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} style={{ ...mono, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: '#28C840' }}>visitor@portfolio</span><span style={{ color: '#7d8590' }}>:</span><span style={{ color: '#ffa657' }}>~/work</span><span style={{ color: '#e6edf3' }}> ❯ </span>
          <span style={{ display: 'inline-block', width: '8px', height: '15px', background: '#28C840', borderRadius: '1px', animation: 'th-blink 1s step-end infinite', verticalAlign: 'middle' }} />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DevStudio() {
  const [activeScreen,    setActiveScreen]    = useState(null);
  const [isZoomedIn,      setIsZoomedIn]      = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!activeScreen) { setIsZoomedIn(false); return; }
    const t = setTimeout(() => setIsZoomedIn(true), 920);
    return () => clearTimeout(t);
  }, [activeScreen]);

  // ── FIXED: no setIsZoomedIn(false) when switching between screens.
  //    Camera lerps directly from A → B without touching the overview position.
  const handleScreenClick = (id) => {
    if (activeScreen === id) return;
    setActiveScreen(id);
  };

  const handleBack = () => {
    setIsZoomedIn(false);
    setActiveScreen(null);
  };

  const sl = activeScreen ? SCREEN_META[activeScreen] : null;

  return (
    <section id="work" style={{ background: 'var(--bg-base, #03040a)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.44, ease: EASE }}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3d444d', marginBottom: '22px' }}
        >
          · work · interactive ·
        </motion.p>

        <TerminalHeader />

        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ width: '100%', height: 'clamp(500px, 68vh, 720px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', background: '#03040a' }}>

            <RoomScene activeScreen={activeScreen} isZoomedIn={isZoomedIn} onScreenClick={handleScreenClick} onOpenProject={(p) => setSelectedProject(p)} />

            {/* Vignette */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse 84% 60% at 50% 52%, transparent 40%, rgba(0,0,0,0.50) 100%)' }} />
            {/* Scanlines */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px)' }} />

            {/* Back button */}
            <AnimatePresence>
              {activeScreen && (
                <motion.button key="back" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.26, ease: EASE }}
                  onClick={handleBack}
                  style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, background: 'rgba(5,6,12,0.88)', backdropFilter: 'blur(16px)', border: `1px solid ${sl?.color ?? '#555'}30`, borderRadius: '10px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: sl?.color ?? '#aaa', cursor: 'pointer', letterSpacing: '0.04em', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,16,28,0.94)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(5,6,12,0.88)'; }}
                >
                  ← overview
                </motion.button>
              )}
            </AnimatePresence>

            {/* Screen label */}
            <AnimatePresence>
              {isZoomedIn && sl && (
                <motion.div key="label" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.26, ease: EASE }}
                  style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 10, background: 'rgba(5,6,12,0.88)', backdropFilter: 'blur(16px)', border: `1px solid ${sl.color}30`, borderRadius: '10px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: sl.color, pointerEvents: 'none' }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sl.color, animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  {sl.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hints */}
            <AnimatePresence>
              {!activeScreen && (
                <motion.div key="hint-ov" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', bottom: '14px', right: '14px', zIndex: 4, background: 'rgba(5,6,12,0.78)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '5px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#7d8590', pointerEvents: 'none' }}
                >
                  click a monitor to explore →
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isZoomedIn && (
                <motion.div key="hint-zo" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', bottom: '14px', right: '14px', zIndex: 4, background: 'rgba(5,6,12,0.78)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '5px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#7d8590', pointerEvents: 'none' }}
                >
                  click a project card →
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'absolute', bottom: '14px', left: '14px', zIndex: 4, background: 'rgba(5,6,12,0.78)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '5px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3d444d', pointerEvents: 'none' }}>
              three.js · interactive
            </div>
          </div>

          {/* Screen selector pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.44, delay: 0.18, ease: EASE }}
            style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            {Object.entries(SCREEN_META).map(([id, meta]) => {
              const isActive = activeScreen === id;
              return (
                <button key={id} onClick={() => isActive ? handleBack() : handleScreenClick(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', background: isActive ? `${meta.color}14` : 'rgba(20,24,32,0.6)', border: `1px solid ${isActive ? meta.color + '42' : '#30363d'}`, borderRadius: '8px', padding: '7px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: isActive ? meta.color : '#7d8590', cursor: 'pointer', transition: 'all 0.16s ease' }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = `${meta.color}0c`; e.currentTarget.style.borderColor = `${meta.color}30`; e.currentTarget.style.color = meta.color; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(20,24,32,0.6)'; e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#7d8590'; } }}
                >
                  {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: meta.color, flexShrink: 0, animation: 'pulse-dot 2s ease-in-out infinite' }} />}
                  <span style={{ opacity: 0.45 }}>$</span>{meta.cmd}
                </button>
              );
            })}
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3d444d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {activeScreen ? <><span style={{ color: SCREEN_META[activeScreen]?.color }}>■</span> zoomed · click screen to interact</> : '3 monitors · click to explore'}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes th-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.55; transform:scale(0.75)} }
      `}</style>
    </section>
  );
}
