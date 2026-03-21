'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '@/lib/data';
import ProjectModal from '@/components/ui/ProjectModal';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const RoomScene = dynamic(() => import('../effects/RoomScene'), { ssr: false });

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
      onClick={() => onClick(project)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = project.accent + '4D';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '28px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition:
          'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: project.accent,
        }}
      />

      {/* Category badge */}
      <span
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: project.accent + '15',
          color: project.accent,
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          padding: '4px 10px',
          borderRadius: '999px',
          textTransform: 'capitalize',
        }}
      >
        {project.category}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'Clash Display, sans-serif',
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '10px',
          paddingRight: '70px',
        }}
      >
        {project.title}
      </h3>

      {/* Short description */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginBottom: '20px',
        }}
      >
        {project.shortDesc}
      </p>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              background: project.accent + '26',
              border: `1px solid ${project.accent}4D`,
              color: project.accent,
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: project.accent,
          }}
        >
          View project &rarr;
        </span>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: 'var(--text-secondary)', lineHeight: 0 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function DevStudio() {
  const [selectedProject, setSelectedProject] = useState(null);

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

        {/* 3D Canvas wrapper — desktop only */}
        <div
          className="devstudio-canvas"
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

        {/* Mobile fallback for 3D scene */}
        <div
          className="devstudio-canvas-mobile"
          style={{
            display: 'none',
            margin: '40px 0',
            padding: '40px 24px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'var(--text-tertiary)',
            }}
          >
            3D experience available on desktop
          </p>
        </div>

        {/* Project cards grid */}
        <div
          className="devstudio-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: 0,
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Responsive grid breakpoint */}
      <style>{`
        .devstudio-canvas-mobile { display: none; }
        @media (max-width: 767px) {
          .devstudio-canvas { display: none !important; }
          .devstudio-canvas-mobile { display: block !important; }
        }
        @media (max-width: 1023px) {
          .devstudio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
