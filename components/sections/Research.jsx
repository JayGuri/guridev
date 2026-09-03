'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Radio, Waves, Cpu, BrainCircuit, Siren, ArrowRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const STAGES = [
  { key: 'iot',   title: 'IoT Sensors',   sub: 'water level · rainfall · seismic', color: '#E8935A', Icon: Radio },
  { key: 'kafka', title: 'Kafka',          sub: 'durable ingestion',                color: '#7C6FF7', Icon: Waves },
  { key: 'flink', title: 'Apache Flink',   sub: 'windowed stream processing',        color: '#7C6FF7', Icon: Cpu },
  { key: 'model', title: 'DL Model',       sub: 'nowcast + anomaly score',           color: '#7C6FF7', Icon: BrainCircuit },
  { key: 'alert', title: 'Alert Channel',  sub: 'community notification',            color: '#3FB950', Icon: Siren },
];

const DOING = [
  'Keeping models accurate on cheap edge hardware and flaky networks.',
  'Making the stream layer survive bursts without dropping a reading.',
  'Turning a raw anomaly score into a warning a person can act on.',
];

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// ── Desktop: horizontal animated pipeline ────────────────────────────────────
function PipelineSVG() {
  const W = 1040, H = 200;
  const n = STAGES.length;
  const padX = 20;
  const slot = (W - padX * 2) / n;
  const nodeW = slot - 26;
  const nodeH = 92;
  const cy = 104;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <style>{`
        @keyframes rp-flow { to { stroke-dashoffset: -24; } }
        .rp-link { stroke-dasharray: 5 6; animation: rp-flow 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rp-link { animation: none; }
          .rp-packet { display: none; }
        }
      `}</style>

      {STAGES.slice(0, -1).map((s, i) => {
        const x1 = padX + i * slot + slot / 2 + nodeW / 2;
        const x2 = padX + (i + 1) * slot + slot / 2 - nodeW / 2;
        return (
          <g key={`lnk-${i}`}>
            <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={hexA(s.color, 0.45)} strokeWidth="1.6" className="rp-link" />
            <circle r="3.4" fill={s.color} className="rp-packet">
              <animateMotion dur="1.6s" repeatCount="indefinite" begin={`${i * 0.32}s`} path={`M${x1},${cy} L${x2},${cy}`} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="1.6s" repeatCount="indefinite" begin={`${i * 0.32}s`} />
            </circle>
          </g>
        );
      })}

      {STAGES.map((s, i) => {
        const x = padX + i * slot + slot / 2 - nodeW / 2;
        return (
          <g key={s.key}>
            <rect x={x} y={cy - nodeH / 2} width={nodeW} height={nodeH} rx="12"
              fill={hexA(s.color, 0.09)} stroke={hexA(s.color, 0.4)} strokeWidth="1" />
            <rect x={x} y={cy - nodeH / 2} width="3" height={nodeH} rx="1.5" fill={s.color} />
            <circle cx={x + nodeW - 12} cy={cy - nodeH / 2 + 12} r="3" fill={s.color}>
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>
            <text x={x + 18} y={cy - 8}
              style={{ fill: s.color, fontFamily: 'Clash Display, sans-serif', fontSize: '15px', fontWeight: 600 }}>{s.title}</text>
            <text x={x + 18} y={cy + 14}
              style={{ fill: 'var(--text-tertiary)', fontFamily: 'Inter, sans-serif', fontSize: '10.5px' }}>{s.sub}</text>
          </g>
        );
      })}

      {/* result callout */}
      <g>
        <line x1={W - padX - nodeW + 14} y1={cy + nodeH / 2 + 6} x2={W - padX - nodeW + 14} y2={cy + nodeH / 2 + 26}
          stroke={hexA('#3FB950', 0.5)} strokeWidth="1.6" strokeDasharray="4 4" />
        <text x={W - padX - nodeW + 26} y={cy + nodeH / 2 + 40}
          style={{ fill: '#3FB950', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
          → sub-minute flood warning
        </text>
      </g>
    </svg>
  );
}

// ── Mobile: vertical stage list ─────────────────────────────────────────────
function StageList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {STAGES.map((s, i) => (
        <div key={s.key} style={{ position: 'relative', paddingLeft: '18px' }}>
          {i < STAGES.length - 1 && (
            <span style={{ position: 'absolute', left: '5px', top: '38px', bottom: '-10px', width: '1.5px', background: hexA(s.color, 0.35) }} />
          )}
          <span style={{ position: 'absolute', left: 0, top: '20px', width: '11px', height: '11px', borderRadius: '50%', background: s.color, border: `2px solid var(--bg-surface)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: hexA(s.color, 0.07), border: `1px solid ${hexA(s.color, 0.28)}`, borderRadius: '12px', padding: '14px 16px' }}>
            <s.Icon size={18} strokeWidth={2} style={{ color: s.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '15px', fontWeight: 600, color: s.color }}>{s.title}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{s.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Research() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const up = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section id="research" style={{ background: 'var(--bg-surface)', padding: '120px 24px', width: '100%' }}>
      <div ref={ref} style={{ maxWidth: '1120px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div {...up(0)} style={{ maxWidth: '760px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            research
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.04, margin: '0 0 20px' }}>
            Building systems that save lives.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            At IIT Bombay I work on multi-hazard early warning systems &mdash; one pipeline that
            carries a reading from a sensor in a river to a warning on someone&apos;s phone before the
            water reaches them.
          </p>
        </motion.div>

        {/* Pipeline card */}
        <motion.div {...up(0.12)}
          style={{ marginTop: '48px', borderRadius: '20px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', letterSpacing: '0.08em' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#3FB950' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3FB950', boxShadow: '0 0 6px #3FB950' }} />
              LIVE · MULTI-HAZARD EWS
            </span>
            <span style={{ color: 'var(--text-tertiary)' }}>END-TO-END LATENCY ~0.9s</span>
          </div>
          <div style={{ padding: '30px 26px 26px' }}>
            <div className="research-pipe-desktop"><PipelineSVG /></div>
            <div className="research-pipe-mobile"><StageList /></div>
          </div>
        </motion.div>

        {/* Stat band */}
        <motion.div {...up(0.18)} className="research-stats"
          style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[['< 1 min', 'from reading to alert'], ['Kafka → Flink', 'streaming backbone'], ['edge-ready', 'runs on modest hardware']].map(([v, k]) => (
            <div key={k} style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 16px', background: 'var(--bg-elevated)' }}>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '19px', fontWeight: 600, color: 'var(--accent-dev)' }}>{v}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{k}</p>
            </div>
          ))}
        </motion.div>

        {/* Doing + badge */}
        <motion.div {...up(0.24)} className="research-bottom"
          style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              what the work actually is
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DOING.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ArrowRight size={15} strokeWidth={2.5} style={{ color: 'var(--accent-dev)', flexShrink: 0, marginTop: '4px' }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 20px', whiteSpace: 'nowrap' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: hexA('#7C6FF7', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Clash Display, sans-serif', fontSize: '11px', fontWeight: 600, color: 'var(--accent-dev)' }}>
              IIT&#8202;B
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Research Intern</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>IIT Bombay &middot; ongoing</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .research-pipe-mobile { display: none; }
        @media (max-width: 900px) {
          .research-pipe-desktop { display: none; }
          .research-pipe-mobile { display: block; }
          .research-stats { grid-template-columns: 1fr !important; }
          .research-bottom { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
