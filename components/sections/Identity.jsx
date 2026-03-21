'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const CARDS = [
  {
    id: 1,
    accent: '#7C6FF7',
    iconType: 'code',
    title: 'The Builder',
    body: "I've shipped real products under 2am deadlines. Full-stack, AI/ML, federated systems — if it can be built, I want to build it. Currently breaking things at IIT Bombay.",
    tags: ['Next.js', 'PyTorch', 'FastAPI', 'MERN'],
  },
  {
    id: 2,
    accent: '#7C6FF7',
    iconType: 'atom',
    title: 'The Researcher',
    body: 'Working on multi-hazard early warning systems at IIT Bombay. IoT sensors → Kafka → Flink → deep learning → save lives. That\'s a pipeline worth debugging.',
    tags: ['IIT Bombay', 'Kafka', 'Deep Learning'],
  },
  {
    id: 3,
    accent: '#E8935A',
    iconType: 'aperture',
    title: 'The Photographer',
    body: 'I point cameras at things most people walk past. Mumbai has a thousand stories in a single frame — I\'m still finding them.',
    tags: ['Street', 'Portrait', 'Mumbai', 'Sony α7 III'],
  },
  {
    id: 4,
    accent: '#E8935A',
    iconType: 'controller',
    title: 'Off the clock',
    body: 'Video games are why I got into computers — no regrets. Football, table tennis, chai at 3am, and occasionally explaining to my parents why I\'m still awake.',
    tags: ['FIFA', 'Football', 'Table Tennis', 'Chaos'],
  },
];

// ── Inline SVG icons ─────────────────────────────────────────────────────────

const icons = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  atom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  aperture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="10" />
      <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
      <line x1="9.69" y1="8" x2="21.17" y2="8" />
      <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
      <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
      <line x1="14.31" y1="16" x2="2.83" y2="16" />
      <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
    </svg>
  ),
  controller: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
      <circle cx="18" cy="13" r="1" fill="currentColor" />
    </svg>
  ),
};

// ── Individual card ───────────────────────────────────────────────────────────

function IdentityCard({ card, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: EASE_OUT_EXPO }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = card.accent + '59'; // ~35% hex opacity
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: card.accent,
          borderRadius: '20px 20px 0 0',
        }}
      />

      {/* Icon box */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: card.accent + '26', // hex ~15% opacity
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: card.accent,
        }}
      >
        {icons[card.iconType]}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'Clash Display, sans-serif',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}
      >
        {card.title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}
      >
        {card.body}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {card.tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: card.accent + '26',   // ~15%
              border: `1px solid ${card.accent}4D`, // ~30%
              color: card.accent,
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Identity() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section
      id="about"
      style={{
        background: 'var(--bg-surface)',
        padding: '120px 24px',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: '16px',
            }}
          >
            · about ·
          </p>
          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Four things that drive me.
          </h2>
        </motion.div>

        {/* Cards grid — responsive via CSS Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
          className="identity-grid"
        >
          {CARDS.map((card, i) => (
            <IdentityCard key={card.id} card={card} index={i} inView={inView} />
          ))}
        </div>
      </div>

      {/* Responsive breakpoint — single column on mobile */}
      <style>{`
        @media (max-width: 767px) {
          .identity-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
