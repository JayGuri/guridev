'use client';

import { motion } from 'framer-motion';
import { LineChart, Landmark, Code2, Trophy } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1];

// Each society gets its own icon — all three used to share a generic `Users`
// glyph. Role histories collapse to one current title plus a "previously"
// line; the old version listed four roles with three identical date ranges.
const ORGS = [
  {
    name: 'DJS S4DS',
    sub: 'Society for Data Science',
    Icon: LineChart,
    role: 'Chairperson',
    period: '2025 — 26',
    previously: 'previously marketing & technical team, 2024 — 25',
    highlights: [
      'Led 150+ members including an 80-person core committee.',
      'Directed XTract 4.0 and DataHack 4.0 — the chapter’s flagship competition and hackathon.',
      'Steered the chapter to Best S4DS Chapter of the Year, nationally.',
    ],
  },
  {
    name: 'DJS MUNSOC',
    sub: 'Model United Nations Society',
    Icon: Landmark,
    role: 'Vice President',
    period: '2025 — 26',
    previously: 'previously events, marketing & technical team, 2024 — 25',
    highlights: [
      'Spearheaded DJS Youth Summit 2.0 and DJMUN 2.0 — the largest MUN events in college history, 500+ participants on a ₹3L+ budget.',
      'Directed delegate affairs, academic programming and logistics across 8 inter-department committees.',
      'Built the leadership pipeline from the ground up, moving from contributor to organiser.',
    ],
  },
];

const MINOR = {
  name: 'DJS Compute',
  sub: 'Computer Science Society',
  Icon: Code2,
  role: 'Web Tech Member',
  period: '2024 — 25',
  note: 'On the web team — built and maintained the society’s site and event pages through the year.',
};

export default function Extracurriculars() {
  return (
    <section id="extracurriculars" style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        <SectionHeader
          label="leadership"
          title="Outside the syllabus, still on the record."
          intro="Two societies I currently run, and one I built websites for."
          maxWidth={660}
        />

        {/* the two substantial roles — equal weight, equal height */}
        <div className="lx-grid">
          {ORGS.map((org, i) => (
            <motion.article
              key={org.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="lx-card"
            >
              <header className="lx-head">
                <span className="lx-ic"><org.Icon size={17} strokeWidth={2} /></span>
                <div style={{ minWidth: 0 }}>
                  <h3 className="lx-name">{org.name}</h3>
                  <p className="lx-sub">{org.sub}</p>
                </div>
              </header>

              <div className="lx-role">
                <span className="lx-role-now">
                  <span className="lx-pulse" />
                  {org.role}
                </span>
                <span className="lx-role-period">{org.period}</span>
              </div>
              <p className="lx-prev">{org.previously}</p>

              <ul className="lx-highlights">
                {org.highlights.map((h) => (
                  <li key={h}>
                    <Trophy size={12} strokeWidth={2} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {/* the lighter one, sized honestly instead of padded to match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="lx-minor"
        >
          <span className="lx-ic"><MINOR.Icon size={17} strokeWidth={2} /></span>
          <div className="lx-minor-body">
            <div className="lx-minor-top">
              <h3 className="lx-name">{MINOR.name}</h3>
              <span className="lx-minor-role">{MINOR.role} <span className="lx-dim">· {MINOR.period}</span></span>
            </div>
            <p className="lx-minor-note">{MINOR.note}</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .lx-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; align-items: stretch; }
        @media (max-width: 820px) { .lx-grid { grid-template-columns: 1fr; } }

        .lx-card {
          display: flex; flex-direction: column;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 22px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .lx-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }

        .lx-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .lx-ic {
          width: 36px; height: 36px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 10px; color: var(--accent-dev);
          background: rgba(124,111,247,0.09); border: 1px solid rgba(124,111,247,0.26);
        }
        .lx-name { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text-primary); margin: 0; }
        .lx-sub { font-family: 'Inter', sans-serif; font-size: 12.5px; color: var(--text-secondary); margin: 2px 0 0; }

        .lx-role { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .lx-role-now {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 600; color: var(--text-primary);
        }
        .lx-pulse {
          width: 7px; height: 7px; border-radius: 50%; background: var(--accent-dev);
          box-shadow: 0 0 0 3px rgba(124,111,247,0.18); flex-shrink: 0;
        }
        .lx-role-period {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: var(--accent-dev); flex-shrink: 0;
        }
        .lx-prev {
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
          color: var(--text-tertiary); margin: 6px 0 0; padding-left: 15px;
        }

        .lx-highlights {
          list-style: none; margin: 18px 0 0; padding: 16px 0 0;
          border-top: 1px solid var(--border-subtle);
          display: flex; flex-direction: column; gap: 9px;
        }
        .lx-highlights li {
          display: flex; align-items: flex-start; gap: 9px;
          font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.6; color: var(--text-secondary);
        }
        .lx-highlights svg { color: var(--accent-dev); flex-shrink: 0; margin-top: 3px; }

        .lx-minor {
          display: flex; align-items: flex-start; gap: 12px; margin-top: 16px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 20px 22px;
        }
        .lx-minor-body { flex: 1; min-width: 0; }
        .lx-minor-top { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; justify-content: space-between; }
        .lx-minor-role { font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500; color: var(--text-secondary); }
        .lx-dim { color: var(--text-tertiary); font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .lx-minor-note { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.6; color: var(--text-secondary); margin: 7px 0 0; }
      `}</style>
    </section>
  );
}
