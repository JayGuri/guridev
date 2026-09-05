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
      { Icon: SiGooglechrome, label: 'Chrome Extensions' },
    ],
  },
  {
    name: 'Backend & Languages',
    blurb: 'The APIs, services, and languages underneath',
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
      { Icon: SiGooglegemini, label: 'Gemini AI' },
      { Icon: SiGooglecolab, label: 'Google Colab' },
    ],
  },
  {
    name: 'Databases & CMS',
    blurb: 'Where the data — and content — lives',
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
    name: 'Infra & Integrations',
    blurb: 'How it runs, scales, and gets paid',
    items: [
      { Icon: SiDocker, label: 'Docker' },
      { Icon: SiApachekafka, label: 'Kafka' },
      { Icon: SiApacheflink, label: 'Apache Flink' },
      { Icon: SiVercel, label: 'Vercel' },
      { Icon: SiRazorpay, label: 'Razorpay' },
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
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: '16px' }}>{cat.blurb}</p>
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
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px; transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .sk-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .sk-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .sk-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-primary);
          background: var(--bg-surface); border: 1px solid var(--border-subtle);
          border-radius: 999px; padding: 5px 11px; transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .sk-chip:hover { border-color: rgba(124,111,247,0.4); transform: translateY(-1px); }
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
