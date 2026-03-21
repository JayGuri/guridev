'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const RoomScene = dynamic(() => import('../effects/RoomScene'), { ssr: false });

export default function DevStudio() {
  return (
    <section
      id="work"
      style={{
        background: 'var(--bg-base)',
        padding: '80px 24px',
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
          style={{ textAlign: 'center' }}
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
            · work ·
          </p>
          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            The Dev Studio.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'var(--text-secondary)',
              marginTop: '12px',
            }}
          >
            Where the real work happens.
          </p>
        </motion.div>

        {/* 3D Canvas wrapper */}
        <div
          style={{
            width: '100%',
            height: '600px',
            margin: '60px 0',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <RoomScene />
        </div>
      </div>
    </section>
  );
}
