'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, Boxes, X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ProjectModal from '@/components/ui/ProjectModal';
import { PROJECTS, CATEGORY_META, STATUS_META, GITHUB_PROFILE } from '@/lib/projects';

const EASE = [0.16, 1, 0.3, 1];

// Only mounts when the visitor asks for it — the room is ~1.5k lines of three.js
// and used to gate the whole section behind a camera animation.
const RoomScene = dynamic(() => import('@/components/effects/RoomScene'), { ssr: false });

const SCREEN_META = {
  dev: { label: 'The Builder', color: '#7C6FF7', cmd: 'cd --dev' },
  aiml: { label: 'AI / ML', color: '#28C840', cmd: 'cd --aiml' },
  research: { label: 'The Researcher', color: '#E8935A', cmd: 'cd --research' },
};

function ProjectCard({ p, i, onOpen }) {
  const cat = CATEGORY_META[p.category];
  const st = STATUS_META[p.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.07, duration: 0.55, ease: EASE }}
      className="pj-card"
      style={{ '--pj': cat.color }}
    >
      <button className="pj-hit" onClick={() => onOpen(p)} aria-label={`Read more about ${p.name}`} />

      <header className="pj-top">
        <span className="pj-cat">{cat.label}</span>
        <span className="pj-meta">
          <span className="pj-status" style={{ '--st': st.color }}>
            <span className="pj-dot" />{st.label}
          </span>
          <span className="pj-year">{p.year}</span>
        </span>
      </header>

      <h3 className="pj-name">{p.name}</h3>
      <p className="pj-hook">{p.hook}</p>
      <p className="pj-desc">{p.desc}</p>

      <ul className="pj-tech">
        {p.tech.map((t) => <li key={t}>{t}</li>)}
      </ul>

      <footer className="pj-foot">
        <span className="pj-more">Read more <ArrowUpRight size={13} strokeWidth={2.4} /></span>
        {p.repo && (
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="pj-link">
            <Github size={13} strokeWidth={2} /> Code
          </a>
        )}
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="pj-link">
            <ArrowUpRight size={13} strokeWidth={2} /> Live
          </a>
        )}
      </footer>
    </motion.article>
  );
}

export default function DevStudio() {
  const [selected, setSelected] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);

  // Room interaction state — only meaningful while the studio is open.
  const [activeScreen, setActiveScreen] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    if (!activeScreen) { setIsZoomedIn(false); return; }
    const t = setTimeout(() => setIsZoomedIn(true), 920);
    return () => clearTimeout(t);
  }, [activeScreen]);

  useEffect(() => {
    if (!studioOpen) { setActiveScreen(null); setIsZoomedIn(false); }
  }, [studioOpen]);

  const sl = activeScreen ? SCREEN_META[activeScreen] : null;

  return (
    <section id="work" style={{ background: 'var(--bg-base)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        <SectionHeader
          label="work"
          title="Four things I built, and what they do."
          intro="Research systems, distributed ML, and the site you're reading. Each card opens the write-up — the problem, the approach, and the part that needed rethinking."
          maxWidth={660}
        />

        <div className="pj-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} onOpen={setSelected} />
          ))}
        </div>

        {/* one honest link — per-project repos aren't public yet */}
        <div className="pj-after">
          <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="pj-ghlink">
            <Github size={15} strokeWidth={2} /> More on GitHub <ArrowUpRight size={13} strokeWidth={2.4} />
          </a>

          <button className="pj-studio-toggle" onClick={() => setStudioOpen((v) => !v)} aria-expanded={studioOpen}>
            {studioOpen ? <X size={15} strokeWidth={2} /> : <Boxes size={15} strokeWidth={2} />}
            {studioOpen ? 'Close the studio' : 'Explore the 3D studio'}
          </button>
        </div>

        {/* ── Opt-in three.js studio ────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {studioOpen && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ overflow: 'hidden' }}
            >
              <div className="pj-studio">
                <div className="pj-stage">
                  <RoomScene
                    activeScreen={activeScreen}
                    isZoomedIn={isZoomedIn}
                    onScreenClick={(id) => setActiveScreen((cur) => (cur === id ? cur : id))}
                    onOpenProject={(p) => setSelected(p)}
                  />
                  <div className="pj-vignette" />
                  {activeScreen && (
                    <button
                      className="pj-back"
                      style={{ '--pj': sl?.color ?? '#7C6FF7' }}
                      onClick={() => { setIsZoomedIn(false); setActiveScreen(null); }}
                    >
                      ← overview
                    </button>
                  )}
                  <span className="pj-stage-tag">three.js · click a monitor</span>
                </div>

                <div className="pj-pills">
                  {Object.entries(SCREEN_META).map(([id, meta]) => {
                    const on = activeScreen === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveScreen(on ? null : id)}
                        className={`pj-pill${on ? ' is-on' : ''}`}
                        style={{ '--pj': meta.color }}
                      >
                        <span className="pj-pill-dollar">$</span>{meta.cmd}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected && (
        <ProjectModal
          project={{
            ...selected,
            tech: Array.isArray(selected.tech) ? selected.tech.join(' · ') : selected.tech,
            color: CATEGORY_META[selected.category]?.color,
          }}
          onClose={() => setSelected(null)}
        />
      )}

      <style>{`
        .pj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 860px) { .pj-grid { grid-template-columns: 1fr; } }

        .pj-card {
          position: relative; display: flex; flex-direction: column;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 24px; overflow: hidden;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pj-card::before {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 2px;
          background: var(--pj); opacity: 0.5; transition: opacity 0.2s ease;
        }
        .pj-card:hover {
          border-color: color-mix(in srgb, var(--pj) 42%, transparent);
          transform: translateY(-3px);
          box-shadow: 0 18px 44px -22px var(--pj);
        }
        .pj-card:hover::before { opacity: 1; }
        /* full-card click target; real links sit above it on z-index */
        .pj-hit { position: absolute; inset: 0; z-index: 1; background: none; border: 0; cursor: pointer; }

        .pj-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .pj-cat {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--pj);
        }
        .pj-meta { display: inline-flex; align-items: center; gap: 12px; }
        .pj-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.08em; color: var(--st);
        }
        .pj-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--st); }
        .pj-year { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-tertiary); }

        .pj-name {
          font-family: 'Clash Display', sans-serif; font-size: 23px; font-weight: 600;
          color: var(--text-primary); letter-spacing: -0.015em; margin: 0 0 6px;
        }
        .pj-hook {
          font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 500;
          color: var(--pj); margin: 0 0 12px; line-height: 1.45;
        }
        .pj-desc {
          font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.68;
          color: var(--text-secondary); margin: 0 0 18px;
        }

        .pj-tech { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin: 0 0 20px; padding: 0; }
        .pj-tech li {
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
          color: var(--text-secondary); background: var(--bg-surface);
          border: 1px solid var(--border-subtle); border-radius: 5px; padding: 4px 8px;
        }

        .pj-foot { margin-top: auto; display: flex; align-items: center; gap: 16px; }
        .pj-more {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--pj);
        }
        .pj-card:hover .pj-more { text-decoration: underline; text-underline-offset: 3px; }
        .pj-link {
          position: relative; z-index: 2;
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Inter', sans-serif; font-size: 13px;
          color: var(--text-secondary); text-decoration: none;
        }
        .pj-link:hover { color: var(--text-primary); }

        .pj-after {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 14px; margin-top: 24px;
        }
        .pj-ghlink, .pj-studio-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
          color: var(--text-secondary); text-decoration: none;
          background: transparent; border: 1px solid var(--border-subtle);
          border-radius: 10px; padding: 11px 18px; cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .pj-ghlink:hover, .pj-studio-toggle:hover {
          color: var(--text-primary); border-color: var(--border-hover); transform: translateY(-2px);
        }

        .pj-studio { padding-top: 20px; }
        .pj-stage {
          position: relative; width: 100%;
          height: clamp(420px, 62vh, 660px);
          border-radius: 18px; overflow: hidden;
          border: 1px solid var(--border-subtle); background: #03040a;
        }
        .pj-vignette {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: radial-gradient(ellipse 88% 66% at 50% 50%, transparent 48%, rgba(0,0,0,0.36) 100%);
        }
        .pj-back {
          position: absolute; top: 14px; left: 14px; z-index: 10;
          background: rgba(5,6,12,0.88); backdrop-filter: blur(14px);
          border: 1px solid color-mix(in srgb, var(--pj) 32%, transparent);
          border-radius: 10px; padding: 8px 16px; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--pj);
        }
        .pj-stage-tag {
          position: absolute; bottom: 14px; left: 14px; z-index: 4; pointer-events: none;
          background: rgba(5,6,12,0.78); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 5px 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--text-tertiary);
        }

        .pj-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
        .pj-pill {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          background: rgba(20,24,32,0.6); border: 1px solid var(--border-subtle);
          border-radius: 8px; padding: 7px 14px; cursor: pointer; color: var(--text-tertiary);
          transition: all 0.16s ease;
        }
        .pj-pill:hover { color: var(--pj); border-color: color-mix(in srgb, var(--pj) 32%, transparent); }
        .pj-pill.is-on {
          color: var(--pj);
          border-color: color-mix(in srgb, var(--pj) 45%, transparent);
          background: color-mix(in srgb, var(--pj) 10%, transparent);
        }
        .pj-pill-dollar { opacity: 0.45; margin-right: 4px; }
      `}</style>
    </section>
  );
}
