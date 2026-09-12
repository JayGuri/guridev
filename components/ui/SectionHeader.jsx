'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * The one section header used by every section. Before this existed the site
 * had three competing eyebrow patterns (`■ label`, `· label ·`, `04 / label`)
 * and mixed left/centre alignment. Everything routes through here now.
 *
 * accent: 'dev' (purple) | 'photo' (orange)
 */
export default function SectionHeader({
  label,
  title,
  intro,
  accent = 'dev',
  align = 'left',
  maxWidth = 640,
  children,
}) {
  const color = accent === 'photo' ? 'var(--accent-photo)' : 'var(--accent-dev)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{
        maxWidth: `${maxWidth}px`,
        marginBottom: '40px',
        ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' } : null),
      }}
    >
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
        letterSpacing: '0.18em', textTransform: 'uppercase', color,
        display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: color }} />
        {label}
      </p>

      <h2 style={{
        fontFamily: 'Clash Display, sans-serif',
        fontSize: 'clamp(30px, 4.2vw, 48px)', fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: '-0.02em',
        lineHeight: 1.06, margin: 0,
      }}>
        {title}
      </h2>

      {intro && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.7,
          color: 'var(--text-secondary)', margin: '16px 0 0',
        }}>
          {intro}
        </p>
      )}

      {children}
    </motion.div>
  );
}
