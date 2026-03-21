'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '580px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
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
            background: project.accent,
            borderRadius: '24px 24px 0 0',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--border-subtle)';
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--border-subtle)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            paddingRight: '48px',
          }}
        >
          {project.title}
        </h3>

        {/* Full description */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            marginBottom: '28px',
          }}
        >
          {project.fullDesc}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                background: project.accent + '26',
                border: `1px solid ${project.accent}4D`,
                color: project.accent,
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              style={{
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease',
              }}
            >
              View on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: project.accent,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: 'none',
              }}
            >
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
