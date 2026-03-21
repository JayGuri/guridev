import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/effects/SmoothScroll';
import LoadingScreen from '@/components/effects/LoadingScreen';
import TerminalNav from '@/components/ui/TerminalNav';
import CustomCursor from '@/components/effects/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jay Guri — Developer, Researcher, Photographer',
  description:
    'Engineering student at DJ Sanghvi, Mumbai. Building AI/ML systems at IIT Bombay, shipping real products, and photographing stories the eye misses.',
  keywords: ['Jay Guri', 'developer', 'Mumbai', 'IIT Bombay', 'photographer', 'AI ML'],
  authors: [{ name: 'Jay Guri' }],
  openGraph: {
    title: 'Jay Guri — Developer, Researcher, Photographer',
    description:
      'Engineering student building AI/ML systems and photographing Mumbai.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <LoadingScreen />
        <SmoothScroll />
        <TerminalNav />
        <CustomCursor />
        <main style={{ paddingTop: '156px' }} className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
