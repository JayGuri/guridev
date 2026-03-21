import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/effects/SmoothScroll';
import LoadingScreen from '@/components/effects/LoadingScreen';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jay Guri — Developer, Researcher, Photographer',
  description:
    'Engineering student at DJ Sanghvi, Mumbai. Building AI/ML systems at IIT Bombay, shipping real products, and photographing stories the eye misses.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <LoadingScreen />
        <SmoothScroll />
        <main>{children}</main>
      </body>
    </html>
  );
}
