'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import CometCard from '@/components/ui/comet-card';
import StarBorder from '@/components/StarBorder';
import DecryptedText from '@/components/DecryptedText';
import SplitText from '@/components/SplitText';

const E = [0.16, 1, 0.3, 1]; // shared ease

// ── Scroll-reveal wrapper (unchanged) ────────────────────────────────────────
function CardReveal({ index, inView, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: E }}
    >
      {children}
    </motion.div>
  );
}

// ── Pipeline building blocks (reused in card + researcher modal) ──────────────
function PipeNode({ label, color }) {
  return (
    <span style={{
      background: color + '20', border: `1px solid ${color}50`, color,
      fontSize: '11px', fontWeight: 600, padding: '4px 12px',
      borderRadius: '999px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
    }}>{label}</span>
  );
}

function PipeArrow() {
  return (
    <svg width="36" height="20" viewBox="0 0 36 20" fill="none"
      style={{ alignSelf: 'center', flexShrink: 0 }}>
      <line x1="0" y1="10" x2="28" y2="10"
        stroke="rgba(124,111,247,0.5)" strokeWidth="1.5"
        strokeDasharray="4 3" className="pipe-dash" />
      <polyline points="24,7 30,10 24,13"
        stroke="rgba(124,111,247,0.5)" strokeWidth="1.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Corner bracket (scales via size prop) ─────────────────────────────────────
function Corner({ pos, size = 16, thickness = '1.5px', color = 'var(--accent-photo)' }) {
  const sides = {
    tl: { top: 0, left: 0, borderTop: `${thickness} solid ${color}`, borderLeft: `${thickness} solid ${color}` },
    tr: { top: 0, right: 0, borderTop: `${thickness} solid ${color}`, borderRight: `${thickness} solid ${color}` },
    bl: { bottom: 0, left: 0, borderBottom: `${thickness} solid ${color}`, borderLeft: `${thickness} solid ${color}` },
    br: { bottom: 0, right: 0, borderBottom: `${thickness} solid ${color}`, borderRight: `${thickness} solid ${color}` },
  };
  return <div style={{ position: 'absolute', width: size, height: size, ...sides[pos] }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENTS
// Each card gets onClick + cursor:pointer — the whole card is the click target.
// ─────────────────────────────────────────────────────────────────────────────

function BuilderCard({ inView, index, onOpen }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--builder"
          onClick={onOpen} style={{ cursor: 'pointer' }}>
          <div className="terminal-chrome">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
            <span className="terminal-path">~/portfolio/projects</span>
          </div>
          <div className="terminal-line">
            <span className="t-prompt">❯ </span>
            <span className="t-cmd">ls </span>
            <span className="t-arg">-la ./skills</span>
          </div>
          <div style={{ height: '8px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['Next.js', 'React', 'FastAPI', 'PyTorch'].map(t => (
              <span key={t} className="terminal-tag">{t}</span>
            ))}
          </div>
          <p className="terminal-title">The Builder</p>
          <div className="terminal-comment" style={{ flex: 1 }}>
            <div>// shipped real products under 2am deadlines</div>
            <div>// full-stack, AI/ML, federated systems</div>
            <div>// if it can be built, I want to build it</div>
          </div>
          <div className="terminal-line" style={{ marginTop: '12px' }}>
            <span className="t-prompt">❯ </span>
            <span className="terminal-cursor" />
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

function ResearcherCard({ inView, index, onOpen }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--researcher"
          onClick={onOpen} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
            <PipeNode label="IoT" color="#E8935A" />
            <PipeArrow />
            <PipeNode label="Kafka" color="#7C6FF7" />
            <PipeArrow />
            <PipeNode label="ML" color="#7C6FF7" />
          </div>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            <DecryptedText text="The Researcher" animateOn="view" speed={50}
              maxIterations={12} sequential className="researcher-title" />
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
            IIT Bombay. Multi-hazard early warning systems.
            IoT → Kafka → Flink → deep learning → save lives.
            That&apos;s a pipeline worth debugging.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['IIT Bombay', 'Kafka', 'Deep Learning'].map(t => (
              <span key={t} style={{ background: '#7C6FF726', border: '1px solid #7C6FF74D', color: '#7C6FF7', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

function PhotographerCard({ inView, index, onOpen }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--photographer"
          onClick={onOpen} style={{ cursor: 'pointer' }}>
          <div style={{ width: '100%', height: '80px', position: 'relative', marginBottom: '20px' }}>
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '20px', height: '20px' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(232,147,90,0.6)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: 'rgba(232,147,90,0.6)', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px', borderRadius: '50%', background: '#E8935A', transform: 'translate(-50%,-50%)' }} />
            </div>
            <span style={{ position: 'absolute', bottom: 0, right: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.6)', letterSpacing: '0.05em' }}>
              f/1.8&nbsp;&nbsp;1/250s&nbsp;&nbsp;ISO 400
            </span>
          </div>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>The Photographer</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
            I point cameras at things most people walk past.
            Mumbai has a thousand stories in a single frame.
            I&apos;m still finding them.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Street', 'Portrait', 'Sony α7 III'].map(t => (
              <span key={t} style={{ background: '#E8935A26', border: '1px solid #E8935A4D', color: '#E8935A', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

function CandidCard({ inView, index, onOpen }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--candid"
          onClick={onOpen} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
            <span style={{ fontSize: '32px', display: 'inline-block', transform: 'rotate(-8deg)', userSelect: 'none' }}>🎮</span>
            <span style={{ fontSize: '28px', display: 'inline-block', marginTop: '8px', animation: 'football-spin 6s linear infinite', userSelect: 'none' }}>⚽</span>
            <span style={{ fontSize: '26px', display: 'inline-block', transform: 'rotate(-3deg)', userSelect: 'none' }}>🎵</span>
          </div>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '22px', fontWeight: 600, color: '#E8935A', marginBottom: '12px' }}>Off the clock</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>
            Video games are why I got into computers.
            Football, table tennis, and enough White Monster
            to constitute a health concern.
            No regrets on any of it.
          </p>
          <p style={{ marginTop: 'auto', paddingTop: '20px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
            currently: Valorant · AP Dhillon · Atomic Habits
          </p>
        </div>
      </CometCard>
    </CardReveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL CONTENT COMPONENTS
// Each has a sticky header (with close btn) + scrollable body.
// Visual identity mirrors the card — same backgrounds, borders, type choices.
// ─────────────────────────────────────────────────────────────────────────────

function ModalCloseBtn({ onClose, color = '#7C6FF7' }) {
  return (
    <button onClick={onClose} aria-label="Close" style={{
      background: color + '18',
      border: `1px solid ${color}40`,
      borderRadius: '50%',
      width: '28px', height: '28px',
      color,
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
      flexShrink: 0,
    }}>✕</button>
  );
}

// ── Builder modal ─────────────────────────────────────────────────────────────
function BuilderModalContent({ onClose }) {
  const projects = [
    { name: 'async-federated-learning', date: 'Oct 2024', active: true },
    { name: 'multi-hazard-early-warning', date: 'Aug 2024', active: true },
    { name: 'placeholder-project-alpha', date: 'Jun 2024', active: false },
    { name: 'placeholder-project-beta', date: 'Mar 2024', active: false },
  ];
  const commits = [
    { hash: 'a3f9c12', msg: 'feat: add async federated aggregation layer' },
    { hash: 'b7e2d08', msg: 'fix: kafka consumer group rebalancing edge case' },
    { hash: 'c1a4f55', msg: 'feat: integrate PyTorch model compression pipeline' },
    { hash: 'd9b3e71', msg: 'chore: cleanup distributed orchestration logic' },
    { hash: 'e6c8a34', msg: 'init: multi-hazard detection baseline model' },
  ];
  const stack = ['Next.js', 'React', 'Node.js', 'FastAPI', 'PyTorch', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'HuggingFace'];

  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', background: '#0d1117', border: '1px solid #30363d', borderRadius: '20px', overflow: 'hidden' }}>

      {/* Sticky chrome bar */}
      <div className="terminal-chrome" style={{ position: 'sticky', top: 0, zIndex: 10, marginBottom: 0 }}>
        <span className="dot dot--red" /><span className="dot dot--yellow" /><span className="dot dot--green" />
        <span className="terminal-path">~/portfolio/jay-guri</span>
        <span style={{ flex: 1 }} />
        <ModalCloseBtn onClose={onClose} color="#28C840" />
      </div>

      {/* ── Biography ── */}
      <div style={{ padding: '28px 32px 24px' }}>
        <div className="terminal-line" style={{ marginBottom: '16px' }}>
          <span className="t-prompt">❯ </span><span className="t-cmd">cat </span>
          <span style={{ color: '#e6edf3' }}>./biography.md</span>
        </div>
        <div style={{ borderLeft: '2px solid #21262d', paddingLeft: '16px', color: '#c9d1d9', fontSize: '14px', lineHeight: 1.9 }}>
          <p style={{ color: '#79c0ff', marginBottom: '8px', fontSize: '12px' }}># The Builder — placeholder</p>
          <p style={{ marginBottom: '12px' }}>
            Engineering student at DJ Sanghvi College of Engineering, Mumbai. Placeholder copy — replace with real
            biography text. The kind of person who ships first, documents when necessary, and refactors at 3am
            because the architecture was bothering them.
          </p>
          <p>
            Placeholder second paragraph. Full-stack development, AI/ML pipelines, and federated learning are the
            daily vocabulary. If there is a system that can be designed better, there is probably already a
            half-finished branch for it.
          </p>
        </div>
      </div>

      {/* ── Projects ── */}
      <div style={{ padding: '24px 32px', borderTop: '1px solid #21262d' }}>
        <div className="terminal-line" style={{ marginBottom: '16px' }}>
          <span className="t-prompt">❯ </span><span className="t-cmd">ls </span>
          <span className="t-arg">-la ./projects</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#161b22', borderRadius: '6px', gap: '16px' }}>
              <span style={{ color: p.active ? '#28C840' : '#7d8590', fontSize: '13px' }}>
                {p.active ? '● ' : '○ '}{p.name}/
              </span>
              <span style={{ color: '#7d8590', fontSize: '12px', flexShrink: 0 }}>{p.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Git log ── */}
      <div style={{ padding: '24px 32px', borderTop: '1px solid #21262d' }}>
        <div className="terminal-line" style={{ marginBottom: '16px' }}>
          <span className="t-prompt">❯ </span><span className="t-cmd">git log </span>
          <span className="t-arg">--oneline -5</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {commits.map(c => (
            <div key={c.hash} style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
              <span style={{ color: '#79c0ff', flexShrink: 0 }}>{c.hash}</span>
              <span style={{ color: '#8b949e' }}>{c.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stack ── */}
      <div style={{ padding: '24px 32px 32px', borderTop: '1px solid #21262d' }}>
        <div className="terminal-line" style={{ marginBottom: '16px' }}>
          <span className="t-prompt">❯ </span><span className="t-cmd">stack </span>
          <span className="t-arg">--verbose</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {stack.map(t => <span key={t} className="terminal-tag">{t}</span>)}
        </div>
        <div className="terminal-line" style={{ marginTop: '20px' }}>
          <span className="t-prompt">❯ </span><span className="terminal-cursor" />
        </div>
      </div>
    </div>
  );
}

// ── Researcher modal ──────────────────────────────────────────────────────────
function ResearcherModalContent({ onClose }) {
  const stats = [
    { label: 'Sensors Deployed', value: '—' },
    { label: 'Pipeline Nodes', value: '—' },
    { label: 'Months Active', value: '—' },
  ];

  return (
    <div style={{ background: '#08090F', border: '1px solid rgba(124,111,247,0.25)', borderRadius: '20px', overflow: 'hidden', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,111,247,0.07), transparent)' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,9,15,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(124,111,247,0.12)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C6FF7' }}>The Researcher</span>
        <ModalCloseBtn onClose={onClose} color="#7C6FF7" />
      </div>

      <div style={{ padding: '32px' }}>

        {/* Extended pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '32px', flexWrap: 'wrap', rowGap: '12px' }}>
          <PipeNode label="IoT Sensors" color="#E8935A" />
          <PipeArrow />
          <PipeNode label="Kafka" color="#7C6FF7" />
          <PipeArrow />
          <PipeNode label="Flink" color="#7C6FF7" />
          <PipeArrow />
          <PipeNode label="ML Model" color="#7C6FF7" />
          <PipeArrow />
          <PipeNode label="Alert" color="#E8935A" />
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(124,111,247,0.06)', border: '1px solid rgba(124,111,247,0.15)', borderRadius: '12px', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '30px', fontWeight: 600, color: '#7C6FF7', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Research focus */}
        <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>Research Focus</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Placeholder — multi-hazard early warning systems at IIT Bombay. The work involves building an end-to-end
          pipeline from raw IoT sensor data through stream processing to deep learning inference and real-time alerting.
          Scale, latency, and reliability are the three constraints everything is optimised against.
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Placeholder — second paragraph about the research methodology. What makes the problem technically
          interesting, and the engineering challenges of deploying ML models at the edge under real-world
          constraints. Replace with actual research details.
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Apache Kafka', 'Apache Flink', 'PyTorch', 'LSTM', 'IoT', 'Edge Computing', 'Stream Processing', 'IIT Bombay'].map(t => (
            <span key={t} style={{ background: '#7C6FF726', border: '1px solid #7C6FF74D', color: '#7C6FF7', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Photographer modal ────────────────────────────────────────────────────────
function PhotographerModalContent({ onClose }) {
  // Slightly varied dark tones suggest different exposures
  const photos = ['#111113', '#0D0D10', '#13100E', '#0E0E12', '#120E0C', '#0F0F13'];

  return (
    <div style={{ background: '#0A080A', border: '1px solid rgba(232,147,90,0.25)', borderRadius: '20px', overflow: 'hidden' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,8,10,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(232,147,90,0.12)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(232,147,90,0.6)' }}>
          f/1.8 · 1/250s · ISO 400
        </span>
        <ModalCloseBtn onClose={onClose} color="#E8935A" />
      </div>

      <div style={{ padding: '32px' }}>

        {/* Large viewfinder header */}
        <div style={{ width: '100%', height: '100px', position: 'relative', marginBottom: '28px' }}>
          <Corner pos="tl" size={22} thickness="2px" />
          <Corner pos="tr" size={22} thickness="2px" />
          <Corner pos="bl" size={22} thickness="2px" />
          <Corner pos="br" size={22} thickness="2px" />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '24px', height: '24px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(232,147,90,0.5)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: 'rgba(232,147,90,0.5)', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '5px', height: '5px', borderRadius: '50%', background: '#E8935A', transform: 'translate(-50%,-50%)' }} />
          </div>
          <span style={{ position: 'absolute', bottom: 0, right: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.4)', letterSpacing: '0.1em' }}>PLACEHOLDER SERIES</span>
        </div>

        {/* Photo grid — placeholder squares */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '32px' }}>
          {photos.map((bg, i) => (
            <div key={i} style={{ aspectRatio: '4/3', background: bg, border: '1px solid rgba(232,147,90,0.1)', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Mini corner brackets on each placeholder */}
              <div style={{ position: 'absolute', top: '6px', left: '6px', width: '8px', height: '8px', borderTop: '1px solid rgba(232,147,90,0.25)', borderLeft: '1px solid rgba(232,147,90,0.25)' }} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderTop: '1px solid rgba(232,147,90,0.25)', borderRight: '1px solid rgba(232,147,90,0.25)' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '8px', height: '8px', borderBottom: '1px solid rgba(232,147,90,0.25)', borderLeft: '1px solid rgba(232,147,90,0.25)' }} />
              <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '8px', height: '8px', borderBottom: '1px solid rgba(232,147,90,0.25)', borderRight: '1px solid rgba(232,147,90,0.25)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.18)', letterSpacing: '0.1em' }}>0{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>Behind the lens</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Placeholder — the philosophy behind the photography practice. Why Mumbai, why street, why point a camera
          at ordinary things. The relationship between observation and image-making. Replace this with actual
          writing about the work.
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Placeholder — second paragraph. The Sony α7 III and the lenses that live on it. The editing process.
          What the camera sees that the eye misses. The difference between taking a photo and making one.
        </p>

        {/* Gear table */}
        <div style={{ background: 'rgba(232,147,90,0.04)', border: '1px solid rgba(232,147,90,0.12)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(232,147,90,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Equipment</p>
          {[
            { label: 'Body', value: 'Sony α7 III (Placeholder)' },
            { label: 'Primary lens', value: '35mm f/1.8 (Placeholder)' },
            { label: 'Portrait lens', value: '85mm f/1.4 (Placeholder)' },
            { label: 'Editing', value: 'Lightroom — placeholder preset' },
          ].map(e => (
            <div key={e.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(232,147,90,0.07)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-tertiary)' }}>{e.label}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>{e.value}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Street', 'Portrait', 'Architecture', 'Long Exposure', 'Mumbai', 'People', 'Light'].map(t => (
            <span key={t} style={{ background: '#E8935A26', border: '1px solid #E8935A4D', color: '#E8935A', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Candid modal ──────────────────────────────────────────────────────────────
function CandidModalContent({ onClose }) {
  const currently = [
    { icon: '🎮', label: 'Playing', value: 'Valorant (Placeholder)' },
    { icon: '🎵', label: 'Listening', value: 'AP Dhillon, Placeholder' },
    { icon: '📖', label: 'Reading', value: 'Atomic Habits (Placeholder)' },
    { icon: '📺', label: 'Watching', value: 'Placeholder Series' },
  ];

  return (
    <div style={{ background: '#0F0A08', border: '1px solid rgba(232,147,90,0.2)', borderRadius: '20px', overflow: 'hidden' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15,10,8,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(232,147,90,0.1)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '16px', fontWeight: 600, color: '#E8935A' }}>Off the clock</span>
        <ModalCloseBtn onClose={onClose} color="#E8935A" />
      </div>

      <div style={{ padding: '32px' }}>

        {/* Bigger emoji scatter */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '28px' }}>
          <span style={{ fontSize: '44px', display: 'inline-block', transform: 'rotate(-10deg)', userSelect: 'none' }}>🎮</span>
          <span style={{ fontSize: '38px', display: 'inline-block', marginTop: '12px', animation: 'football-spin 6s linear infinite', userSelect: 'none' }}>⚽</span>
          <span style={{ fontSize: '40px', display: 'inline-block', transform: 'rotate(6deg)', userSelect: 'none' }}>🎵</span>
          <span style={{ fontSize: '34px', display: 'inline-block', transform: 'rotate(-4deg)', marginTop: '8px', userSelect: 'none' }}>🏓</span>
        </div>

        {/* Bio */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Placeholder — the off-duty version. Video games first, then table tennis, then football, then enough
          White Monster to keep a small data centre running. This is the section where the engineering stops
          and the human begins. Replace with actual copy.
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Placeholder — what the hobbies mean. What table tennis taught about reflex and pattern recognition.
          Why football makes more sense than most software architectures. The game theory of FIFA career mode.
        </p>

        {/* Currently grid */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Currently</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '32px' }}>
          {currently.map(c => (
            <div key={c.label} style={{ background: 'rgba(232,147,90,0.04)', border: '1px solid rgba(232,147,90,0.12)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>{c.icon}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,147,90,0.5)' }}>{c.label}</span>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--text-secondary)' }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Ask me about */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Ask me about</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          {['FIFA tactics', 'table tennis serves', 'Mumbai street food', 'anime', 'what I\'m building', 'chai at 3am'].map(t => (
            <span key={t} style={{ background: '#E8935A26', border: '1px solid #E8935A4D', color: '#E8935A', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
          ))}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
          currently: Valorant · AP Dhillon · Atomic Habits · and probably overthinking a system design
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL WRAPPER — handles backdrop, scroll-lock, Escape key, and animation
// ─────────────────────────────────────────────────────────────────────────────

function IdentityModal({ activeModal, onClose }) {
  // Scroll-lock + Escape key — runs only while the modal is mounted
  useEffect(() => {
    if (!activeModal) return;
    document.body.style.overflow = 'hidden';
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [activeModal, onClose]);

  return (
    <AnimatePresence mode="wait">
      {activeModal && (
        <motion.div
          key={activeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Dark blurred backdrop */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(8,8,9,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }} />

          {/* Sliding panel */}
          <motion.div
            initial={{ y: 48, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 28, scale: 0.98 }}
            transition={{ duration: 0.38, ease: E }}
            onClick={(e) => e.stopPropagation()}
            className="identity-modal-panel"
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', maxWidth: '760px',
              maxHeight: '85vh',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              borderRadius: '20px',
            }}
          >
            {activeModal === 'builder'      && <BuilderModalContent     onClose={onClose} />}
            {activeModal === 'researcher'   && <ResearcherModalContent  onClose={onClose} />}
            {activeModal === 'photographer' && <PhotographerModalContent onClose={onClose} />}
            {activeModal === 'candid'       && <CandidModalContent      onClose={onClose} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function Identity() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.1 });
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <section id="about" style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: E }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
            · about ·
          </p>
          <SplitText
            text="Four things that drive me."
            className="identity-heading"
            delay={60} duration={1.0} ease="power3.out"
            splitType="words" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}
            threshold={0.2} textAlign="center" tag="h2"
          />
        </motion.div>

        {/* Cards grid */}
        <div ref={gridRef} className="identity-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
          <BuilderCard      inView={inView} index={0} onOpen={() => setActiveModal('builder')} />
          <ResearcherCard   inView={inView} index={1} onOpen={() => setActiveModal('researcher')} />
          <PhotographerCard inView={inView} index={2} onOpen={() => setActiveModal('photographer')} />
          <CandidCard       inView={inView} index={3} onOpen={() => setActiveModal('candid')} />
        </div>
      </div>

      {/* Modal — rendered inside section but position:fixed escapes layout */}
      <IdentityModal activeModal={activeModal} onClose={closeModal} />

      {/* ── Scoped styles ─────────────────────────────────────────────── */}
      <style>{`
        /* ─ Shared card shell ──────────────────── */
        .identity-card {
          border-radius: 20px; padding: 32px;
          position: relative; overflow: hidden;
          min-height: 320px; transition: transform 0.25s ease;
          display: flex; flex-direction: column;
        }

        /* ─ Card 1: Builder / terminal ─────────── */
        .identity-card--builder { background: #0d1117; border: 1px solid #30363d; font-family: 'JetBrains Mono', monospace; }
        .terminal-chrome {
          height: 32px; background: #161b22;
          border-bottom: 1px solid #21262d; border-radius: 20px 20px 0 0;
          margin: -32px -32px 24px -32px;
          display: flex; align-items: center; padding: 0 14px; gap: 7px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
        .dot--red    { background: #FF5F57; }
        .dot--yellow { background: #FEBC2E; }
        .dot--green  { background: #28C840; }
        .terminal-path { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7d8590; }
        .terminal-line { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; display: flex; align-items: center; gap: 2px; }
        .t-prompt { color: #28C840; }
        .t-cmd    { color: #79c0ff; }
        .t-arg    { color: #FFA657; }
        .terminal-tag { border: 1px solid rgba(40,200,64,0.4); color: rgba(40,200,64,0.7); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 3px 10px; border-radius: 4px; }
        .terminal-title { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #e6edf3; margin-bottom: 12px; }
        .terminal-comment { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #7d8590; line-height: 1.8; margin-bottom: 4px; }
        .terminal-cursor { display: inline-block; width: 8px; height: 14px; background: #28C840; animation: cursor-blink 1s step-end infinite; vertical-align: middle; }

        /* ─ Card 2: Researcher ──────────────────── */
        .identity-card--researcher {
          background: #08090F; border: 1px solid rgba(124,111,247,0.25);
          background-image: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,111,247,0.04), transparent);
        }
        .pipe-dash { animation: dash-flow 0.6s linear infinite; }

        /* ─ Card 3: Photographer ────────────────── */
        .identity-card--photographer { background: #0A080A; border: 1px solid rgba(232,147,90,0.25); }

        /* ─ Card 4: Candid ──────────────────────── */
        .identity-card--candid { background: #0F0A08; border: 1px solid rgba(232,147,90,0.2); }

        /* ─ Modal panel scrollbar ───────────────── */
        .identity-modal-panel::-webkit-scrollbar { width: 4px; }
        .identity-modal-panel::-webkit-scrollbar-track { background: transparent; }
        .identity-modal-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .identity-modal-panel::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }

        /* ─ Keyframes ───────────────────────────── */
        @keyframes cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes dash-flow { to { stroke-dashoffset: -12; } }
        @keyframes football-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ─ Mobile: single column ───────────────── */
        @media (max-width: 767px) {
          .identity-grid { grid-template-columns: 1fr !important; }
          .identity-modal-panel { max-height: 92vh !important; border-radius: 20px 20px 0 0 !important; }
        }
        @media (max-width: 767px) {
          .modal-stats-grid { grid-template-columns: 1fr !important; }
          .modal-currently-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
