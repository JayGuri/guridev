'use client';

import { motion } from 'framer-motion';
import { Radio, Waves, Cpu, BrainCircuit, Siren, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1];

const STAGES = [
  { key: 'iot',   title: 'IoT Sensors',   sub: 'water level · rainfall · seismic', color: '#E8935A', Icon: Radio },
  { key: 'kafka', title: 'Kafka',         sub: 'durable ingestion',                color: '#7C6FF7', Icon: Waves },
  { key: 'flink', title: 'Apache Flink',  sub: 'windowed stream processing',       color: '#7C6FF7', Icon: Cpu },
  { key: 'model', title: 'DL Model',      sub: 'nowcast + anomaly score',          color: '#7C6FF7', Icon: BrainCircuit },
  { key: 'alert', title: 'Alert Channel', sub: 'community notification',           color: '#3FB950', Icon: Siren },
];

const DOING = [
  'Keeping models accurate on cheap edge hardware and flaky rural networks.',
  'Making the stream layer survive bursts without dropping a single reading.',
  'Turning a raw anomaly score into a warning a person will actually act on.',
];

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// Desktop: horizontal animated pipeline.
// The viewBox used to be 200 tall for 92px of content, which left a large
// void inside the card. Node band and callout are now packed into 164.
function PipelineSVG() {
  const W = 1040, H = 164;
  const n = STAGES.length;
  const padX = 20;
  const slot = (W - padX * 2) / n;
  const nodeW = slot - 26;
  const nodeH = 92;
  const cy = 60;

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
              style={{ fill: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '10.5px' }}>{s.sub}</text>
          </g>
        );
      })}

      <g>
        <line x1={W - padX - nodeW + 14} y1={cy + nodeH / 2 + 6} x2={W - padX - nodeW + 14} y2={cy + nodeH / 2 + 24}
          stroke={hexA('#3FB950', 0.5)} strokeWidth="1.6" strokeDasharray="4 4" />
        <text x={W - padX - nodeW + 26} y={cy + nodeH / 2 + 38}
          style={{ fill: '#3FB950', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
          → under 60s, sensor to phone
        </text>
      </g>
    </svg>
  );
}

// Mobile: vertical stage list.
function StageList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {STAGES.map((s, i) => (
        <div key={s.key} style={{ position: 'relative', paddingLeft: '18px' }}>
          {i < STAGES.length - 1 && (
            <span style={{ position: 'absolute', left: '5px', top: '38px', bottom: '-10px', width: '1.5px', background: hexA(s.color, 0.35) }} />
          )}
          <span style={{ position: 'absolute', left: 0, top: '20px', width: '11px', height: '11px', borderRadius: '50%', background: s.color, border: '2px solid var(--bg-surface)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: hexA(s.color, 0.07), border: `1px solid ${hexA(s.color, 0.28)}`, borderRadius: '12px', padding: '14px 16px' }}>
            <s.Icon size={18} strokeWidth={2} style={{ color: s.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '15px', fontWeight: 600, color: s.color }}>{s.title}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.sub}</p>
            </div>
          </div>
        </div>
      ))}
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px', fontWeight: 600, color: '#3FB950', marginTop: '4px', paddingLeft: '18px' }}>
        → under 60s, sensor to phone
      </p>
    </div>
  );
}

export default function Research() {
  return (
    <section id="research" style={{ background: 'var(--bg-surface)', padding: 'var(--section-pad-y) 24px', width: '100%' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        <SectionHeader
          label="research"
          title="Building systems that save lives."
          intro="At IIT Bombay I work on multi-hazard early warning — one pipeline that carries a reading from a sensor in a river to a warning on someone's phone before the water reaches them."
          maxWidth={720}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '13px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', letterSpacing: '0.08em' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#3FB950' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3FB950', boxShadow: '0 0 6px #3FB950' }} />
              LIVE · MULTI-HAZARD EWS
            </span>
            {/* the processing hop, deliberately distinct from the end-to-end figure */}
            <span style={{ color: 'var(--text-tertiary)' }}>STREAM HOP ~0.9s</span>
          </div>
          <div style={{ padding: '24px 22px 20px' }}>
            <div className="rs-desktop"><PipelineSVG /></div>
            <div className="rs-mobile"><StageList /></div>
          </div>
        </motion.div>

        {/* what the work actually is + the affiliation badge */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: EASE }}
          className="rs-bottom"
        >
          <div>
            <p className="rs-eyebrow">what the work actually is</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {DOING.map((d) => (
                <div key={d} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                  <ArrowRight size={15} strokeWidth={2.5} style={{ color: 'var(--accent-dev)', flexShrink: 0, marginTop: '4px' }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rs-badge">
            <span className="rs-badge-mark">IIT&#8202;B</span>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Research Intern</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>IIT Bombay · CSRE · ongoing</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .rs-mobile { display: none; }
        .rs-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-tertiary); margin: 0 0 14px;
        }
        .rs-bottom {
          margin-top: 32px; display: grid; grid-template-columns: 1fr auto;
          gap: 40px; align-items: start;
        }
        .rs-badge {
          display: inline-flex; align-items: center; gap: 14px; white-space: nowrap;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 14px 20px;
        }
        .rs-badge-mark {
          width: 38px; height: 38px; flex-shrink: 0; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(124,111,247,0.14); color: var(--accent-dev);
          font-family: 'Clash Display', sans-serif; font-size: 11px; font-weight: 600;
        }
        @media (max-width: 900px) {
          .rs-desktop { display: none; }
          .rs-mobile { display: block; }
          .rs-bottom { grid-template-columns: 1fr; gap: 26px; }
        }
      `}</style>
    </section>
  );
}
