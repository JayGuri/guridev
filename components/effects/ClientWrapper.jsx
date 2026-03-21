'use client';

import { useState, useEffect } from 'react';
import ClickSpark from '@/components/ClickSpark';
import LoadingScreen from '@/components/effects/LoadingScreen';
import SmoothScroll from '@/components/effects/SmoothScroll';
import TerminalNav from '@/components/ui/TerminalNav';

// Tracks scroll position to swap ClickSpark color when the #photography section
// is centred in the viewport — orange to match the Darkroom / photographer palette.
export default function ClientWrapper({ children }) {
  const [sparkColor, setSparkColor] = useState('#7C6FF7');

  useEffect(() => {
    const check = () => {
      const el = document.getElementById('photography');
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const inView = top < mid && bottom > mid;
      setSparkColor(inView ? '#E8935A' : '#7C6FF7');
    };

    // passive scroll listener — zero-cost
    window.addEventListener('scroll', check, { passive: true });
    check(); // run once on mount in case already scrolled
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={8}
      sparkRadius={18}
      sparkCount={8}
      duration={400}
    >
      <LoadingScreen />
      <SmoothScroll />
      <TerminalNav />
      <main style={{ paddingTop: '112px' }}>
        {children}
      </main>
    </ClickSpark>
  );
}
