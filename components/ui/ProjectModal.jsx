'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const CAT_META = {
  dev:      { label: 'The Builder',    icon: '⌨', accent: '#7C6FF7' },
  research: { label: 'The Researcher', icon: '⚗', accent: '#E8935A' },
  aiml:     { label: 'AI / ML',        icon: '◈', accent: '#28C840' },
};

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;
  const meta  = CAT_META[project.category] ?? {};
  const color = project.color ?? '#7C6FF7';

  return (
    <motion.div
      ref={overlayRef}
      key="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3,4,10,0.86)',
        backdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        key="modal-panel"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1.00 }}
        exit={{ opacity: 0,   y: 20,  scale: 0.97 }}
        transition={{ duration: 0.36, ease: EASE }}
        style={{
          background: '#0d1117',
          border: `1px solid ${color}28`,
          borderRadius: '18px',
          width: '100%', maxWidth: '540px',
          overflow: 'hidden',
          fontFamily: 'JetBrains Mono, monospace',
          boxShadow: `0 0 80px ${color}18, 0 32px 80px rgba(0,0,0,0.7)`,
          position: 'relative',
        }}
      >
        {/* ── Title bar ── */}
        <div style={{
          background: '#161b22',
          borderBottom: `1px solid ${color}1e`,
          padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
            ))}
          </div>

          <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#7d8590' }}>
            <span style={{ color }}>cat</span>
            <span style={{ color: '#7d8590' }}> ./projects/</span>
            <span style={{ color: '#79c0ff' }}>{project.name.toLowerCase().replace(/\s+/g, '-')}.md</span>
          </div>

          {/* ── CLOSE BUTTON ── */}
          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '6px',
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: '13px',
              lineHeight: 1,
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = 'rgba(255,80,80,0.15)';
              e.currentTarget.style.borderColor  = 'rgba(255,80,80,0.40)';
              e.currentTarget.style.color        = '#ff6b6b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.10)';
              e.currentTarget.style.color        = '#8b949e';
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '28px 28px 0' }}>
          {/* Category badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: `${color}12`, border: `1px solid ${color}2e`,
            borderRadius: '6px', padding: '3px 10px',
            fontSize: '11px', color, marginBottom: '16px',
          }}>
            <span style={{ fontSize: '11px' }}>{meta.icon}</span>
            {meta.label}
          </div>

          {/* Name */}
          <h2 style={{
            fontSize: '26px', fontWeight: 700, color: '#e6edf3',
            margin: '0 0 8px', letterSpacing: '-0.4px', lineHeight: 1.2,
          }}>
            {project.name}
          </h2>

          {/* Tech */}
          <p style={{ fontSize: '12px', color: '#ffa657', margin: '0 0 18px' }}>{project.tech}</p>

          <div style={{ height: '1px', background: '#21262d', margin: '0 0 18px' }} />

          {/* Description block */}
          <div style={{
            background: '#161b22', border: '1px solid #21262d',
            borderRadius: '8px', padding: '14px 16px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '11px', color: '#3d444d', marginBottom: '6px' }}># description</div>
            <p style={{ fontSize: '13px', color: '#c9d1d9', lineHeight: 1.75, margin: 0 }}>{project.desc}</p>
          </div>

          {/* Stack tags */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#3d444d', marginBottom: '9px' }}># stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tech.split(/·|,/).map((t) => (
                <span key={t} style={{
                  fontSize: '11px', color: '#8b949e',
                  background: '#161b22', border: '1px solid #30363d',
                  borderRadius: '4px', padding: '3px 9px',
                }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  background: '#161b22', border: '1px solid #30363d', borderRadius: '9px',
                  padding: '11px', fontSize: '12px', color: '#e6edf3', textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7d8590'; e.currentTarget.style.background = '#1c2130'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.background = '#161b22'; }}
              >
                <span>⌥</span> GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  background: `${color}18`, border: `1px solid ${color}38`, borderRadius: '9px',
                  padding: '11px', fontSize: '12px', color, textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${color}28`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${color}18`; }}
              >
                <span>↗</span> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* ── Footer prompt ── */}
        <div style={{
          borderTop: '1px solid #21262d',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '11px',
          background: '#0a0e14',
        }}>
          <span style={{ color: '#28C840' }}>visitor@portfolio</span>
          <span style={{ color: '#7d8590' }}>:</span>
          <span style={{ color }}>~/projects/{project.name.toLowerCase().replace(/\s+/g, '-')}</span>
          <span style={{ color: '#e6edf3' }}> ❯ </span>
          <span style={{
            display: 'inline-block', width: '7px', height: '13px',
            background: '#28C840', animation: 'pm-blink 1s step-end infinite',
            verticalAlign: 'middle', borderRadius: '1px',
          }} />
          <span style={{ marginLeft: 'auto', color: '#3d444d', fontSize: '10px' }}>
            press <kbd style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '3px', padding: '1px 5px', color: '#7d8590' }}>esc</kbd> to close
          </span>
        </div>
      </motion.div>

      <style>{`@keyframes pm-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </motion.div>
  );
}
