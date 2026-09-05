'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiHtml5, SiTailwindcss, SiThreedotjs,
  SiGooglechrome,
  SiNodedotjs, SiExpress, SiFastapi, SiFlask, SiC, SiCplusplus, SiOpenjdk,
  SiPython, SiPytorch, SiTensorflow, SiScikitlearn, SiPandas, SiNumpy, SiOpencv, SiHuggingface,
  SiGooglegemini, SiGooglecolab,
  SiPostgresql, SiMongodb, SiMysql, SiRedis, SiSupabase, SiCloudinary, SiStrapi, SiWordpress,
  SiDocker, SiApachekafka, SiApacheflink, SiVercel, SiRazorpay,
  SiGit, SiGithub, SiPostman, SiLinux, SiFigma,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

const EASE = [0.16, 1, 0.3, 1];

// Official brand colours for the ones that actually read as colour on a dark
// card. Deliberately left out: logos whose brand mark is pure black/white
// (Next.js, Vercel, Express, Three.js, GitHub, Kafka, Flask, Java, Pandas,
// NumPy) — those fall back to the theme's text colour instead of vanishing
// or fighting the background.
const BRAND = {
  React: '#61DAFB', TypeScript: '#3178C6', JavaScript: '#F7DF1E', HTML5: '#E34F26',
  Tailwind: '#06B6D4', 'Chrome Extensions': '#4285F4',
  'Node.js': '#339933', FastAPI: '#009688', C: '#A8B9CC', 'C++': '#00599C',
  Python: '#3776AB', PyTorch: '#EE4C2C', TensorFlow: '#FF6F00', 'scikit-learn': '#F7931E',
  OpenCV: '#5C3EE8', HuggingFace: '#FFD21E', 'Gemini AI': '#8E75B2', 'Google Colab': '#F9AB00',
  PostgreSQL: '#4169E1', MongoDB: '#47A248', MySQL: '#4479A1', Redis: '#DC382D',
  Supabase: '#3ECF8E', Cloudinary: '#3448C5', Strapi: '#4945FF', WordPress: '#21759B',
  Docker: '#2496ED', 'Apache Flink': '#E6526F', Razorpay: '#0C2451',
  Git: '#F05032', Postman: '#FF6C37', Linux: '#FCC624', 'VS Code': '#007ACC', Figma: '#F24E1E',
};

// One motif per category — a small animated glyph that hints at what the
// category *does*, drawn in `currentColor` so the card's accent drives it.
function Motif({ kind }) {
  switch (kind) {
    case 'atom': // Frontend — orbiting React-style rings
      return (
        <svg className="sk-motif sk-atom" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <circle cx="17" cy="17" r="2.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.3">
            <ellipse cx="17" cy="17" rx="13" ry="5" />
            <ellipse cx="17" cy="17" rx="13" ry="5" transform="rotate(60 17 17)" />
            <ellipse cx="17" cy="17" rx="13" ry="5" transform="rotate(120 17 17)" />
          </g>
        </svg>
      );
    case 'braces': // Backend — code braces that breathe
      return (
        <svg className="sk-motif sk-braces" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path className="sk-brace-l" d="M14 5c-4 0-4 5-4 7 0 3-3 3-3 5s3 2 3 5c0 2 0 7 4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path className="sk-brace-r" d="M20 5c4 0 4 5 4 7 0 3 3 3 3 5s-3 2-3 5c0 2 0 7-4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle className="sk-brace-dot" cx="17" cy="17" r="1.7" fill="currentColor" />
        </svg>
      );
    case 'wave': // Data & ML — equaliser bars
      return (
        <svg className="sk-motif sk-wave" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          {[6, 12, 18, 24].map((x, i) => (
            <rect key={x} x={x} y="8" width="3.2" height="18" rx="1.6" fill="currentColor" style={{ ['--i']: i }} />
          ))}
        </svg>
      );
    case 'stack': // Databases — stacked cylinders, a write drops in
      return (
        <svg className="sk-motif sk-stack" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <circle className="sk-drop" cx="17" cy="4" r="1.6" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.3" fill="none">
            <ellipse cx="17" cy="11" rx="9" ry="3.2" />
            <path d="M8 11v6c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2v-6" />
            <path d="M8 17v6c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2v-6" />
          </g>
        </svg>
      );
    case 'grid': // Infra — container cells, one lighting up
      return (
        <svg className="sk-motif sk-grid-motif" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          {[[7, 7], [19, 7], [7, 19], [19, 19]].map(([x, y], i) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="2" fill="currentColor" style={{ ['--i']: i }} />
          ))}
        </svg>
      );
    default: // Tools — terminal prompt with a blinking caret
      return (
        <svg className="sk-motif sk-caret" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path d="M8 11l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect className="sk-caret-blink" x="17" y="21" width="9" height="3" rx="1" fill="currentColor" />
        </svg>
      );
  }
}

// Same stack as the "things I build with" marquee, grouped by what part of the
// work each one actually does — each card carries its own accent + motif so the
// six read as six distinct things, not one list cut into pieces.
const CATEGORIES = [
  {
    name: 'Frontend', blurb: 'What ships to the browser',
    accent: '#61DAFB', motif: 'atom',
    items: [
      { Icon: SiReact, label: 'React' },
      { Icon: SiNextdotjs, label: 'Next.js' },
      { Icon: SiTypescript, label: 'TypeScript' },
      { Icon: SiJavascript, label: 'JavaScript' },
      { Icon: SiHtml5, label: 'HTML5' },
      { Icon: SiTailwindcss, label: 'Tailwind' },
      { Icon: SiThreedotjs, label: 'Three.js' },
      { Icon: SiGooglechrome, label: 'Chrome Extensions' },
    ],
  },
  {
    name: 'Backend & Languages', blurb: 'The APIs, services, and languages underneath',
    accent: '#3FB950', motif: 'braces',
    items: [
      { Icon: SiNodedotjs, label: 'Node.js' },
      { Icon: SiExpress, label: 'Express' },
      { Icon: SiFastapi, label: 'FastAPI' },
      { Icon: SiFlask, label: 'Flask' },
      { Icon: SiC, label: 'C' },
      { Icon: SiCplusplus, label: 'C++' },
      { Icon: SiOpenjdk, label: 'Java' },
    ],
  },
  {
    name: 'Data & ML', blurb: 'Pipelines, models, inference',
    accent: '#E8935A', motif: 'wave',
    items: [
      { Icon: SiPython, label: 'Python' },
      { Icon: SiPytorch, label: 'PyTorch' },
      { Icon: SiTensorflow, label: 'TensorFlow' },
      { Icon: SiScikitlearn, label: 'scikit-learn' },
      { Icon: SiPandas, label: 'Pandas' },
      { Icon: SiNumpy, label: 'NumPy' },
      { Icon: SiOpencv, label: 'OpenCV' },
      { Icon: SiHuggingface, label: 'HuggingFace' },
      { Icon: SiGooglegemini, label: 'Gemini AI' },
      { Icon: SiGooglecolab, label: 'Google Colab' },
    ],
  },
  {
    name: 'Databases & CMS', blurb: 'Where the data — and content — lives',
    accent: '#4DB6AC', motif: 'stack',
    items: [
      { Icon: SiPostgresql, label: 'PostgreSQL' },
      { Icon: SiMongodb, label: 'MongoDB' },
      { Icon: SiMysql, label: 'MySQL' },
      { Icon: SiRedis, label: 'Redis' },
      { Icon: SiSupabase, label: 'Supabase' },
      { Icon: SiCloudinary, label: 'Cloudinary' },
      { Icon: SiStrapi, label: 'Strapi' },
      { Icon: SiWordpress, label: 'WordPress' },
    ],
  },
  {
    name: 'Infra & Integrations', blurb: 'How it runs, scales, and gets paid',
    accent: '#7C6FF7', motif: 'grid',
    items: [
      { Icon: SiDocker, label: 'Docker' },
      { Icon: SiApachekafka, label: 'Kafka' },
      { Icon: SiApacheflink, label: 'Apache Flink' },
      { Icon: SiVercel, label: 'Vercel' },
      { Icon: SiRazorpay, label: 'Razorpay' },
    ],
  },
  {
    name: 'Tools', blurb: 'How the work actually gets done',
    accent: '#9AA4B2', motif: 'caret',
    items: [
      { Icon: SiGit, label: 'Git' },
      { Icon: SiGithub, label: 'GitHub' },
      { Icon: SiPostman, label: 'Postman' },
      { Icon: SiLinux, label: 'Linux' },
      { Icon: VscVscode, label: 'VS Code' },
      { Icon: SiFigma, label: 'Figma' },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="skills" style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: '44px', maxWidth: '620px' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-dev)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            skills
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
            Skills in use.
          </h2>
        </motion.div>

        <div ref={ref} className="sk-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: EASE }}
              className="sk-card"
              style={{ '--sk-accent': cat.accent }}
            >
              <div className="sk-card-head">
                <div>
                  <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '16px', fontWeight: 600, color: 'var(--sk-accent)' }}>{cat.name}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{cat.blurb}</p>
                </div>
                <span className="sk-motif-wrap"><Motif kind={cat.motif} /></span>
              </div>
              <div className="sk-chips">
                {cat.items.map(({ Icon, label }) => (
                  <span key={label} className="sk-chip">
                    <Icon size={14} style={BRAND[label] ? { color: BRAND[label] } : undefined} />
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
          position: relative; overflow: hidden;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .sk-card::before {
          content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px;
          background: var(--sk-accent); opacity: 0.55; transition: opacity 0.2s ease;
        }
        .sk-card:hover {
          border-color: color-mix(in srgb, var(--sk-accent) 45%, transparent);
          transform: translateY(-2px);
          box-shadow: 0 14px 40px -18px var(--sk-accent);
        }
        .sk-card:hover::before { opacity: 1; }

        .sk-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
        .sk-motif-wrap { color: var(--sk-accent); flex-shrink: 0; opacity: 0.9; }
        .sk-motif { display: block; }

        .sk-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .sk-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-primary);
          background: var(--bg-surface); border: 1px solid var(--border-subtle);
          border-radius: 999px; padding: 5px 11px; transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .sk-chip:hover {
          border-color: color-mix(in srgb, var(--sk-accent) 55%, transparent);
          transform: translateY(-1px);
        }

        @media (max-width: 900px) { .sk-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .sk-grid { grid-template-columns: 1fr !important; } }

        /* ── Motif animations ─────────────────────────────────────────── */
        .sk-atom g { animation: sk-spin 9s linear infinite; transform-origin: 17px 17px; }
        @keyframes sk-spin { to { transform: rotate(360deg); } }

        .sk-braces .sk-brace-l { animation: sk-brace-l 3.2s ease-in-out infinite; transform-origin: 17px 17px; }
        .sk-braces .sk-brace-r { animation: sk-brace-r 3.2s ease-in-out infinite; transform-origin: 17px 17px; }
        .sk-braces .sk-brace-dot { animation: sk-pulse 3.2s ease-in-out infinite; }
        @keyframes sk-brace-l { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-1.5px); } }
        @keyframes sk-brace-r { 0%,100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
        @keyframes sk-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

        .sk-wave rect { animation: sk-eq 1.1s ease-in-out infinite; transform-origin: 50% 100%; animation-delay: calc(var(--i) * 0.13s); }
        @keyframes sk-eq { 0%,100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }

        .sk-stack .sk-drop { animation: sk-drop 2.6s ease-in infinite; }
        @keyframes sk-drop { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 55%,100% { transform: translateY(7px); opacity: 0; } }

        .sk-grid-motif rect { animation: sk-cell 3.2s ease-in-out infinite; animation-delay: calc(var(--i) * 0.5s); opacity: 0.35; }
        @keyframes sk-cell { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }

        .sk-caret .sk-caret-blink { animation: sk-blink 1s step-end infinite; }
        @keyframes sk-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .sk-atom g, .sk-braces .sk-brace-l, .sk-braces .sk-brace-r, .sk-braces .sk-brace-dot,
          .sk-wave rect, .sk-stack .sk-drop, .sk-grid-motif rect, .sk-caret .sk-caret-blink {
            animation: none !important;
          }
          .sk-wave rect { transform: scaleY(0.7); }
        }
      `}</style>
    </section>
  );
}
