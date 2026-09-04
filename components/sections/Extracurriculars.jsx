'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Trophy } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const ORGS = [
  {
    name: 'DJS S4DS',
    sub: "Society for Data Science — DJ Sanghvi's data-science chapter",
    roles: [
      { title: 'Chairperson', period: 'Aug 2025 — Jul 2026', current: true },
      { title: 'Marketing Team Member', period: 'Aug 2024 — Aug 2025' },
      { title: 'Technical Team Member', period: 'Aug 2024 — Aug 2025' },
    ],
    highlights: [
      'Led 150+ members, including an 80+ person core committee',
      'Directed XTract 4.0 and DataHack 4.0 — the chapter’s flagship competition and hackathon',
      'Steered the chapter to Best S4DS Chapter of the Year, nationally',
    ],
  },
  {
    name: 'DJS MUNSOC',
    sub: "DJ Sanghvi's Model United Nations society",
    roles: [
      { title: 'Vice President', period: 'Feb 2025 — Jan 2026', current: true },
      { title: 'Events Team Member', period: 'Feb 2024 — Feb 2025' },
      { title: 'Marketing Team Member', period: 'Feb 2024 — Feb 2025' },
      { title: 'Technical Team Member', period: 'Feb 2024 — Feb 2025' },
    ],
    highlights: [],
  },
  {
    name: 'DJS Compute',
    sub: "DJ Sanghvi's computer science society",
    roles: [
      { title: 'Web Tech Member', period: 'Aug 2024 — Jul 2025' },
    ],
    highlights: [],
  },
];

export default function Extracurriculars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="extracurriculars" style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-dev)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            leadership & extracurriculars
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Outside the syllabus, still on the record.
          </h2>
        </motion.div>

        <div ref={ref} className="xc-grid">
          {ORGS.map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="xc-card"
            >
              <div className="xc-icon"><Users size={16} strokeWidth={2} /></div>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '14px' }}>{org.name}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: 'var(--text-tertiary)', marginTop: '3px', marginBottom: '18px' }}>{org.sub}</p>

              <div className="xc-roles">
                {org.roles.map((r) => (
                  <div key={r.title} className="xc-role">
                    <span className={`xc-role-dot${r.current ? ' xc-role-dot--current' : ''}`} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</p>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', color: 'var(--text-tertiary)', marginTop: '1px' }}>{r.period}</p>
                    </div>
                  </div>
                ))}
              </div>

              {org.highlights.length > 0 && (
                <div className="xc-highlights">
                  {org.highlights.map((h) => (
                    <p key={h} className="xc-highlight">
                      <Trophy size={12} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-dev)' }} />
                      <span>{h}</span>
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .xc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .xc-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 18px; padding: 24px; transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .xc-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
        .xc-icon {
          width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
          background: rgba(124,111,247,0.1); border: 1px solid rgba(124,111,247,0.24); color: var(--accent-dev);
        }
        .xc-roles { display: flex; flex-direction: column; gap: 12px; }
        .xc-role { display: flex; align-items: flex-start; gap: 10px; }
        .xc-role-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--border-hover);
          margin-top: 5px; flex-shrink: 0;
        }
        .xc-role-dot--current { background: var(--accent-dev); box-shadow: 0 0 0 3px rgba(124,111,247,0.18); }
        .xc-highlights {
          margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-subtle);
          display: flex; flex-direction: column; gap: 8px;
        }
        .xc-highlight {
          display: flex; align-items: flex-start; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 12.5px; line-height: 1.55; color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .xc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
