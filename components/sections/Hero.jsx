'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import PixelBlast from '@/components/PixelBlast';
import Beams from '@/components/Beams';
import PixelWash from '@/components/PixelWash';

const EASE = [0.16, 1, 0.3, 1];

// Concrete, verifiable facts. The hero used to rotate
// Developer/Researcher/Photographer/Builder and say nothing specific.
const FACTS = [
  ['now', 'ML research intern, IIT Bombay'],
  ['studying', 'CS & Data Science, DJ Sanghvi'],
  ['before', 'Web dev intern, Realatte'],
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const prefersReduced = useReducedMotion();

  // The two WebGL layers are the heaviest thing on the page; phones and
  // reduced-motion visitors get the cheap canvas shimmer instead.
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const sync = () => setIsSmall(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const showFX = !prefersReduced && !isSmall;

  const rise = (delay = 0) =>
    prefersReduced
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  // Subtle mouse parallax on the name only.
  const nameRef = useRef(null);
  useEffect(() => {
    if (prefersReduced) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e) => {
      target.x = e.clientX - window.innerWidth / 2;
      target.y = e.clientY - window.innerHeight / 2;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      if (nameRef.current) {
        nameRef.current.style.transform = `translate(${cur.x / 46}px, ${cur.y / 46}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', background: 'var(--bg-base)',
        padding: '96px 24px 88px',
      }}
    >
      {showFX ? (
        <>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.4, zIndex: 0, pointerEvents: 'none' }}>
            <PixelBlast
              variant="square" pixelSize={4} color="#7C6FF7"
              patternScale={1.2} patternDensity={0.5}
              enableRipples rippleSpeed={0.2} rippleThickness={0.08}
              speed={0.3} transparent edgeFade={0.6}
            />
          </div>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, zIndex: 0, pointerEvents: 'none' }}>
            <Beams
              beamWidth={1.5} beamHeight={10} beamNumber={12}
              lightColor="#7C6FF7" speed={0.6} noiseIntensity={0.6}
              scale={0.25} rotation={0}
            />
          </div>
        </>
      ) : (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(62% 50% at 50% 40%, rgba(124,111,247,0.17), transparent 72%)' }} />
          <PixelWash color="#7C6FF7" cell={7} density={0.5} style={{ opacity: 0.45 }} />
        </div>
      )}

      {/* readability scrim so the type never fights the shader */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(58% 46% at 50% 46%, rgba(8,8,9,0.80), rgba(8,8,9,0.28) 60%, transparent 82%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '860px', textAlign: 'center' }}>

        {/* availability */}
        <motion.div {...rise(0.05)} style={{ display: 'flex', justifyContent: 'center', marginBottom: '26px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '9px',
            border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)',
            borderRadius: '999px', padding: '7px 15px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px',
            letterSpacing: '0.04em', color: 'var(--text-secondary)',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3FB950', boxShadow: '0 0 7px #3FB950' }} />
            open to internships · Mumbai / remote
          </span>
        </motion.div>

        <motion.h1
          ref={nameRef}
          className="hero-name"
          {...rise(0.12)}
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(52px, 8.4vw, 104px)', fontWeight: 600,
            letterSpacing: '-0.035em', lineHeight: 0.95, margin: '0 0 18px',
            willChange: 'transform',
          }}
        >
          Jay Guri
        </motion.h1>

        {/* The actual positioning statement — this is what the hero was missing */}
        <motion.p {...rise(0.2)} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(17px, 2.1vw, 21px)', lineHeight: 1.55,
          color: 'var(--text-primary)', maxWidth: '620px', margin: '0 auto 14px',
          fontWeight: 450,
        }}>
          I build systems that turn messy real-world signals into decisions
          people can act on.
        </motion.p>

        <motion.p {...rise(0.26)} style={{
          fontFamily: 'Inter, sans-serif', fontSize: '15.5px', lineHeight: 1.6,
          color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 34px',
        }}>
          Machine learning, streaming data, and the web in front of it — plus a
          camera when the laptop closes.
        </motion.p>

        {/* facts strip — replaces the rotating role word */}
        <motion.dl {...rise(0.32)} className="hero-facts">
          {FACTS.map(([k, v]) => (
            <div key={k} className="hero-fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div {...rise(0.4)} className="hero-cta">
          <button onClick={() => scrollTo('work')} className="hero-btn hero-btn--primary">
            See the work <ArrowRight size={16} strokeWidth={2.4} />
          </button>
          <button onClick={() => scrollTo('contact')} className="hero-btn hero-btn--ghost">
            Get in touch
          </button>
          <button onClick={() => scrollTo('photography')} className="hero-link">
            or look at the photographs
          </button>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollTo('work')}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReduced ? {} : { delay: 1.1, duration: 0.8 }}
        className="hero-scroll"
        aria-label="Scroll to work"
      >
        <ArrowDown size={14} strokeWidth={2} />
      </motion.button>

      <style>{`
        .hero-name {
          background-image: linear-gradient(
            110deg,
            var(--text-primary) 0%, var(--text-primary) 32%,
            #9A8CFF 44%, #E8935A 54%,
            var(--text-primary) 68%, var(--text-primary) 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          animation: heroNameSheen 7.5s ease-in-out infinite;
        }
        @keyframes heroNameSheen {
          0%, 100% { background-position: 118% 0; }
          50%      { background-position: -18% 0; }
        }

        .hero-facts {
          display: flex; justify-content: center; flex-wrap: wrap;
          gap: 10px 34px; margin: 0 0 34px; padding: 0;
        }
        .hero-fact { text-align: left; }
        .hero-fact dt {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--accent-dev); margin-bottom: 3px;
        }
        .hero-fact dd {
          font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500;
          color: var(--text-secondary); margin: 0;
        }

        .hero-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500;
          padding: 13px 24px; border-radius: 10px; cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .hero-btn--primary { background: var(--accent-dev); color: #fff; border: 1px solid var(--accent-dev); }
        .hero-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -8px rgba(124,111,247,0.55); }
        .hero-btn--ghost { background: transparent; color: var(--text-primary); border: 1px solid var(--border-hover); }
        .hero-btn--ghost:hover { transform: translateY(-2px); border-color: var(--text-secondary); background: rgba(255,255,255,0.04); }
        .hero-link {
          background: none; border: 0; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14px;
          color: var(--text-tertiary); text-decoration: underline;
          text-decoration-color: var(--border-hover); text-underline-offset: 4px;
          transition: color 0.18s ease;
        }
        .hero-link:hover { color: var(--accent-photo); text-decoration-color: var(--accent-photo); }
        @media (max-width: 560px) { .hero-link { flex-basis: 100%; margin-top: 4px; } }

        .hero-scroll {
          position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
          z-index: 2; width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);
          color: var(--text-tertiary); cursor: pointer;
          animation: heroScrollBob 2.2s ease-in-out infinite;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .hero-scroll:hover { color: var(--text-primary); border-color: var(--border-hover); }
        @keyframes heroScrollBob { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 6px); } }

        @media (prefers-reduced-motion: reduce) {
          .hero-name { animation: none; background-position: 50% 0; }
          .hero-scroll { animation: none; }
        }
      `}</style>
    </section>
  );
}
