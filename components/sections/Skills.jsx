'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiHtml5, SiTailwindcss, SiThreedotjs,
  SiNodedotjs, SiExpress, SiFastapi, SiFlask,
  SiPython, SiPytorch, SiTensorflow, SiScikitlearn, SiPandas, SiNumpy, SiOpencv, SiHuggingface,
  SiPostgresql, SiMongodb, SiMysql, SiRedis, SiSupabase, SiCloudinary,
  SiDocker, SiApachekafka, SiVercel,
  SiGit, SiGithub, SiPostman, SiLinux,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

const EASE = [0.16, 1, 0.3, 1];

// Same stack as the "things I build with" marquee, grouped by what part of the
// work each one actually does — so a recruiter skimming this section can tell
// frontend from infra at a glance instead of reading one long icon strip.
const CATEGORIES = [
  {
    name: 'Frontend',
    blurb: 'What ships to the browser',
    items: [
      { Icon: SiReact, label: 'React' },
      { Icon: SiNextdotjs, label: 'Next.js' },
      { Icon: SiTypescript, label: 'TypeScript' },
      { Icon: SiJavascript, label: 'JavaScript' },
      { Icon: SiHtml5, label: 'HTML5' },
      { Icon: SiTailwindcss, label: 'Tailwind' },
      { Icon: SiThreedotjs, label: 'Three.js' },
    ],
  },
  {
    name: 'Backend',
    blurb: 'The APIs and services underneath',
    items: [
      { Icon: SiNodedotjs, label: 'Node.js' },
      { Icon: SiExpress, label: 'Express' },
      { Icon: SiFastapi, label: 'FastAPI' },
      { Icon: SiFlask, label: 'Flask' },
    ],
  },
  {
    name: 'Data & ML',
    blurb: 'Pipelines, models, inference',
    items: [
      { Icon: SiPython, label: 'Python' },
      { Icon: SiPytorch, label: 'PyTorch' },
      { Icon: SiTensorflow, label: 'TensorFlow' },
      { Icon: SiScikitlearn, label: 'scikit-learn' },
      { Icon: SiPandas, label: 'Pandas' },
      { Icon: SiNumpy, label: 'NumPy' },
      { Icon: SiOpencv, label: 'OpenCV' },
      { Icon: SiHuggingface, label: 'HuggingFace' },
    ],
  },
  {
    name: 'Databases & Services',
    blurb: 'Where the data actually lives',
    items: [
      { Icon: SiPostgresql, label: 'PostgreSQL' },
      { Icon: SiMongodb, label: 'MongoDB' },
      { Icon: SiMysql, label: 'MySQL' },
      { Icon: SiRedis, label: 'Redis' },
      { Icon: SiSupabase, label: 'Supabase' },
      { Icon: SiCloudinary, label: 'Cloudinary' },
    ],
  },
  {
    name: 'Infra & Streaming',
    blurb: 'How it runs and scales',
    items: [
      { Icon: SiDocker, label: 'Docker' },
      { Icon: SiApachekafka, label: 'Kafka' },
      { Icon: SiVercel, label: 'Vercel' },
    ],
  },
  {
    name: 'Tools',
    blurb: 'How the work actually gets done',
    items: [
      { Icon: SiGit, label: 'Git' },
      { Icon: SiGithub, label: 'GitHub' },
      { Icon: SiPostman, label: 'Postman' },
      { Icon: SiLinux, label: 'Linux' },
      { Icon: VscVscode, label: 'VS Code' },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="skills" style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-dev)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            skills
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 16px' }}>
            The same stack, sorted by job.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
            Everything from the scrolling marquee above — grouped by what it&apos;s
            actually for, not just listed.
          </p>
        </motion.div>

        <div ref={ref} className="sk-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: EASE }}
              className="sk-card"
            >
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px', marginBottom: '16px' }}>{cat.blurb}</p>
              <div className="sk-chips">
                {cat.items.map(({ Icon, label }) => (
                  <span key={label} className="sk-chip">
                    <Icon size={13} />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .sk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .sk-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px; transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .sk-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .sk-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .sk-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-secondary);
          background: var(--bg-surface); border: 1px solid var(--border-subtle);
          border-radius: 999px; padding: 5px 11px; transition: color 0.15s ease, border-color 0.15s ease;
        }
        .sk-chip:hover { color: var(--accent-dev); border-color: rgba(124,111,247,0.4); }
        @media (max-width: 900px) {
          .sk-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .sk-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
