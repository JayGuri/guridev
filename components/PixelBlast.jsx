'use client';

import { useEffect, useRef } from 'react';

/**
 * PixelBlast — animated canvas pixel grid with ripple waves and edge fade.
 * Designed to sit as a full-bleed background layer (position absolute, inset 0).
 */
export default function PixelBlast({
  variant       = 'square',   // 'square' | 'circle'
  pixelSize     = 4,          // pixel / dot size in px
  color         = '#7C6FF7',
  patternScale  = 1,          // spacing multiplier
  patternDensity= 0.5,        // 0..1 — fraction of pixels visible
  enableRipples = true,
  rippleSpeed   = 0.2,        // how fast ripples spread
  rippleThickness = 0.1,      // thickness of the ripple ring (0..1)
  speed         = 0.3,        // animation speed multiplier
  transparent   = true,       // unused — canvas is always transparent
  edgeFade      = 0.5,        // how aggressively edges fade (higher = faster fade)
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Parse hex → r, g, b
    const hex = color.replace('#', '');
    const cr  = parseInt(hex.substring(0, 2), 16);
    const cg  = parseInt(hex.substring(2, 4), 16);
    const cb  = parseInt(hex.substring(4, 6), 16);

    let animId;
    let time     = 0;
    let lastTs   = 0;
    let nextRipple = 2;
    const ripples = [];

    // Size canvas to its CSS box at device pixel ratio
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w   = canvas.offsetWidth;
      const h   = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const step = pixelSize * patternScale;

    const draw = (ts) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      time  += dt * speed;
      nextRipple -= dt;

      if (enableRipples && nextRipple <= 0) {
        nextRipple = 1.5 + Math.random() * 2.5;
        ripples.push({
          // normalised (0..1) spawn position, biased toward centre
          x:     0.15 + Math.random() * 0.7,
          y:     0.15 + Math.random() * 0.7,
          born:  time,
          maxR:  0.7,
          speed: rippleSpeed,
        });
        if (ripples.length > 5) ripples.shift();
      }

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / step) + 1;
      const rows = Math.ceil(H / step) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * step;
          const py = j * step;
          const nx = px / W;  // 0..1
          const ny = py / H;

          // ── Edge fade (sin envelope → 0 at edges, 1 at centre) ──────
          const ex   = Math.sin(nx * Math.PI);
          const ey   = Math.sin(ny * Math.PI);
          const edge = Math.pow(Math.max(0, ex * ey), edgeFade * 2);

          // ── Organic noise from layered sines ─────────────────────────
          const noise = (
            Math.sin(i * 0.38 + time * 1.1) *
            Math.cos(j * 0.38 + time * 0.73) +
            Math.sin((i + j) * 0.22 + time * 0.55) * 0.5
          );
          const norm = noise * 0.33 + 0.5; // 0..1

          // Density gate
          if (norm < 1 - patternDensity) continue;
          const baseAlpha = (norm - (1 - patternDensity)) / patternDensity;

          // ── Ripple contribution ──────────────────────────────────────
          let rippleBoost = 0;
          for (let r = 0; r < ripples.length; r++) {
            const rp   = ripples[r];
            const dx   = nx - rp.x;
            const dy   = ny - rp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const age  = (time - rp.born) * rp.speed * 3;
            const diff = Math.abs(dist - age);
            const thin = rippleThickness * 0.6;
            if (diff < thin) {
              const fade = Math.max(0, 1 - age / rp.maxR);
              rippleBoost = Math.max(rippleBoost, (1 - diff / thin) * fade);
            }
          }

          const alpha = Math.min(1, (baseAlpha * 0.45 + rippleBoost * 0.7) * edge);
          if (alpha < 0.008) continue;

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
          const ps = Math.max(1, pixelSize - 1);

          if (variant === 'circle') {
            ctx.beginPath();
            ctx.arc(px + ps / 2, py + ps / 2, ps / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(px, py, ps, ps);
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [variant, pixelSize, color, patternScale, patternDensity,
      enableRipples, rippleSpeed, rippleThickness, speed, edgeFade]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
