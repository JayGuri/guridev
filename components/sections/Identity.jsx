'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CometCard from '@/components/ui/comet-card';
import StarBorder from '@/components/StarBorder';          // available for future use
import DecryptedText from '@/components/DecryptedText';
import SplitText from '@/components/SplitText';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

// ── Shared scroll-reveal wrapper ──────────────────────────────────────────────
// Each card uses this so the staggered entrance is owned by the card itself.
function CardReveal({ index, inView, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// ── Card 1 — The Builder (terminal / code-editor aesthetic) ───────────────────
function BuilderCard({ inView, index }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--builder">

          {/* macOS window chrome — negative margins pull it flush to card edges */}
          <div className="terminal-chrome">
            <span className="dot dot--red"   />
            <span className="dot dot--yellow"/>
            <span className="dot dot--green" />
            <span className="terminal-path">~/portfolio/projects</span>
          </div>

          {/* Shell prompt + command */}
          <div className="terminal-line">
            <span className="t-prompt">❯ </span>
            <span className="t-cmd">ls </span>
            <span className="t-arg">-la ./skills</span>
          </div>

          <div style={{ height: '8px' }} />

          {/* "File listing" — tags as terminal-coloured pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['Next.js', 'React', 'FastAPI', 'PyTorch'].map((tag) => (
              <span key={tag} className="terminal-tag">{tag}</span>
            ))}
          </div>

          {/* Title */}
          <p className="terminal-title">The Builder</p>

          {/* Comment-block body */}
          <div className="terminal-comment" style={{ flex: 1 }}>
            <div>// shipped real products under 2am deadlines</div>
            <div>// full-stack, AI/ML, federated systems</div>
            <div>// if it can be built, I want to build it</div>
          </div>

          {/* Active prompt + blinking cursor */}
          <div className="terminal-line" style={{ marginTop: '12px' }}>
            <span className="t-prompt">❯ </span>
            <span className="terminal-cursor" />
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

// ── Pipeline node + animated SVG arrow (used in Card 2) ──────────────────────
function PipeNode({ label, color }) {
  return (
    <span style={{
      background: color + '20',
      border: `1px solid ${color}50`,
      color,
      fontSize: '11px',
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: '999px',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter, sans-serif',
    }}>
      {label}
    </span>
  );
}

function PipeArrow() {
  return (
    <svg
      width="36" height="20" viewBox="0 0 36 20" fill="none"
      style={{ alignSelf: 'center', flexShrink: 0 }}
    >
      <line
        x1="0" y1="10" x2="28" y2="10"
        stroke="rgba(124,111,247,0.5)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className="pipe-dash"
      />
      <polyline
        points="24,7 30,10 24,13"
        stroke="rgba(124,111,247,0.5)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Card 2 — The Researcher (data-dashboard / node-graph aesthetic) ───────────
function ResearcherCard({ inView, index }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--researcher">

          {/* Animated pipeline strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            marginBottom: '20px',
          }}>
            <PipeNode label="IoT"   color="#E8935A" />
            <PipeArrow />
            <PipeNode label="Kafka" color="#7C6FF7" />
            <PipeArrow />
            <PipeNode label="ML"    color="#7C6FF7" />
          </div>

          {/* Decrypted title — scrambles in when the section enters the viewport */}
          <h3 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            <DecryptedText
              text="The Researcher"
              animateOn="view"
              speed={50}
              maxIterations={12}
              sequential
              className="researcher-title"
            />
          </h3>

          {/* Body */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            flex: 1,
          }}>
            IIT Bombay. Multi-hazard early warning systems.
            IoT → Kafka → Flink → deep learning → save lives.
            That&apos;s a pipeline worth debugging.
          </p>

          {/* Tags — purple tint */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['IIT Bombay', 'Kafka', 'Deep Learning'].map((tag) => (
              <span key={tag} style={{
                background: '#7C6FF726',
                border: '1px solid #7C6FF74D',
                color: '#7C6FF7',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '999px',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

// ── Card 3 — The Photographer (camera viewfinder aesthetic) ──────────────────
// Corner bracket helper
function Corner({ pos }) {
  const base = { position: 'absolute', width: '16px', height: '16px' };
  const sides = {
    tl: { top: 0, left: 0,
          borderTop: '1.5px solid var(--accent-photo)',
          borderLeft: '1.5px solid var(--accent-photo)' },
    tr: { top: 0, right: 0,
          borderTop: '1.5px solid var(--accent-photo)',
          borderRight: '1.5px solid var(--accent-photo)' },
    bl: { bottom: 0, left: 0,
          borderBottom: '1.5px solid var(--accent-photo)',
          borderLeft: '1.5px solid var(--accent-photo)' },
    br: { bottom: 0, right: 0,
          borderBottom: '1.5px solid var(--accent-photo)',
          borderRight: '1.5px solid var(--accent-photo)' },
  };
  return <div style={{ ...base, ...sides[pos] }} />;
}

function PhotographerCard({ inView, index }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--photographer">

          {/* Viewfinder frame */}
          <div style={{
            width: '100%', height: '80px',
            position: 'relative',
            marginBottom: '20px',
          }}>
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />

            {/* Crosshair */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px', height: '20px',
            }}>
              {/* Horizontal arm */}
              <div style={{
                position: 'absolute', top: '50%', left: 0,
                width: '100%', height: '1px',
                background: 'rgba(232,147,90,0.6)',
                transform: 'translateY(-50%)',
              }} />
              {/* Vertical arm */}
              <div style={{
                position: 'absolute', left: '50%', top: 0,
                width: '1px', height: '100%',
                background: 'rgba(232,147,90,0.6)',
                transform: 'translateX(-50%)',
              }} />
              {/* Centre dot */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '4px', height: '4px', borderRadius: '50%',
                background: '#E8935A',
                transform: 'translate(-50%, -50%)',
              }} />
            </div>

            {/* EXIF readout */}
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(232,147,90,0.6)',
              letterSpacing: '0.05em',
            }}>
              f/1.8&nbsp;&nbsp;1/250s&nbsp;&nbsp;ISO 400
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            The Photographer
          </h3>

          {/* Body */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            flex: 1,
          }}>
            I point cameras at things most people walk past.
            Mumbai has a thousand stories in a single frame.
            I&apos;m still finding them.
          </p>

          {/* Tags — orange tint */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Street', 'Portrait', 'Sony α7 III'].map((tag) => (
              <span key={tag} style={{
                background: '#E8935A26',
                border: '1px solid #E8935A4D',
                color: '#E8935A',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '999px',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </CometCard>
    </CardReveal>
  );
}

// ── Card 4 — Off the Clock (warm, chaotic, human) ────────────────────────────
function CandidCard({ inView, index }) {
  return (
    <CardReveal index={index} inView={inView}>
      <CometCard>
        <div className="identity-card identity-card--candid">

          {/* Emoji cluster — scattered rotations, football spins */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '16px',
          }}>
            <span style={{
              fontSize: '32px',
              display: 'inline-block',
              transform: 'rotate(-8deg)',
              userSelect: 'none',
            }}>🎮</span>
            <span style={{
              fontSize: '28px',
              display: 'inline-block',
              marginTop: '8px',
              animation: 'football-spin 6s linear infinite',
              userSelect: 'none',
            }}>⚽</span>
            <span style={{
              fontSize: '26px',
              display: 'inline-block',
              transform: 'rotate(-3deg)',
              userSelect: 'none',
            }}>🎵</span>
          </div>

          {/* Title — amber tint to feel warm, not corporate */}
          <h3 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            color: '#E8935A',
            marginBottom: '12px',
          }}>
            Off the clock
          </h3>

          {/* Body */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            flex: 1,
          }}>
            Video games are why I got into computers.
            Football, table tennis, and enough White Monster
            to constitute a health concern.
            No regrets on any of it.
          </p>

          {/* "Now playing" footer — margin-top auto pushes it to the bottom */}
          <p style={{
            marginTop: 'auto',
            paddingTop: '20px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--text-tertiary)',
          }}>
            currently: Valorant · AP Dhillon · Atomic Habits
          </p>
        </div>
      </CometCard>
    </CardReveal>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Identity() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section
      id="about"
      style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Section header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: '16px',
          }}>
            · about ·
          </p>

          {/* GSAP-powered word-split reveal */}
          <SplitText
            text="Four things that drive me."
            className="identity-heading"
            delay={60}
            duration={1.0}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            textAlign="center"
            tag="h2"
          />
        </motion.div>

        {/* ── Cards grid ──────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="identity-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          <BuilderCard     inView={inView} index={0} />
          <ResearcherCard  inView={inView} index={1} />
          <PhotographerCard inView={inView} index={2} />
          <CandidCard      inView={inView} index={3} />
        </div>
      </div>

      {/* ── Scoped styles for all card variants ─────────────────────── */}
      <style>{`
        /* ─ Shared card shell ─────────────────────────── */
        .identity-card {
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          min-height: 320px;
          cursor: default;
          transition: transform 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        /* ─ Card 1: Builder / terminal ───────────────── */
        .identity-card--builder {
          background: #0d1117;
          border: 1px solid #30363d;
          font-family: 'JetBrains Mono', monospace;
        }
        .terminal-chrome {
          height: 32px;
          background: #161b22;
          border-bottom: 1px solid #21262d;
          border-radius: 20px 20px 0 0;
          /* Negative margin pulls strip to card padding edges */
          margin: -32px -32px 24px -32px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 7px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .dot--red    { background: #FF5F57; }
        .dot--yellow { background: #FEBC2E; }
        .dot--green  { background: #28C840; }
        .terminal-path {
          margin-left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #7d8590;
        }
        .terminal-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .t-prompt { color: #28C840; }
        .t-cmd    { color: #79c0ff; }
        .t-arg    { color: #FFA657; }
        .terminal-tag {
          border: 1px solid rgba(40, 200, 64, 0.4);
          color: rgba(40, 200, 64, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 4px;
        }
        .terminal-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 700;
          color: #e6edf3;
          margin-bottom: 12px;
        }
        .terminal-comment {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #7d8590;
          line-height: 1.8;
          margin-bottom: 4px;
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: #28C840;
          animation: cursor-blink 1s step-end infinite;
          vertical-align: middle;
        }

        /* ─ Card 2: Researcher / data dashboard ──────── */
        .identity-card--researcher {
          background: #08090F;
          border: 1px solid rgba(124, 111, 247, 0.25);
          background-image: radial-gradient(
            ellipse 60% 60% at 50% 50%,
            rgba(124, 111, 247, 0.04),
            transparent
          );
        }
        /* Pipeline dashes flow left → right */
        .pipe-dash {
          animation: dash-flow 0.6s linear infinite;
        }

        /* ─ Card 3: Photographer / viewfinder ────────── */
        .identity-card--photographer {
          background: #0A080A;
          border: 1px solid rgba(232, 147, 90, 0.25);
        }

        /* ─ Card 4: Off the clock / candid ──────────── */
        .identity-card--candid {
          background: #0F0A08;
          border: 1px solid rgba(232, 147, 90, 0.2);
        }

        /* ─ Keyframes ────────────────────────────────── */
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -12; }
        }
        @keyframes football-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ─ Responsive: single column on mobile ──────── */
        @media (max-width: 767px) {
          .identity-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
