'use client';

import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const NAV = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Research', '#research'],
  ['Photography', '#photography'],
  ['Contact', '#contact'],
];

const SOCIAL = [
  { Icon: Mail, href: 'mailto:jaymanishguri@gmail.com', label: 'Email' },
  { Icon: Linkedin, href: 'https://linkedin.com/in/jay-guri-223b16289', label: 'LinkedIn' },
  { Icon: Github, href: 'https://github.com/jayguri', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)', padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'flex-start' }}>
          {/* Mark + line */}
          <div>
            <a href="#hero" className="footer-mark" style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '40px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'flex-end', gap: '3px' }}>
              JG<span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)', marginBottom: '7px' }} />
            </a>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', marginTop: '14px', maxWidth: '320px' }}>
              Developer, researcher and photographer in Mumbai. Currently at DJ Sanghvi and IIT Bombay,
              and open to work worth doing.
            </p>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="footer-link"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider + bottom row */}
        <div style={{ marginTop: '44px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            &copy; 2026 Jay Guri &middot; Mumbai &middot; built with Next.js, Three.js and stubborn late nights
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {SOCIAL.map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                className="footer-social"
                style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', transition: 'color 0.2s ease, border-color 0.2s ease, transform 0.2s ease' }}>
                <Icon size={15} strokeWidth={2} />
              </a>
            ))}
            <a href="#hero" aria-label="Back to top" className="footer-social"
              style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', marginLeft: '4px', transition: 'color 0.2s ease, border-color 0.2s ease, transform 0.2s ease' }}>
              <ArrowUp size={15} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--text-primary) !important; }
        .footer-social:hover { color: var(--accent-dev) !important; border-color: var(--accent-dev) !important; transform: translateY(-2px); }
        .footer-mark:hover span { background: var(--accent-photo) !important; }
        @media (max-width: 639px) {
          .footer-top { grid-template-columns: 1fr !important; }
          .footer-top nav { align-items: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
