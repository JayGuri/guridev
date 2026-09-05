'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

// Fill in / adjust dates and bullets as the real timeline updates.
const JOBS = [
  {
    role: 'Research Intern',
    org: 'Indian Institute of Technology, Bombay — CSRE',
    period: 'Jan 2026 — Present',
    location: 'Mumbai',
    current: true,
    bullets: [
      'Building the pipeline for a multi-hazard early warning system — IoT sensor data through Kafka/Flink stream processing into a deep-learning inference layer, out to real-time community alerts.',
    ],
    tags: ['Research', 'IoT', 'Kafka', 'Deep Learning'],
  },
  {
    role: 'Web Development Intern',
    org: 'Realatte',
    period: 'Jun 2025 — Oct 2025',
    location: 'Mumbai',
    current: false,
    bullets: [
      'Built responsive web apps and landing pages for 9+ real estate client projects — production code behind lead-generation and digital marketing campaigns.',
      "Refactored key modules of Realatte's internal project management tool with modern JavaScript, improving task-tracking efficiency across concurrent initiatives.",
      'Integrated SEO-optimised features, payment gateways, and dynamic content; ran QA and cross-browser checks to cut load times on high-traffic sites.',
    ],
    tags: ['Full-Stack', 'SEO', 'Payments', 'QA'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="experience" style={{ background: 'var(--bg-base)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div className="exp-layout" style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: '64px', alignItems: 'start' }}>

        {/* Left — intro */}
        <motion.div
          initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-dev)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            experience
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 20px' }}>
            Where the work actually happened.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '340px' }}>
            Research at IIT Bombay and a web-development internship at Realatte —
            the roles where the skills below got tested outside a classroom.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '7px 14px', marginTop: '28px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3FB950', boxShadow: '0 0 6px #3FB950' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              currently @ IIT Bombay
            </span>
          </div>
        </motion.div>

        {/* Right — timeline */}
        <div ref={ref} className="exp-rail">
          {JOBS.map((job, i) => (
            <motion.div
              key={job.role + job.org}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
              className="exp-item"
            >
              <span className={`exp-dot${job.current ? ' exp-dot--current' : ''}`} />
              <div className="exp-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '19px', fontWeight: 600, color: 'var(--text-primary)' }}>{job.role}</h3>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px', color: 'var(--accent-dev)', letterSpacing: '0.03em', flexShrink: 0 }}>{job.period}</span>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {job.org} <span style={{ opacity: 0.5 }}>·</span> <MapPin size={12} strokeWidth={2} style={{ flexShrink: 0 }} /> {job.location}
                </p>
                {job.bullets.map((b) => (
                  <p key={b} className="exp-bullet">{b}</p>
                ))}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '14px' }}>
                  {job.tags.map((t) => (
                    <span key={t} className="exp-tag">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .exp-rail { position: relative; padding-left: 26px; }
        .exp-item { position: relative; padding-bottom: 40px; }
        .exp-item:last-child { padding-bottom: 0; }
        .exp-item::before {
          content: ''; position: absolute; left: -21px; top: 6px; bottom: -34px;
          width: 1px; background: var(--border-subtle);
        }
        .exp-item:last-child::before { display: none; }
        .exp-dot {
          position: absolute; left: -26px; top: 4px; width: 10px; height: 10px;
          border-radius: 50%; background: var(--bg-elevated); border: 2px solid var(--accent-dev);
        }
        .exp-dot--current { background: var(--accent-dev); box-shadow: 0 0 0 4px rgba(124,111,247,0.18); }
        .exp-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 24px; transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .exp-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .exp-bullet { font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.7; color: var(--text-secondary); margin-top: 6px; }
        .exp-tag {
          font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; color: var(--accent-dev);
          background: rgba(124,111,247,0.1); border: 1px solid rgba(124,111,247,0.24);
          border-radius: 999px; padding: 3px 10px;
        }
        @media (max-width: 900px) {
          .exp-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
