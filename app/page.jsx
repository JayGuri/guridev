import Hero from '@/components/sections/Hero';
import DevStudio from '@/components/sections/DevStudio';
import Research from '@/components/sections/Research';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Extracurriculars from '@/components/sections/Extracurriculars';
import Darkroom from '@/components/sections/Darkroom';
import CandidMe from '@/components/sections/CandidMe';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <DevStudio />
      <Research />
      <Experience />
      <Skills />
      <Extracurriculars />
      <Darkroom />
      <CandidMe />
      <Contact />
      <Footer />
    </>
  );
}
