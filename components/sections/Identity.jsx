'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import CometCard from '@/components/ui/comet-card';
import DecryptedText from '@/components/DecryptedText';
import SplitText from '@/components/SplitText';
import LogoLoop from '@/components/LogoLoop';

// ── Tech icons from simple-icons via react-icons ──────────────────────────────
import {
  SiReact, SiNextdotjs, SiPython, SiPytorch, SiTailwindcss, SiDocker,
  SiPostgresql, SiMongodb, SiGit, SiFastapi, SiApachekafka, SiTensorflow,
  SiPandas, SiScikitlearn, SiOpencv, SiHuggingface, SiNumpy,
  SiThreedotjs, SiTypescript, SiJavascript, SiHtml5,
  SiNodedotjs, SiExpress, SiFlask,
  SiMysql, SiRedis, SiSupabase, SiCloudinary,
  SiVercel, SiPostman, SiLinux, SiGithub,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

// ── Line icons (lucide) — used in place of emoji on the cards + modals ────────
import {
  Gamepad2, Trophy, Disc3, Moon, Waves,
  X as CloseIcon,
} from 'lucide-react';

// ── Full tech-stack logos for the marquee ─────────────────────────────────────
const techLogos = [
  // Core web
  { node: <SiReact />,       title: 'React' },
  { node: <SiNextdotjs />,   title: 'Next.js' },
  { node: <SiTypescript />,  title: 'TypeScript' },
  { node: <SiJavascript />,  title: 'JavaScript' },
  { node: <SiHtml5 />,       title: 'HTML5' },
  { node: <SiTailwindcss />, title: 'Tailwind' },
  { node: <SiThreedotjs />,  title: 'Three.js' },
  // Backend
  { node: <SiNodedotjs />,   title: 'Node.js' },
  { node: <SiExpress />,     title: 'Express' },
  { node: <SiFastapi />,     title: 'FastAPI' },
  { node: <SiFlask />,       title: 'Flask' },
  // Data / ML
  { node: <SiPython />,      title: 'Python' },
  { node: <SiPytorch />,     title: 'PyTorch' },
  { node: <SiTensorflow />,  title: 'TensorFlow' },
  { node: <SiScikitlearn />, title: 'scikit-learn' },
  { node: <SiPandas />,      title: 'Pandas' },
  { node: <SiNumpy />,       title: 'NumPy' },
  { node: <SiOpencv />,      title: 'OpenCV' },
  { node: <SiHuggingface />, title: 'HuggingFace' },
  // Databases / services
  { node: <SiPostgresql />,  title: 'PostgreSQL' },
  { node: <SiMongodb />,     title: 'MongoDB' },
  { node: <SiMysql />,       title: 'MySQL' },
  { node: <SiRedis />,       title: 'Redis' },
  { node: <SiSupabase />,    title: 'Supabase' },
  { node: <SiCloudinary />,  title: 'Cloudinary' },
  // Infra / streaming
  { node: <SiDocker />,      title: 'Docker' },
  { node: <SiApachekafka />, title: 'Kafka' },
  { node: <SiVercel />,      title: 'Vercel' },
  // Tools
  { node: <SiGit />,         title: 'Git' },
  { node: <SiGithub />,      title: 'GitHub' },
  { node: <SiPostman />,     title: 'Postman' },
  { node: <SiLinux />,       title: 'Linux' },
  { node: <VscVscode />,     title: 'VS Code' },
];

const E = [0.16, 1, 0.3, 1]; // shared ease

// ── Staggered fade-up for modal sections ──────────────────────────────────────
function FadeUp({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: E }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Scroll-reveal wrapper — full-height so grid cells stay equal ─────────────
function CardReveal({ index, inView, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: E }}
      style={{ height: '100%' }}
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

// ── Little Spider-Man-ish spider that swings on a web thread ──────────────────
function SwingingSpider({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <svg width="30" height="70" viewBox="0 0 30 70" fill="none">
        <line x1="15" y1="0" x2="15" y2="33" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        <g stroke="#101014" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M15 45 C 8 39, 4 43, 1 38" />
          <path d="M15 46 C 8 47, 3 51, 0 49" />
          <path d="M15 49 C 9 52, 6 58, 3 59" />
          <path d="M15 51 C 10 55, 9 63, 7 66" />
          <path d="M15 45 C 22 39, 26 43, 29 38" />
          <path d="M15 46 C 22 47, 27 51, 30 49" />
          <path d="M15 49 C 21 52, 24 58, 27 59" />
          <path d="M15 51 C 20 55, 21 63, 23 66" />
        </g>
        <ellipse cx="15" cy="50" rx="6.5" ry="8" fill="#c81f1f" />
        <circle cx="15" cy="41" r="4" fill="#9c1616" />
        <path d="M15 44 l2.6 5 -2.6 -1.8 -2.6 1.8 z" fill="#0b0b0e" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENTS
// Each card gets onClick + cursor:pointer — the whole card is the click target.
// ─────────────────────────────────────────────────────────────────────────────

function BuilderCard({ inView, index, onOpen }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard className="identity-comet">
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
      <CometCard className="identity-comet">
        <div className="identity-card identity-card--researcher"
          onClick={onOpen} style={{ cursor: 'pointer' }}>

          <div className="rc-strip">
            <span className="rc-rec"><span className="rc-rec-dot" />REC</span>
            <span className="rc-strip-mid">IIT BOMBAY · MULTI-HAZARD LAB</span>
            <span className="rc-strip-val">● LIVE</span>
          </div>

          <div className="rc-scope">
            <svg viewBox="0 0 320 90" preserveAspectRatio="none" width="100%" height="100%">
              <g stroke="rgba(124,111,247,0.14)" strokeWidth="1">
                <line x1="0" y1="22.5" x2="320" y2="22.5" />
                <line x1="0" y1="45" x2="320" y2="45" />
                <line x1="0" y1="67.5" x2="320" y2="67.5" />
              </g>
              <path className="rc-trace"
                d="M0,45 L18,45 L26,20 L34,66 L42,38 L54,45 L92,45 L100,30 L108,58 L116,45 L150,45 L158,14 L166,72 L174,40 L186,45 L232,45 L240,26 L248,60 L256,45 L292,45 L300,33 L308,52 L320,45"
                fill="none" stroke="#7C6FF7" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
              <rect className="rc-scan" x="0" y="0" width="2" height="90" fill="rgba(124,111,247,0.5)" />
            </svg>
          </div>

          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '18px 0 10px' }}>
            <DecryptedText text="The Researcher" animateOn="view" speed={50}
              maxIterations={12} sequential className="researcher-title" />
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>
            Research intern at IIT Bombay, building the pipeline that turns
            IoT sensor noise into a flood warning before the water moves.
          </p>

          <div className="rc-readout">
            {[['<1s', 'LATENCY'], ['5', 'NODES'], ['Kafka→Flink', 'STREAM']].map(([v, k]) => (
              <div key={k} className="rc-stat">
                <span className="rc-stat-v">{v}</span>
                <span className="rc-stat-k">{k}</span>
              </div>
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
      <CometCard className="identity-comet">
        <div className="identity-card identity-card--photographer"
          onClick={onOpen} style={{ cursor: 'pointer' }}>

          <div className="pc-vf">
            <span className="pc-vf-c pc-vf-tl" /><span className="pc-vf-c pc-vf-tr" />
            <span className="pc-vf-c pc-vf-bl" /><span className="pc-vf-c pc-vf-br" />
            <span className="pc-third pc-third-v1" /><span className="pc-third pc-third-v2" />
            <span className="pc-third pc-third-h1" /><span className="pc-third pc-third-h2" />
            <span className="pc-af">
              <span className="pc-af-b pc-af-tl" /><span className="pc-af-b pc-af-tr" />
              <span className="pc-af-b pc-af-bl" /><span className="pc-af-b pc-af-br" />
            </span>
            <span className="pc-hud pc-hud-tl"><span className="pc-hud-rec" />REC</span>
            <span className="pc-hud pc-hud-tr">1/250 · f1.8 · ISO400</span>
            <span className="pc-hud pc-hud-bl">AF-C</span>
            <span className="pc-hud pc-hud-br">[0247]</span>
          </div>

          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '18px 0 10px' }}>The Photographer</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>
            I point a camera at the half-second everyone else walks past.
            Mumbai hands me a few thousand of those a day.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {['Street', 'Portrait', 'Sony α7 III'].map(t => (
              <span key={t} className="pc-tag">{t}</span>
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
      <CometCard className="identity-comet">
        <div className="identity-card identity-card--candid"
          onClick={onOpen} style={{ cursor: 'pointer' }}>

          <SwingingSpider className="cc-spider" />

          <div className="cc-strip">
            <span className="cc-online"><span className="cc-online-dot" />PLAYER ONE</span>
          </div>

          {/* platinum shelf */}
          <div className="cc-run">
            <span className="cc-run-ring cc-run-ring--full">
              <Trophy size={16} strokeWidth={2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="cc-run-k">TROPHY SHELF</p>
              <p className="cc-run-v"><span className="cc-run-big">8</span> platinums</p>
            </div>
          </div>
          <p className="cc-shelf">GoW · GoWR · Spider-Man · Miles Morales · Uncharted 1&ndash;4</p>

          <div className="cc-now2">
            <span className="cc-now2-tag">NOW</span>
            <span className="cc-now2-title">The Last of Us Remastered</span>
          </div>

          <h3 className="cc-h3">Off the clock</h3>
          <p className="cc-copy">
            GTA first &mdash; then downloading mods for it. Watching the terminal
            flash while they installed is when it clicked that there&apos;s more to
            a computer than the part you see.
          </p>
          <p className="cc-foot">also &mdash; football · table tennis · swimming · Post Malone on loop</p>
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
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
      flexShrink: 0,
    }}><CloseIcon size={14} strokeWidth={2.5} /></button>
  );
}

// ── Builder modal ─────────────────────────────────────────────────────────────
function BuilderModalContent({ onClose }) {
  const projects = [
    { name: 'async-federated-learning', date: 'active', active: true },
    { name: 'multi-hazard-early-warning', date: 'active', active: true },
    { name: 'eeg-emg-hunger-detection', date: 'archived', active: false },
    { name: 'cli-portfolio', date: 'this site', active: false },
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
          <p style={{ color: '#79c0ff', marginBottom: '8px', fontSize: '12px' }}># The Builder</p>
          <p style={{ marginBottom: '12px' }}>
            Engineering student at DJ Sanghvi College of Engineering, Mumbai. I ship first, document
            when it matters, and go back to refactor once the architecture stops sitting right.
          </p>
          <p>
            The day-to-day is full-stack web, AI/ML pipelines, and federated systems &mdash; and if a
            system could be designed better, there is usually already a half-finished branch for it.
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
    { label: 'Sensors', value: '87+', sub: 'deployed' },
    { label: 'Pipeline', value: '5', sub: 'active nodes' },
    { label: 'Active', value: '6mo', sub: 'and running' },
  ];
  const log = [
    { ts: '2024.10', type: 'INIT',   color: '#28C840', msg: 'Joined multi-hazard EWS research team at IIT Bombay' },
    { ts: '2024.11', type: 'ARCH',   color: '#79c0ff', msg: 'Mapped IoT sensor network topology across test sites' },
    { ts: '2025.01', type: 'DEPLOY', color: '#7C6FF7', msg: 'Kafka ingestion layer activated — stream processing live' },
    { ts: '2025.02', type: 'TRAIN',  color: '#7C6FF7', msg: 'Deep learning model pipeline initialised for hazard detection' },
    { ts: '2025.Q3', type: 'NEXT',   color: '#E8935A', msg: 'Real-world deployment, alerting system, and field validation' },
  ];

  return (
    <div style={{ background: '#08090F', border: '1px solid rgba(124,111,247,0.25)', borderRadius: '20px', overflow: 'hidden', backgroundImage: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(124,111,247,0.09), transparent)' }}>

      {/* Sticky header — live status bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,9,15,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(124,111,247,0.12)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="pulse-dot" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(40,200,64,0.85)', letterSpacing: '0.12em' }}>SYSTEM ONLINE</span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'rgba(124,111,247,0.25)' }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C6FF7', flex: 1 }}>The Researcher</span>
        <ModalCloseBtn onClose={onClose} color="#7C6FF7" />
      </div>

      <div style={{ padding: '32px' }}>

        {/* Pipeline — with pulsing active nodes */}
        <FadeUp delay={0.05}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(124,111,247,0.45)', letterSpacing: '0.18em', marginBottom: '14px' }}>── PIPELINE STATUS ─────────────</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '10px', flexWrap: 'wrap', rowGap: '10px' }}>
            <PipeNode label="IoT Sensors" color="#E8935A" />
            <PipeArrow />
            <PipeNode label="Kafka" color="#7C6FF7" />
            <PipeArrow />
            <PipeNode label="Flink" color="#7C6FF7" />
            <PipeArrow />
            <PipeNode label="LSTM Model" color="#7C6FF7" />
            <PipeArrow />
            <PipeNode label="Alert" color="#E8935A" />
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(124,111,247,0.3)', letterSpacing: '0.1em', textAlign: 'right', marginBottom: '32px' }}>3 nodes active · 2 nodes pending</p>
        </FadeUp>

        {/* Stats row */}
        <FadeUp delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }} className="modal-stats-grid">
            {stats.map(s => (
              <div key={s.label} style={{ background: 'rgba(124,111,247,0.06)', border: '1px solid rgba(124,111,247,0.18)', borderRadius: '14px', padding: '22px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,111,247,0.06), transparent)', pointerEvents: 'none' }} />
                <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '34px', fontWeight: 600, color: '#7C6FF7', marginBottom: '4px', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(124,111,247,0.4)', marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Event log */}
        <FadeUp delay={0.15}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(124,111,247,0.45)', letterSpacing: '0.18em', marginBottom: '14px' }}>── EVENT LOG ───────────────────</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: 'rgba(124,111,247,0.03)', border: '1px solid rgba(124,111,247,0.12)', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '13px 18px', borderBottom: i < log.length - 1 ? '1px solid rgba(124,111,247,0.07)' : 'none', flexWrap: 'wrap', rowGap: '4px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(124,111,247,0.4)', flexShrink: 0, paddingTop: '1px', minWidth: '52px' }}>{entry.ts}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: entry.color, background: entry.color + '18', border: `1px solid ${entry.color}35`, borderRadius: '4px', padding: '1px 7px', letterSpacing: '0.08em', flexShrink: 0 }}>{entry.type}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, minWidth: '180px' }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Research focus */}
        <FadeUp delay={0.2}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>Research Focus</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Multi-hazard early warning systems at IIT Bombay. The work is an end-to-end pipeline &mdash;
            raw IoT sensor data, through stream processing, into deep-learning inference, out to
            real-time community alerts. Scale, latency, and reliability are the three constraints
            everything gets measured against.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '32px' }}>
            The interesting part is the edge: models have to stay accurate on cheap hardware, over
            unreliable networks, with no second chances when a warning actually matters.
          </p>
        </FadeUp>

        {/* Tags */}
        <FadeUp delay={0.25}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Apache Kafka', 'Apache Flink', 'PyTorch', 'LSTM', 'IoT', 'Edge Computing', 'Stream Processing', 'IIT Bombay'].map(t => (
              <span key={t} style={{ background: '#7C6FF726', border: '1px solid #7C6FF74D', color: '#7C6FF7', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

// ── Photographer modal ────────────────────────────────────────────────────────
function PhotographerModalContent({ onClose }) {
  const frames = [
    { bg: '#0E0A08', tint: 'rgba(232,147,90,0.04)' },
    { bg: '#080608', tint: 'rgba(200,160,100,0.03)' },
    { bg: '#100C0A', tint: 'rgba(232,147,90,0.02)' },
    { bg: '#090709', tint: 'rgba(180,130,80,0.04)' },
    { bg: '#0C0A0D', tint: 'rgba(232,147,90,0.03)' },
    { bg: '#080A08', tint: 'rgba(200,150,90,0.02)' },
  ];
  const collections = [
    { name: 'Mumbai Streets', frames: 47, year: 2024 },
    { name: 'After Dark', frames: 23, year: 2024 },
    { name: 'Portraits in Transit', frames: 31, year: 2025 },
  ];

  return (
    <div style={{ background: '#0A080A', border: '1px solid rgba(232,147,90,0.25)', borderRadius: '20px', overflow: 'hidden' }}>

      {/* Film strip sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(6,4,6,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(232,147,90,0.12)', height: '44px', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'sticky', top: 0, zIndex: 10 }}>
        {/* Tick marks — like 35mm film leader strip */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(to right, rgba(232,147,90,0.18) 0px, rgba(232,147,90,0.18) 1px, transparent 1px, transparent 10px)', backgroundSize: '10px 100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,4,6,0.9) 0%, transparent 15%, transparent 75%, rgba(6,4,6,0.9) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 20px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.55)', letterSpacing: '0.15em' }}>
            35MM · 36EXP · MUMBAI
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.3)', letterSpacing: '0.1em' }}>
            f/1.8 · 1/250s · ISO 400
          </span>
          <ModalCloseBtn onClose={onClose} color="#E8935A" />
        </div>
      </div>

      <div style={{ padding: '32px' }}>

        {/* Large viewfinder */}
        <FadeUp delay={0.04}>
          <div style={{ width: '100%', height: '96px', position: 'relative', marginBottom: '32px', background: 'rgba(232,147,90,0.02)', border: '1px solid rgba(232,147,90,0.1)', borderRadius: '8px' }}>
            <Corner pos="tl" size={24} thickness="2px" />
            <Corner pos="tr" size={24} thickness="2px" />
            <Corner pos="bl" size={24} thickness="2px" />
            <Corner pos="br" size={24} thickness="2px" />
            {/* Crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '28px', height: '28px' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(232,147,90,0.45)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: 'rgba(232,147,90,0.45)', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '5px', height: '5px', borderRadius: '50%', background: '#E8935A', transform: 'translate(-50%,-50%)', boxShadow: '0 0 8px rgba(232,147,90,0.6)' }} />
            </div>
            {/* Metadata overlays */}
            <span style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(232,147,90,0.35)', letterSpacing: '0.22em', whiteSpace: 'nowrap' }}>
              [ AUTOFOCUS &middot; AF-C ]
            </span>
            <span style={{ position: 'absolute', bottom: '8px', left: '14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(232,147,90,0.3)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E8935A', display: 'inline-block' }} />REC</span>
            <span style={{ position: 'absolute', bottom: '8px', right: '14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(232,147,90,0.3)', letterSpacing: '0.08em' }}>FRAME 0247</span>
          </div>
        </FadeUp>

        {/* Dramatic pull quote */}
        <FadeUp delay={0.09}>
          <div style={{ position: 'relative', margin: '0 0 36px', paddingLeft: '22px', borderLeft: '2px solid rgba(232,147,90,0.4)' }}>
            <span style={{ position: 'absolute', top: '-14px', left: '-4px', fontFamily: 'Georgia, serif', fontSize: '80px', color: 'rgba(232,147,90,0.1)', lineHeight: 1, userSelect: 'none' }}>&ldquo;</span>
            <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 600, color: '#E8935A', fontStyle: 'italic', lineHeight: 1.45, marginBottom: '12px', position: 'relative', zIndex: 1 }}>
              A photo is just a decision about what to leave out of the frame.
              Mumbai makes that decision hard in the best way.
            </p>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(232,147,90,0.4)', letterSpacing: '0.1em' }}>
              — how I think about it, anyway
            </span>
          </div>
        </FadeUp>

        {/* Film negative photo grid */}
        <FadeUp delay={0.13}>
          <div style={{ background: '#060406', border: '1px solid rgba(232,147,90,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.35)', letterSpacing: '0.15em', marginBottom: '12px' }}>── CONTACT SHEET ·  6 FRAMES ─────</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
              {frames.map((f, i) => (
                <div key={i} style={{ aspectRatio: '2/3', background: f.bg, border: '1px solid rgba(232,147,90,0.1)', borderRadius: '3px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
                  <div style={{ position: 'absolute', inset: 0, background: f.tint }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: 'rgba(232,147,90,0.25)', position: 'relative', zIndex: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  {/* Crosshair on negative */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(232,147,90,0.1)', transform: 'translateY(-50%)' }} />
                    <div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: 'rgba(232,147,90,0.1)', transform: 'translateX(-50%)' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '6px', color: 'rgba(232,147,90,0.15)', position: 'relative', zIndex: 1 }}>▲</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Collections */}
        <FadeUp delay={0.17}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.45)', letterSpacing: '0.18em', marginBottom: '12px' }}>── COLLECTIONS ─────────────────</p>
          <div style={{ background: 'rgba(232,147,90,0.03)', border: '1px solid rgba(232,147,90,0.1)', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
            {collections.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < collections.length - 1 ? '1px solid rgba(232,147,90,0.07)' : 'none', gap: '14px' }}>
                <div style={{ width: '2px', height: '22px', background: 'rgba(232,147,90,0.35)', borderRadius: '2px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{c.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(232,147,90,0.4)', letterSpacing: '0.08em', flexShrink: 0 }}>{c.frames} frames · {c.year}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Behind the lens */}
        <FadeUp delay={0.21}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>Behind the lens</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
            I mostly shoot street and portraits, on foot, in Mumbai. The interesting stuff is rarely
            posing for you &mdash; it&apos;s the half-second before someone notices the camera, or the
            way light lands on a wall nobody looks at twice.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
            The Sony α7 III does the seeing; the editing is where I decide what the frame was actually
            about. Taking a photo is easy. Making one you&apos;d hang on a wall is the hard, slow part.
          </p>
        </FadeUp>

        {/* Gear table */}
        <FadeUp delay={0.25}>
          <div style={{ background: 'rgba(232,147,90,0.04)', border: '1px solid rgba(232,147,90,0.12)', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(232,147,90,0.45)', letterSpacing: '0.15em', marginBottom: '14px' }}>── EQUIPMENT ────────────────────</p>
            {[
              { label: 'Body', value: 'Sony α7 III' },
              { label: 'Shoots', value: 'Street · Portrait' },
              { label: 'Base', value: 'Mumbai, on foot' },
              { label: 'Edit', value: 'Lightroom' },
            ].map((e, i, arr) => (
              <div key={e.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(232,147,90,0.07)' : 'none', gap: '12px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-tertiary)' }}>{e.label}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>{e.value}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Tags */}
        <FadeUp delay={0.29}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Street', 'Portrait', 'Architecture', 'Long Exposure', 'Mumbai', 'People', 'Light'].map(t => (
              <span key={t} style={{ background: '#E8935A26', border: '1px solid #E8935A4D', color: '#E8935A', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

// ── Candid modal — a player profile / trophy cabinet ─────────────────────────
function CandidModalContent({ onClose }) {
  const R = '#FF6B8A';
  const ra = (a) => `rgba(255,107,138,${a})`;

  const STATUS = {
    playing:  { label: 'IN PROGRESS', c: '#FF6B8A' },
    platinum: { label: 'PLATINUM',    c: '#C9B7FF' },
    next:     { label: 'NEXT UP',     c: '#8A8880' },
  };
  const games = [
    { title: 'Marvel’s Spider-Man',        sub: 'the one that started the collection', s: 'platinum' },
    { title: 'Spider-Man: Miles Morales',  sub: 'Sunflower on repeat the whole time', s: 'platinum' },
    { title: 'God of War (2018)',          sub: 'Leviathan Axe recall never got old', s: 'platinum' },
    { title: 'God of War Ragnarök',        sub: 'ran it straight back for 100%', s: 'platinum' },
    { title: 'Uncharted 1–4',              sub: 'the full Drake run, all four platinumed', s: 'platinum' },
    { title: 'The Last of Us Remastered',  sub: 'current grind', s: 'playing', pct: 34 },
    { title: 'The Last of Us Part II',     sub: 'next on the shelf', s: 'next' },
  ];
  const musicRest = ['The Weeknd', 'One Direction', 'Karan Aujla', 'Pritam', 'Atif Aslam'];
  const catchMe = [
    { Icon: Trophy,     text: 'restarting a game I’ve already finished, purely for the platinum' },
    { Icon: Moon,       text: '“one more chapter” long past the point that was a good idea' },
    { Icon: Waves,      text: 'in the pool, or arguing a football formation nobody asked about' },
    { Icon: Gamepad2,   text: 'defending single-player games in a debate I started' },
  ];

  return (
    <div style={{ background: '#100812', border: `1px solid ${ra(0.22)}`, borderRadius: '20px', overflow: 'hidden', backgroundImage: `radial-gradient(ellipse 80% 40% at 50% 100%, ${ra(0.07)}, transparent)` }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(16,8,18,0.97)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${ra(0.12)}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: R }}>
          <Gamepad2 size={18} strokeWidth={2} />
          <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '16px', fontWeight: 600 }}>Off the clock</span>
        </div>
        <ModalCloseBtn onClose={onClose} color={R} />
      </div>

      <div style={{ padding: '32px' }}>

        {/* Player banner */}
        <FadeUp delay={0.04}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '22px', marginBottom: '32px', borderRadius: '16px', border: `1px solid ${ra(0.2)}`, background: `linear-gradient(135deg, ${ra(0.12)}, ${ra(0.03)})` }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: R, background: ra(0.14), border: `1px solid ${ra(0.3)}` }}>
              <Trophy size={26} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.16em', color: ra(0.6), marginBottom: '4px' }}>PLAYER PROFILE</p>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>Player One</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '3px' }}>story first, platinum second · 8 and counting</p>
            </div>
          </div>
        </FadeUp>

        {/* Intro */}
        <FadeUp delay={0.09}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '14px' }}>
            It started with GTA &mdash; and then downloading mods for it. Sitting there watching the
            terminal flash while they installed is the exact moment it clicked that there was a whole
            machine underneath the part you actually see. I&apos;ve been chasing that ever since.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '30px' }}>
            The routine now: play a big single-player game for the story, then go back and finish it
            properly for the platinum. Away from the screen it&apos;s football, table tennis, and
            swimming &mdash; competitive about all three, better at some than others.
          </p>
        </FadeUp>

        {/* Pull quote */}
        <FadeUp delay={0.11}>
          <div style={{ position: 'relative', margin: '0 0 34px', paddingLeft: '20px', borderLeft: `2px solid ${ra(0.45)}` }}>
            <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(16px, 2.4vw, 20px)', fontWeight: 600, color: R, fontStyle: 'italic', lineHeight: 1.45 }}>
              Sunflower on the speakers while I swing across New York &mdash; forever a top-three feeling.
            </p>
          </div>
        </FadeUp>

        {/* The platinum list */}
        <FadeUp delay={0.13}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: ra(0.5), letterSpacing: '0.18em', marginBottom: '14px' }}>── THE TROPHY SHELF ────────────</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '36px' }} className="modal-currently-grid">
            {games.map((g) => {
              const st = STATUS[g.s];
              return (
                <div key={g.title} style={{ background: ra(0.04), border: `1px solid ${ra(0.14)}`, borderRadius: '12px', padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <Gamepad2 size={15} strokeWidth={2} style={{ color: ra(0.7), flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', color: st.c, border: `1px solid ${st.c}55`, background: `${st.c}18`, borderRadius: '4px', padding: '2px 6px', flexShrink: 0 }}>{st.label}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25 }}>{g.title}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '3px' }}>{g.sub}</p>
                  </div>
                  {g.pct != null && (
                    <div style={{ height: '3px', borderRadius: '2px', background: ra(0.14), overflow: 'hidden', marginTop: '2px' }}>
                      <div style={{ width: `${g.pct}%`, height: '100%', background: R, borderRadius: '2px' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FadeUp>

        {/* On repeat */}
        <FadeUp delay={0.17}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: ra(0.5), letterSpacing: '0.18em', marginBottom: '14px' }}>── ON REPEAT ───────────────────</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '13px 16px', borderRadius: '11px', background: ra(0.09), border: `1px solid ${ra(0.28)}`, marginBottom: '10px' }}>
            <Disc3 size={18} strokeWidth={2} style={{ color: R, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Post Malone</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '1px' }}>top of the list, no contest</p>
            </div>
            <span className="cc-eq" aria-hidden="true" style={{ ['--eq']: R }}>
              <span /><span /><span /><span /><span />
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '10px' }}>
            {musicRest.map((m) => (
              <span key={m} style={{ background: ra(0.06), border: `1px solid ${ra(0.16)}`, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 11px', borderRadius: '999px' }}>{m}</span>
            ))}
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: ra(0.45), letterSpacing: '0.04em', marginBottom: '36px' }}>
            // spotify sync coming — this list is about to get honest
          </p>
        </FadeUp>

        {/* You'll catch me */}
        <FadeUp delay={0.21}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px' }}>
            You&apos;ll catch me...
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {catchMe.map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', background: ra(0.03), border: `1px solid ${ra(0.09)}`, borderRadius: '10px' }}>
                <Icon size={16} strokeWidth={2} style={{ color: ra(0.75), flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Ask me about */}
        <FadeUp delay={0.25}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>Ask me about</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            {['platinum routes', 'the full Uncharted run', 'why story beats multiplayer', 'Spider-Man traversal', 'Post Malone deep cuts', 'football', 'swimming'].map(t => (
              <span key={t} style={{ background: ra(0.15), border: `1px solid ${ra(0.3)}`, color: R, fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
            now: The Last of Us Remastered &middot; Post Malone &middot; hunting platinum #9
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL WRAPPER — handles backdrop, scroll-lock, Escape key, and animation
// ─────────────────────────────────────────────────────────────────────────────

function IdentityModal({ activeModal, onClose }) {
  // Scroll-lock strategy — required because of how Lenis works internally:
  //
  // lenis.stop() sets isStopped=true BUT Lenis still calls event.preventDefault()
  // on EVERY wheel event (confirmed in lenis/dist/lenis.mjs line ~648). This means
  // lenis.stop() alone blocks ALL scroll — including the modal panel itself.
  //
  // Fix: attach a stopPropagation() listener directly on the panel DOM node.
  // Lenis registers its wheel handler on `window` in bubble phase (passive:false).
  // By calling stopPropagation() at the panel level, the wheel event never reaches
  // window → Lenis never calls preventDefault() → panel scrolls natively.
  // lenis.stop() still fires for wheel events over the backdrop (outside the panel)
  // so the page cannot scroll behind the modal.
  useEffect(() => {
    if (!activeModal) return;

    if (window.__lenis) window.__lenis.stop();

    // useEffect fires after the DOM is painted, so the panel is already mounted.
    const panel = document.querySelector('.identity-modal-panel');
    const stopWheelBubble = (e) => e.stopPropagation();
    if (panel) panel.addEventListener('wheel', stopWheelBubble, { passive: true });

    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);

    return () => {
      if (window.__lenis) window.__lenis.start();
      if (panel) panel.removeEventListener('wheel', stopWheelBubble);
      window.removeEventListener('keydown', onEsc);
    };
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  return (
    <motion.div
      key={activeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
        initial={{ y: 48, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
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
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <p className="identity-kicker">
            <span className="identity-kicker-sq" />
            <span>04</span>
            <span style={{ opacity: 0.35 }}>/</span>
            <span>what drives me</span>
          </p>
          <div className="identity-heading-row">
            <SplitText
              text="Four things that drive me"
              className="identity-heading"
              delay={60} duration={1.0} ease="power3.out"
              splitType="words" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}
              threshold={0.2} textAlign="center" tag="h2"
            />
            <span className="identity-heading-dot" aria-hidden="true" />
          </div>
          <p className="identity-sub">
            Builder, researcher, photographer &mdash; and whatever I turn into once it&apos;s dark.
            They overlap more than they probably should.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div ref={gridRef} className="identity-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gridAutoRows: '1fr', gap: '20px' }}>
          <BuilderCard      inView={inView} index={0} onOpen={() => setActiveModal('builder')} />
          <ResearcherCard   inView={inView} index={1} onOpen={() => setActiveModal('researcher')} />
          <PhotographerCard inView={inView} index={2} onOpen={() => setActiveModal('photographer')} />
          <CandidCard       inView={inView} index={3} onOpen={() => setActiveModal('candid')} />
        </div>

        {/* ── Tech stack marquee ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: E, delay: 0.2 }}
          style={{ marginTop: '80px' }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            things I build with
          </p>
          <div style={{
            height: '80px',
            position: 'relative',
            overflow: 'hidden',
            opacity: 0.72,
          }}>
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={40}
              gap={48}
              hoverSpeed={20}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="var(--bg-surface)"
              ariaLabel="Technologies I work with"
            />
          </div>
        </motion.div>
      </div>

      {/* Modal — rendered inside section but position:fixed escapes layout */}
      <IdentityModal activeModal={activeModal} onClose={closeModal} />

      {/* ── Scoped styles ─────────────────────────────────────────────── */}
      <style>{`
        /* ─ Shared card shell ──────────────────── */
        .identity-comet { height: 100%; }
        .identity-comet > div { height: 100%; }
        .identity-card {
          border-radius: 20px; padding: 32px;
          position: relative; overflow: hidden;
          height: 100%; min-height: 400px; transition: transform 0.25s ease;
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

        /* ─ Section header ─────────────────────── */
        .identity-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--text-tertiary);
          display: flex; justify-content: center; align-items: center; gap: 8px;
          margin: 0 0 22px;
        }
        .identity-kicker-sq { width: 7px; height: 7px; border-radius: 2px; background: var(--accent-dev); display: inline-block; flex-shrink: 0; }
        .identity-heading-row {
          display: flex; justify-content: center; align-items: flex-end;
          flex-wrap: wrap; column-gap: 6px;
        }
        .identity-heading-dot {
          width: clamp(11px, 1.4vw, 17px); height: clamp(11px, 1.4vw, 17px);
          border-radius: 3px; background: var(--accent-dev); display: inline-block;
          margin-bottom: clamp(9px, 1.1vw, 15px); flex-shrink: 0;
        }
        .identity-sub {
          font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7;
          color: var(--text-secondary); max-width: 500px; margin: 20px auto 0;
        }

        /* ─ Card 2: Researcher — signal lab ────── */
        .identity-card--researcher {
          background: #07080f; border: 1px solid rgba(124,111,247,0.25);
          background-image: radial-gradient(ellipse 90% 55% at 50% 0%, rgba(124,111,247,0.08), transparent 70%);
        }
        .pipe-dash { animation: dash-flow 0.6s linear infinite; }
        .rc-strip { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.08em; color: rgba(124,111,247,0.55); margin-bottom: 16px; }
        .rc-strip-mid { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rc-rec { display: inline-flex; align-items: center; gap: 5px; color: rgba(255,90,90,0.85); flex-shrink: 0; }
        .rc-rec-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff5a5a; animation: rc-blink 1.4s ease-in-out infinite; }
        .rc-strip-val { color: rgba(40,200,64,0.75); flex-shrink: 0; }
        .rc-scope { position: relative; height: 90px; border: 1px solid rgba(124,111,247,0.18); border-radius: 10px; overflow: hidden; background: rgba(124,111,247,0.04); }
        .rc-trace { stroke-dasharray: 640; stroke-dashoffset: 640; animation: rc-draw 2.6s ease-out forwards; filter: drop-shadow(0 0 4px rgba(124,111,247,0.5)); }
        .rc-scan { animation: rc-sweep 3.4s linear infinite; }
        .rc-readout { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 18px; }
        .rc-stat { border: 1px solid rgba(124,111,247,0.16); border-radius: 9px; padding: 10px 4px; text-align: center; background: rgba(124,111,247,0.04); }
        .rc-stat-v { display: block; font-family: 'Clash Display', sans-serif; font-size: 14px; font-weight: 600; color: #7C6FF7; line-height: 1; }
        .rc-stat-k { display: block; font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.1em; color: var(--text-tertiary); margin-top: 5px; }

        /* ─ Card 3: Photographer — viewfinder ─── */
        .identity-card--photographer {
          background: #0a0806; border: 1px solid rgba(232,147,90,0.28);
          background-image: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,147,90,0.07), transparent 70%);
        }
        .pc-vf { position: relative; width: 100%; height: 138px; border-radius: 10px; background: rgba(232,147,90,0.03); border: 1px solid rgba(232,147,90,0.12); overflow: hidden; }
        .pc-vf-c { position: absolute; width: 16px; height: 16px; border: 2px solid rgba(232,147,90,0.75); }
        .pc-vf-tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
        .pc-vf-tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
        .pc-vf-bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
        .pc-vf-br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }
        .pc-third { position: absolute; background: rgba(232,147,90,0.13); }
        .pc-third-v1 { left: 33.33%; top: 0; bottom: 0; width: 1px; }
        .pc-third-v2 { left: 66.66%; top: 0; bottom: 0; width: 1px; }
        .pc-third-h1 { top: 33.33%; left: 0; right: 0; height: 1px; }
        .pc-third-h2 { top: 66.66%; left: 0; right: 0; height: 1px; }
        .pc-af { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; transform: translate(-50%,-50%); animation: pc-focus 3s ease-in-out infinite; }
        .pc-af-b { position: absolute; width: 9px; height: 9px; border: 1.5px solid #E8935A; }
        .pc-af-tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
        .pc-af-tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
        .pc-af-bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
        .pc-af-br { bottom: 0; right: 0; border-left: 0; border-top: 0; }
        .pc-hud { position: absolute; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.06em; color: rgba(232,147,90,0.7); display: flex; align-items: center; gap: 4px; }
        .pc-hud-tl { top: 14px; left: 32px; }
        .pc-hud-tr { top: 14px; right: 16px; }
        .pc-hud-bl { bottom: 14px; left: 32px; }
        .pc-hud-br { bottom: 14px; right: 16px; }
        .pc-hud-rec { width: 6px; height: 6px; border-radius: 50%; background: #E8935A; animation: rc-blink 1.4s ease-in-out infinite; }
        .pc-tag { background: rgba(232,147,90,0.15); border: 1px solid rgba(232,147,90,0.32); color: #E8935A; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 999px; }

        /* ─ Card 4: Candid — now playing ───────── */
        .identity-card--candid {
          background: #100812; border: 1px solid rgba(255,107,138,0.24);
          background-image: radial-gradient(ellipse 90% 55% at 50% 100%, rgba(255,107,138,0.09), transparent 70%);
        }
        .cc-spider {
          position: absolute; top: 0; right: 30px; z-index: 3;
          transform-origin: 15px 0;
          animation: cc-swing 4.6s cubic-bezier(0.45,0,0.55,1) infinite;
          pointer-events: none;
        }
        .cc-strip { display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em; color: rgba(255,107,138,0.6); margin-bottom: 18px; }
        .cc-online { display: inline-flex; align-items: center; gap: 5px; color: rgba(40,200,64,0.8); }
        .cc-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #28C840; animation: rc-blink 1.8s ease-in-out infinite; }

        .cc-run { display: flex; align-items: center; gap: 13px; padding: 13px 14px; border: 1px solid rgba(255,107,138,0.2); border-radius: 12px; background: linear-gradient(135deg, rgba(255,107,138,0.12), rgba(255,107,138,0.03)); }
        .cc-run-ring {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; color: #FF6B8A;
          background:
            radial-gradient(closest-side, #100812 78%, transparent 79% 100%),
            conic-gradient(#FF6B8A calc(var(--p) * 1%), rgba(255,107,138,0.16) 0);
        }
        .cc-run-ring--full { background: radial-gradient(closest-side, #100812 74%, transparent 75%), conic-gradient(#FF6B8A 100%, #FF6B8A 0); }
        .cc-run-k { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.14em; color: rgba(255,107,138,0.65); }
        .cc-run-v { font-family: 'Clash Display', sans-serif; font-size: 15px; font-weight: 600; color: var(--text-primary); margin-top: 2px; line-height: 1.05; display: flex; align-items: baseline; gap: 7px; }
        .cc-run-big { font-size: 26px; color: #FF6B8A; }
        .cc-shelf { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.02em; color: var(--text-tertiary); margin-top: 9px; line-height: 1.5; }
        .cc-now2 { display: flex; align-items: center; gap: 9px; margin-top: 13px; }
        .cc-now2-tag { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; letter-spacing: 0.12em; color: #FF6B8A; border: 1px solid rgba(255,107,138,0.4); border-radius: 4px; padding: 2px 6px; flex-shrink: 0; }
        .cc-now2-title { font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-secondary); }

        .cc-eq { display: flex; align-items: flex-end; gap: 2px; height: 20px; flex-shrink: 0; }
        .cc-eq span { width: 3px; min-height: 4px; background: var(--eq, #FF6B8A); border-radius: 1px; animation: cc-eq 0.9s ease-in-out infinite; }
        .cc-eq span:nth-child(1) { animation-delay: -0.10s; }
        .cc-eq span:nth-child(2) { animation-delay: -0.42s; }
        .cc-eq span:nth-child(3) { animation-delay: -0.20s; }
        .cc-eq span:nth-child(4) { animation-delay: -0.55s; }
        .cc-eq span:nth-child(5) { animation-delay: -0.30s; }

        .cc-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; }
        .cc-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #FF8FA6; background: rgba(255,107,138,0.1); border: 1px solid rgba(255,107,138,0.24); border-radius: 999px; padding: 4px 11px; }
        .cc-chip svg { flex-shrink: 0; color: #FF6B8A; }
        .cc-h3 { font-family: 'Clash Display', sans-serif; font-size: 22px; font-weight: 600; color: #FF6B8A; margin: 18px 0 10px; }
        .cc-copy { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text-secondary); flex: 1; }
        .cc-foot { margin-top: auto; padding-top: 16px; font-family: 'Inter', sans-serif; font-size: 12px; font-style: italic; color: var(--text-tertiary); }

        @keyframes rc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes rc-draw { to { stroke-dashoffset: 0; } }
        @keyframes rc-sweep { 0% { transform: translateX(-4px); } 100% { transform: translateX(322px); } }
        @keyframes pc-focus { 0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; } 50% { transform: translate(-50%,-50%) scale(0.82); opacity: 1; } }
        @keyframes cc-eq { 0%, 100% { height: 5px; } 50% { height: 20px; } }
        @keyframes cc-swing { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }

        @media (prefers-reduced-motion: reduce) {
          .rc-trace { animation: none; stroke-dashoffset: 0; }
          .rc-scan, .rc-rec-dot, .pc-af, .pc-hud-rec, .cc-online-dot, .cc-eq span, .cc-spider { animation: none !important; }
        }

        /* ─ Modal panel scrollbar ───────────────── */
        .identity-modal-panel::-webkit-scrollbar { width: 4px; }
        .identity-modal-panel::-webkit-scrollbar-track { background: transparent; }
        .identity-modal-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .identity-modal-panel::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }

        /* ─ Keyframes ───────────────────────────── */
        @keyframes cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes dash-flow { to { stroke-dashoffset: -12; } }
        @keyframes football-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-status {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(40,200,64,0.5); }
          60%       { opacity: 0.75; box-shadow: 0 0 0 5px rgba(40,200,64,0); }
        }

        /* ─ Researcher live-status dot ──────────── */
        .pulse-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #28C840;
          flex-shrink: 0;
          animation: pulse-status 2.2s ease-in-out infinite;
        }

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
