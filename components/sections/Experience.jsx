'use client';

import { motion } from 'framer-motion';
import { MapPin, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1];

const JOBS = [
  {
    role: 'Research Intern',
    org: 'IIT Bombay — CSRE',
    period: 'Jan 2026 — Present',
    location: 'Mumbai',
    current: true,
    bullets: [
      'Building the streaming and inference path for a multi-hazard early warning system, from IoT sensor ingestion through to community alerting.',
      'Owning the Kafka/Flink windowing layer that has to survive bursty, unreliable sensor input without dropping a reading.',
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
      'Shipped responsive web apps and landing pages across 9+ real-estate client projects — production code behind live lead-generation campaigns.',
      "Refactored core modules of Realatte's internal project-management tool, improving task-tracking across concurrent initiatives.",
      'Integrated payment gateways, SEO features and dynamic content; ran QA and cross-browser passes to cut load times on high-traffic pages.',
    ],
    tags: ['Full-Stack', 'SEO', 'Payments', 'QA'],
  },
];

// Education used to occupy a full screen for a degree plus two school
// percentages. It is now one primary line and one footnote.
const DEGREE = {
  school: 'Dwarkadas J. Sanghvi College of Engineering',
  program: 'B.Tech, Computer Science & Engineering (Data Science)',
  period: '2023 — 2027',
  grade: 'CGPA 9.51 / 10',
};
const EARLIER = 'Pace Junior College — HSC 88.3% · Hiranandani Foundation School — ICSE 98.6%';

export default function Experience() {
  return (
    <section id="experience" style={{ background: 'var(--bg-base)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <SectionHeader
          label="track record"
          title="Where the work actually happened."
          intro="Two internships, one still running — and the degree underneath them."
          maxWidth={660}
        />

        <div className="tr-rail">
          {JOBS.map((job, i) => (
            <motion.div
              key={job.role + job.org}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="tr-item"
            >
              <span className={`tr-dot${job.current ? ' tr-dot--now' : ''}`} />
              <div className="tr-card">
                <div className="tr-head">
                  <div>
                    <h3 className="tr-role">{job.role}</h3>
                    <p className="tr-org">
                      {job.org}
                      <span className="tr-sep">·</span>
                      <MapPin size={12} strokeWidth={2} />
                      {job.location}
                    </p>
                  </div>
                  <span className="tr-period">{job.period}</span>
                </div>

                <ul className="tr-bullets">
                  {job.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>

                <div className="tr-tags">
                  {job.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* education — compact, one line of substance plus a footnote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="tr-edu"
        >
          <span className="tr-edu-ic"><GraduationCap size={16} strokeWidth={2} /></span>
          <div className="tr-edu-body">
            <div className="tr-edu-top">
              <p className="tr-edu-school">{DEGREE.school}</p>
              <span className="tr-edu-grade">{DEGREE.grade}</span>
            </div>
            <p className="tr-edu-prog">{DEGREE.program} <span className="tr-sep">·</span> {DEGREE.period}</p>
            <p className="tr-edu-earlier">{EARLIER}</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .tr-rail { position: relative; padding-left: 28px; }
        .tr-item { position: relative; padding-bottom: 18px; }
        .tr-item:last-child { padding-bottom: 0; }
        /* connector runs between dots, not past the last one */
        .tr-item:not(:last-child)::before {
          content: ''; position: absolute; left: -23px; top: 34px; bottom: 4px;
          width: 1px; background: var(--border-subtle);
        }
        /* dot centred on the card's first text line, which the old one was not */
        .tr-dot {
          position: absolute; left: -28px; top: 26px;
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--bg-elevated); border: 2px solid var(--border-hover);
        }
        .tr-dot--now {
          background: var(--accent-dev); border-color: var(--accent-dev);
          box-shadow: 0 0 0 4px rgba(124,111,247,0.16);
        }

        .tr-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .tr-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }

        .tr-head { display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
        .tr-role { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
        .tr-org {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--text-secondary); margin: 0;
        }
        .tr-sep { opacity: 0.45; }
        .tr-period {
          font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
          color: var(--accent-dev); letter-spacing: 0.03em; flex-shrink: 0;
        }

        .tr-bullets { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .tr-bullets li {
          position: relative; padding-left: 16px;
          font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.7; color: var(--text-secondary);
        }
        .tr-bullets li::before {
          content: ''; position: absolute; left: 0; top: 9px;
          width: 5px; height: 5px; border-radius: 50%; background: var(--accent-dev); opacity: 0.7;
        }

        .tr-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .tr-tags span {
          font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; color: var(--accent-dev);
          background: rgba(124,111,247,0.1); border: 1px solid rgba(124,111,247,0.22);
          border-radius: 999px; padding: 3px 10px;
        }

        .tr-edu {
          display: flex; gap: 14px; margin-top: 22px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 20px 22px;
        }
        .tr-edu-ic {
          width: 34px; height: 34px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 9px; color: var(--accent-dev);
          background: rgba(124,111,247,0.08); border: 1px solid rgba(124,111,247,0.26);
        }
        .tr-edu-body { flex: 1; min-width: 0; }
        .tr-edu-top { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline; justify-content: space-between; }
        .tr-edu-school { font-family: 'Clash Display', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0; }
        .tr-edu-grade {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--accent-dev);
          background: rgba(124,111,247,0.1); border: 1px solid rgba(124,111,247,0.24);
          border-radius: 999px; padding: 3px 10px; flex-shrink: 0;
        }
        .tr-edu-prog { font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-secondary); margin: 5px 0 0; }
        .tr-edu-earlier {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-tertiary);
          margin: 10px 0 0; padding-top: 10px; border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 560px) {
          .tr-rail { padding-left: 22px; }
          .tr-dot { left: -22px; }
          .tr-item:not(:last-child)::before { left: -17px; }
        }
      `}</style>
    </section>
  );
}
