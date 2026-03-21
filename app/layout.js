import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/components/effects/ClientWrapper';

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
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
