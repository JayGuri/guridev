'use client';

import { useState, useEffect } from 'react';
import ClickSpark from '@/components/ClickSpark';
import CustomCursor from '@/components/effects/CustomCursor';
import LoadingScreen from '@/components/effects/LoadingScreen';
import SmoothScroll from '@/components/effects/SmoothScroll';
import TerminalNav from '@/components/ui/TerminalNav';
import FloatingNav from '@/components/ui/FloatingNav';

// Tracks scroll position to swap ClickSpark color when the #photography section
// is centred in the viewport — orange to match the Darkroom / photographer palette.
// CustomCursor handles the visual cursor (dot + lagging ring + section-aware color).
// ClickSpark layers click burst animations on top without touching cursor styling.
export default function ClientWrapper({ children }) {
  const [sparkColor, setSparkColor] = useState('#7C6FF7');

  useEffect(() => {
    let raf = 0;
    const check = () => {
      const el = document.getElementById('photography');
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const inView = top < mid && bottom > mid;
      setSparkColor(inView ? '#E8935A' : '#7C6FF7');
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; check(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={8}
      sparkRadius={18}
      sparkCount={8}
      duration={400}
    >
      <CustomCursor />
      <LoadingScreen />
      <SmoothScroll />
      <TerminalNav />
      <FloatingNav />
      {/* .main-content picks up the terminal-open padding rule in globals.css;
          no static top padding — the hero owns the top of the page. */}
      <main className="main-content">
        {children}
      </main>
    </ClickSpark>
  );
}
