'use client';

import Hero from '@/components/sections/Hero';
import Identity from '@/components/sections/Identity';
import DevStudio from '@/components/sections/DevStudio';
import Research from '@/components/sections/Research';
import Darkroom from '@/components/sections/Darkroom';
import CandidMe from '@/components/sections/CandidMe';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Identity />
      <DevStudio />
      <Research />
      <Darkroom />
      <CandidMe />
      <Contact />
    </>
  );
}
