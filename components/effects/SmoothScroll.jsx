'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

// Lenis wraps native scroll with a lerp-based smooth feel.
// We drive it manually via rAF so it integrates cleanly with
// any GSAP/framer ScrollTrigger work added later.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      lerp: 0.1,
    });

    // Expose instance so modals can pause scroll without prop drilling
    window.__lenis = lenis;

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;
}
