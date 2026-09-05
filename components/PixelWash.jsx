'use client';

import { useEffect, useRef } from 'react';

/**
 * Cheap animated pixel shimmer — a low-res canvas (a few thousand cells) scaled
 * up with `image-rendering: pixelated`, so it reads as chunky pixels for almost
 * no cost. Meant as the mobile stand-in for the WebGL PixelBlast in the hero and
 * behind the DevStudio card grid.
 *
 * Pauses on `prefers-reduced-motion`, when the tab is hidden, and when scrolled
 * out of view.
 */
export default function PixelWash({
  color = '#7C6FF7',
  cell = 6,          // on-screen size of one pixel, px
  density = 0.5,     // 0–1, share of cells that can be lit
  fps = 20,
  className,
  style,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rgb = hexToRgb(color);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0, rows = 0;
    let alpha, target;
    let raf = 0;
    let last = 0;
    let running = true;

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      cols = Math.max(8, Math.ceil(width / cell));
      rows = Math.max(8, Math.ceil(height / cell));
      canvas.width = cols;
      canvas.height = rows;
      alpha = new Float32Array(cols * rows);
      target = new Float32Array(cols * rows);
      draw(true);
    }

    function seedStatic() {
      for (let i = 0; i < alpha.length; i++) {
        alpha[i] = Math.random() < 0.06 * density ? Math.random() * 0.5 : 0;
      }
    }

    function step() {
      if (!alpha) return;
      // nudge a handful of random cells up
      const lit = Math.max(1, Math.round(cols * rows * 0.012 * density));
      for (let n = 0; n < lit; n++) {
        const i = (Math.random() * alpha.length) | 0;
        target[i] = 0.25 + Math.random() * 0.55;
      }
      for (let i = 0; i < alpha.length; i++) {
        // ease toward target, then bleed target back to 0
        alpha[i] += (target[i] - alpha[i]) * 0.14;
        target[i] *= 0.92;
        if (alpha[i] < 0.003) alpha[i] = 0;
      }
    }

    function draw(clearOnly) {
      if (!alpha) return;
      ctx.clearRect(0, 0, cols, rows);
      if (clearOnly && reduced) { seedStatic(); }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = alpha[y * cols + x];
          if (a <= 0) continue;
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a.toFixed(3)})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    function loop(t) {
      if (!running) { raf = 0; return; }   // fully stop; restarted by IO / visibility
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / fps) return;
      last = t;
      step();
      draw(false);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; }

    resize();

    if (reduced) {
      seedStatic();
      draw(true);
      return () => {};
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let onScreen = true;
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !document.hidden) start(); else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => { if (!document.hidden && onScreen) start(); else stop(); };
    document.addEventListener('visibilitychange', onVis);

    running = false;
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [color, cell, density, fps]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
