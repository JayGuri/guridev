'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const SCHOOLS = [
  {
    name: 'Dwarkadas J. Sanghvi College of Engineering',
    program: 'B.Tech, Computer Science & Engineering (Data Science)',
    period: 'Aug 2023 — Jun 2027',
    grade: 'CGPA 9.51 / 10 — through 6th sem',
    current: true,
  },
  {
    name: 'Pace Junior College of Science',
    program: 'Higher Secondary — Science (HSC)',
    period: 'Mar 2021 — May 2023',
    grade: '88.33%',
    current: false,
  },
  {
    name: 'Hiranandani Foundation School',
    program: 'Primary & Secondary Education (ICSE)',
    period: 'Jun 2011 — Jun 2021',
    grade: '98.56%',
    current: false,
  },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="education" style={{ background: 'var(--bg-base)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-dev)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            education
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            The classrooms before the terminal.
          </h2>
        </motion.div>

        <div className="edu-rail">
          {SCHOOLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
              className="edu-item"
            >
              <span className={`edu-dot${s.current ? ' edu-dot--current' : ''}`}>
                <GraduationCap size={12} strokeWidth={2.2} />
              </span>
              <div className="edu-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</h3>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent-dev)', flexShrink: 0 }}>{s.period}</span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>{s.program}</p>
                <span className="edu-grade">{s.grade}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .edu-rail { position: relative; padding-left: 28px; }
        .edu-item { position: relative; padding-bottom: 30px; }
        .edu-item:last-child { padding-bottom: 0; }
        .edu-item::before {
          content: ''; position: absolute; left: -22px; top: 22px; bottom: -24px;
          width: 1px; background: var(--border-subtle);
        }
        .edu-item:last-child::before { display: none; }
        .edu-dot {
          position: absolute; left: -28px; top: 0; width: 20px; height: 20px;
          border-radius: 50%; background: var(--bg-elevated); border: 1.5px solid var(--border-hover);
          display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
        }
        .edu-dot--current { border-color: var(--accent-dev); color: var(--accent-dev); box-shadow: 0 0 0 4px rgba(124,111,247,0.16); }
        .edu-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 18px 20px; transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .edu-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .edu-grade {
          display: inline-block; margin-top: 10px;
          font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--accent-dev);
          background: rgba(124,111,247,0.1); border: 1px solid rgba(124,111,247,0.24);
          border-radius: 999px; padding: 3px 10px;
        }
      `}</style>
    </section>
  );
}
