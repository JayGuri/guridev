'use client';

import { useEffect, useRef } from 'react';

/**
 * Beams — animated canvas light-beam rays.
 * Beams sway gently with sinusoidal motion; each has a vertical gradient glow.
 * Designed to sit as a full-bleed overlay layer (position absolute, inset 0).
 */
export default function Beams({
  beamWidth      = 2,     // base pixel width of the beam core
  beamHeight     = 10,    // height multiplier (relative to canvas height)
  beamNumber     = 12,    // how many beams
  lightColor     = '#7C6FF7',
  speed          = 0.5,   // sway animation speed
  noiseIntensity = 0.5,   // how much beams sway left/right
  scale          = 0.25,  // overall size scale
  rotation       = 0,     // tilt the whole field (degrees)
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const hex = lightColor.replace('#', '');
    const cr  = parseInt(hex.substring(0, 2), 16);
    const cg  = parseInt(hex.substring(2, 4), 16);
    const cb  = parseInt(hex.substring(4, 6), 16);

    let animId, lastTs = 0, time = 0;

    // Stable per-beam random properties
    const beams = Array.from({ length: beamNumber }, (_, i) => ({
      xFrac:      (i + 0.5) / beamNumber,              // even spread across width
      phase:      (Math.random() * Math.PI * 2),
      phaseSpeed: 0.25 + Math.random() * 0.6,
      alphaBase:  0.12 + Math.random() * 0.22,
      widthMult:  0.5  + Math.random() * 1.0,
      heightMult: 0.7  + Math.random() * 0.6,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (ts) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      time  += dt * speed;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      // Rotate the whole beam field around the canvas centre
      ctx.translate(W / 2, H / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-W / 2, -H / 2);

      beams.forEach((beam) => {
        // Horizontal sway
        const xOsc = Math.sin(time * beam.phaseSpeed + beam.phase) * noiseIntensity * W * 0.06;
        const bx   = beam.xFrac * W + xOsc;

        // Beam geometry (scaled)
        const bw  = beamWidth * beam.widthMult * scale * W * 0.035;
        const bh  = H * beamHeight * beam.heightMult * scale * 0.12;
        const top = (H - bh) / 2;

        const a = beam.alphaBase;

        // ── Vertical gradient (fade top & bottom) ───────────────────
        const vGrad = ctx.createLinearGradient(bx, top, bx, top + bh);
        vGrad.addColorStop(0,    `rgba(${cr},${cg},${cb},0)`);
        vGrad.addColorStop(0.12, `rgba(${cr},${cg},${cb},${a})`);
        vGrad.addColorStop(0.5,  `rgba(${cr},${cg},${cb},${(a * 1.4).toFixed(3)})`);
        vGrad.addColorStop(0.88, `rgba(${cr},${cg},${cb},${a})`);
        vGrad.addColorStop(1,    `rgba(${cr},${cg},${cb},0)`);

        ctx.fillStyle = vGrad;
        ctx.fillRect(bx - bw / 2, top, bw, bh);

        // ── Glow halo (wider, softer) ────────────────────────────────
        const gw = bw * 5;
        const hGrad = ctx.createLinearGradient(bx - gw / 2, 0, bx + gw / 2, 0);
        hGrad.addColorStop(0,   `rgba(${cr},${cg},${cb},0)`);
        hGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(a * 0.35).toFixed(3)})`);
        hGrad.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);

        // Pair with vertical envelope
        const glowVGrad = ctx.createLinearGradient(bx, top, bx, top + bh);
        glowVGrad.addColorStop(0,   `rgba(${cr},${cg},${cb},0)`);
        glowVGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(a * 0.35).toFixed(3)})`);
        glowVGrad.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);

        ctx.fillStyle = hGrad;
        ctx.fillRect(bx - gw / 2, top, gw, bh);
      });

      ctx.restore();
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
