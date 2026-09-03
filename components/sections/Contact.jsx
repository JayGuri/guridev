'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'A little more detail, please'),
});

const LINKS = [
  { Icon: Mail, href: 'mailto:jaymanishguri@gmail.com', label: 'jaymanishguri@gmail.com', sub: 'Email', external: false },
  { Icon: Linkedin, href: 'https://linkedin.com/in/jay-guri-223b16289', label: 'linkedin.com/in/jay-guri', sub: 'LinkedIn', external: true },
  { Icon: Github, href: 'https://github.com/jayguri', label: 'github.com/jayguri', sub: 'GitHub', external: true },
];

const INPUT_STYLE = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderLeft: '2px solid var(--border-subtle)',
  borderRadius: '10px',
  padding: '13px 14px',
  color: 'var(--text-primary)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const ERROR_STYLE = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '11px',
  color: '#E8535A',
  marginTop: '7px',
  letterSpacing: '0.02em',
};

export default function Contact() {
  const [submitState, setSubmitState] = useState('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) console.warn('EmailJS env vars missing');
  }, []);

  async function onSubmit(data) {
    setSubmitState('loading');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        { from_name: data.name, from_email: data.email, message: data.message },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  }

  const btnBg = submitState === 'success' ? '#2D7A4F' : submitState === 'error' ? '#7A2D2D' : 'var(--accent-dev)';
  const btnLabel =
    submitState === 'loading' ? 'Sending…'
    : submitState === 'success' ? 'Sent ✓'
    : submitState === 'error' ? 'Failed — email me directly'
    : 'Send message →';

  return (
    <section id="contact" style={{ background: 'var(--bg-base)', padding: '120px 24px', width: '100%' }}>
      <div className="contact-layout" style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.85fr 1fr', gap: '72px', alignItems: 'start' }}>

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--accent-dev)' }} />
            contact
          </p>

          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(32px, 4.6vw, 52px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 20px' }}>
            Let&apos;s build something worth talking about.
          </h2>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            A project, a research idea, or just to say hey — the inbox is open and I reply.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '7px 14px', marginBottom: '36px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3FB950', boxShadow: '0 0 6px #3FB950' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              open to internships &amp; collaborations &middot; Mumbai / remote
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {LINKS.map(({ Icon, href, label, sub, external }) => (
              <a key={label} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="contact-link"
                style={{ display: 'flex', alignItems: 'center', gap: '13px', textDecoration: 'none', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s ease, background 0.2s ease' }}>
                <span className="contact-link-ic" style={{ width: '32px', height: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{sub}</span>
                  <span className="contact-link-label" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px', transition: 'color 0.2s ease', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                </span>
                <ArrowUpRight size={15} strokeWidth={2} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          style={{ border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '28px', background: 'var(--bg-surface)' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '22px', letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--accent-dev)' }}>~/contact</span> &#10095; new message
          </p>

          <div style={{ marginBottom: '20px' }}>
            <input {...register('name')} placeholder="Your name" className="contact-input" style={INPUT_STYLE} />
            {errors.name && <p style={ERROR_STYLE}>! {errors.name.message}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input {...register('email')} placeholder="Your email" className="contact-input" style={INPUT_STYLE} />
            {errors.email && <p style={ERROR_STYLE}>! {errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <textarea {...register('message')} placeholder="What's on your mind?" rows={5} className="contact-input" style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '120px' }} />
            {errors.message && <p style={ERROR_STYLE}>! {errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitState === 'loading'}
            className="contact-submit"
            onMouseEnter={(e) => { if (submitState === 'idle') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(124,111,247,0.32)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            style={{
              width: '100%', background: btnBg, color: '#fff', padding: '15px',
              borderRadius: '10px', border: 'none',
              cursor: submitState === 'loading' ? 'wait' : 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500,
              transition: 'all 0.2s ease',
              animation: submitState === 'loading' ? 'contactPulse 1.2s ease-in-out infinite' : 'none',
            }}
          >
            {btnLabel}
          </button>
        </motion.form>
      </div>

      <style>{`
        @keyframes contactPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .contact-input:focus { border-color: var(--accent-dev) !important; border-left-color: var(--accent-dev) !important; }
        .contact-input::placeholder { color: var(--text-tertiary); }
        .contact-link:hover { border-color: var(--border-hover) !important; background: var(--bg-elevated); }
        .contact-link:hover .contact-link-label { color: var(--text-primary) !important; }
        .contact-link:hover .contact-link-ic { color: var(--accent-dev) !important; }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr !important; gap: 44px !important; }
        }
      `}</style>
    </section>
  );
}
