'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const PIPELINE_NODES = [
  { y: 40, color: '#E8935A', title: 'IoT Sensors', sub: 'Real-time sensor data' },
  { y: 140, color: '#7C6FF7', title: 'Kafka', sub: 'Event streaming' },
  { y: 240, color: '#7C6FF7', title: 'Apache Flink', sub: 'Stream processing' },
  { y: 340, color: '#7C6FF7', title: 'ML Model', sub: 'Prediction engine' },
  { y: 440, color: '#4CAF50', title: 'Alert System', sub: 'Community notification' },
];

const MOBILE_PILLS = ['Kafka', 'Flink', 'TensorFlow', 'IoT', 'Python', 'PyTorch'];

const NODE_HEIGHT = 60;

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function PipelineSVG() {
  return (
    <svg viewBox="0 0 300 520" width="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes flowDown {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -20; }
        }
        @keyframes packetMove {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Connecting lines + data packets */}
      {PIPELINE_NODES.slice(0, -1).map((node, i) => {
        const next = PIPELINE_NODES[i + 1];
        const y1 = node.y + NODE_HEIGHT / 2;
        const y2 = next.y - NODE_HEIGHT / 2;
        return (
          <g key={`conn-${i}`}>
            <line
              x1={150}
              y1={y1}
              x2={150}
              y2={y2}
              stroke={hexToRgba(node.color, 0.4)}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              style={{ animation: 'flowDown 1.2s linear infinite' }}
            />
            <circle r={4} fill={node.color}>
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
                path={`M150,${y1} L150,${y2}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </circle>
          </g>
        );
      })}

      {/* Nodes */}
      {PIPELINE_NODES.map((node) => {
        const rectY = node.y - NODE_HEIGHT / 2;
        return (
          <g key={node.title}>
            <rect
              x={50}
              y={rectY}
              width={200}
              height={NODE_HEIGHT}
              rx={10}
              fill={hexToRgba(node.color, 0.12)}
              stroke={hexToRgba(node.color, 0.55)}
              strokeWidth={1}
            />
            <text
              x={150}
              y={node.y - 8}
              textAnchor="middle"
              fill={node.color}
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {node.title}
            </text>
            <text
              x={150}
              y={node.y + 10}
              textAnchor="middle"
              fill="#4A4845"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
              }}
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Research() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="research"
      style={{
        background: 'var(--bg-surface)',
        padding: '120px 24px',
        width: '100%',
      }}
    >
      <div
        ref={ref}
        className="research-layout"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left column — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            · research ·
          </p>

          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '16px 0 24px',
            }}
          >
            Building systems that save lives.
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}
          >
            As a Research Intern at IIT Bombay, I&apos;m working on multi-hazard
            early warning systems — real-time pipelines that go from IoT sensor
            data to life-saving community alerts in seconds.
          </p>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginTop: '16px',
            }}
          >
            The stack is Kafka for ingestion, Apache Flink for stream processing,
            and deep learning models for prediction. The goal is sub-minute
            disaster nowcasting.
          </p>

          {/* IIT Bombay badge */}
          <div
            style={{
              marginTop: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px 20px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#7C6FF726',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-dev)',
                }}
              >
                IIT B
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}
              >
                Research Intern
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.3,
                  marginTop: '2px',
                }}
              >
                IIT Bombay &middot; 2024 – Present
              </p>
            </div>
          </div>

          {/* Mobile-only tech pills (hidden on desktop via CSS below) */}
          <div
            className="research-mobile-pills"
            style={{
              display: 'none',
              gap: '8px',
              marginTop: '32px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {MOBILE_PILLS.map((pill) => (
              <span
                key={pill}
                style={{
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right column — SVG pipeline */}
        <motion.div
          className="research-pipeline"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
        >
          <PipelineSVG />
        </motion.div>
      </div>

      <style>{`
        .research-mobile-pills::-webkit-scrollbar { display: none; }

        @media (max-width: 1023px) {
          .research-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .research-pipeline {
            display: none !important;
          }
          .research-mobile-pills {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
}
