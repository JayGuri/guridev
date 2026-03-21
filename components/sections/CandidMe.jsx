'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const CURRENTLY = [
  { emoji: '📖', text: 'Atomic Habits' },
  { emoji: '🎮', text: 'Valorant' },
  { emoji: '🎵', text: 'AP Dhillon' },
];

const CARDS = [
  {
    id: 'gaming',
    span: 2,
    minHeight: '130px',
    tint: 'rgba(124,111,247,0.04)',
    emoji: '🎮',
    emojiSize: '40px',
    title: 'Started with GTA.',
    body: 'Ended up writing ML pipelines. Best origin story.',
    spin: false,
  },
  {
    id: 'football',
    span: 1,
    minHeight: '190px',
    tint: 'rgba(232,147,90,0.04)',
    emoji: '⚽',
    emojiSize: '36px',
    title: 'Left foot. Bad aim.',
    body: 'Competitive about everything. Especially football.',
    spin: true,
  },
  {
    id: 'tt',
    span: 1,
    minHeight: '190px',
    tint: 'rgba(124,111,247,0.04)',
    emoji: '🏓',
    emojiSize: '36px',
    title: 'My reach is unfair.',
    body: 'I apologize in advance.',
    spin: false,
  },
];

function BentoCard({ card, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      style={{
        gridColumn: `span ${card.span}`,
        minHeight: card.minHeight,
        background: card.tint
          ? `linear-gradient(var(--bg-elevated), var(--bg-elevated)), ${card.tint}`
          : 'var(--bg-elevated)',
        backgroundColor: card.tint || 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
    >
      <span
        className={card.spin ? 'candid-spin' : undefined}
        style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          fontSize: card.emojiSize,
          lineHeight: 1,
        }}
      >
        {card.emoji}
      </span>

      <h3
        style={{
          fontFamily: 'Clash Display, sans-serif',
          fontSize: '19px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          paddingRight: '56px',
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginTop: '8px',
          lineHeight: 1.6,
        }}
      >
        {card.body}
      </p>
    </motion.div>
  );
}

function CurrentlyCard({ index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: (CARDS.length + index) * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      style={{
        gridColumn: 'span 2',
        minHeight: '130px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
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
        right now
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {CURRENTLY.map((item) => (
          <div
            key={item.text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.emoji}</span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CandidMe() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <section
      id="me"
      style={{
        background: 'var(--bg-surface)',
        padding: '120px 24px',
        width: '100%',
      }}
    >
      <div
        className="candid-layout"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '38% 62%',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left column — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-photo)',
            }}
          >
            · the human ·
          </p>

          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '16px 0 24px',
            }}
          >
            More than the sum of my commits.
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              maxWidth: '360px',
            }}
          >
            When I&apos;m not staring at a terminal, I&apos;m chasing light with
            a camera, losing football matches I should have won, or trying to
            explain to my parents why I&apos;m still awake at 3am.
          </p>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              maxWidth: '360px',
              marginTop: '16px',
            }}
          >
            Video games are why I got into computers. I&apos;m not sorry.
          </p>
        </motion.div>

        {/* Right column — bento grid */}
        <motion.div
          ref={gridRef}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {CARDS.map((card, i) => (
            <BentoCard key={card.id} card={card} index={i} inView={inView} />
          ))}
          <CurrentlyCard index={0} inView={inView} />
        </motion.div>
      </div>

      <style>{`
        @keyframes slowspin {
          to { transform: rotate(360deg); }
        }
        .candid-spin {
          animation: slowspin 4s linear infinite;
        }

        @media (max-width: 1023px) {
          .candid-layout {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
