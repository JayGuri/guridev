'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message too short'),
});

const LINKS = [
  { href: 'mailto:jaymanishguri@gmail.com', label: 'jaymanishguri@gmail.com', external: false },
  { href: 'https://linkedin.com/in/jay-guri-223b16289', label: 'linkedin.com/in/jay-guri', external: true },
  { href: 'https://github.com/jayguri', label: 'github.com/jayguri', external: true },
];

const INPUT_STYLE = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border-subtle)',
  borderRadius: 0,
  padding: '12px 0',
  color: 'var(--text-primary)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const ERROR_STYLE = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  color: '#E8535A',
  marginTop: '6px',
};

function ContactLink({ href, label, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="contact-link"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        padding: '4px 0',
        position: 'relative',
        width: 'fit-content',
      }}
    >
      <span
        className="contact-link-arrow"
        style={{
          color: 'var(--accent-dev)',
          transition: 'transform 0.2s ease',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        &rarr;
      </span>
      <span
        className="contact-link-text"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'var(--text-secondary)',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </span>
      <span className="contact-link-underline" />
    </a>
  );
}

export default function Contact() {
  const [submitState, setSubmitState] = useState('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
      console.warn('EmailJS env vars missing');
    }
  }, []);

  async function onSubmit(data) {
    setSubmitState('loading');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  }

  const btnBg =
    submitState === 'success'
      ? '#2D7A4F'
      : submitState === 'error'
        ? '#7A2D2D'
        : 'var(--accent-dev)';

  const btnLabel =
    submitState === 'loading'
      ? 'Sending...'
      : submitState === 'success'
        ? 'Sent \u2713'
        : submitState === 'error'
          ? 'Failed. Email me directly.'
          : 'Send message \u2192';

  return (
    <section
      id="contact"
      style={{
        background: 'var(--bg-base)',
        padding: '120px 24px',
        width: '100%',
      }}
    >
      <div
        className="contact-layout"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-dev)',
            }}
          >
            · contact ·
          </p>

          <h2
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '16px 0 0',
            }}
          >
            Let&apos;s build something worth talking about.
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              margin: '20px 0 48px',
            }}
          >
            Whether it&apos;s a project, a research idea, or just to say hey
            &mdash; my inbox is open.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {LINKS.map((link) => (
              <ContactLink key={link.label} {...link} />
            ))}
          </div>
        </motion.div>

        {/* Right column — form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }}
        >
          {/* Name */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <input
              {...register('name')}
              placeholder="Name"
              className="contact-input"
              style={INPUT_STYLE}
            />
            {errors.name && <p style={ERROR_STYLE}>{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <input
              {...register('email')}
              placeholder="Email"
              className="contact-input"
              style={INPUT_STYLE}
            />
            {errors.email && <p style={ERROR_STYLE}>{errors.email.message}</p>}
          </div>

          {/* Message */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <textarea
              {...register('message')}
              placeholder="Message"
              rows={5}
              className="contact-input"
              style={{ ...INPUT_STYLE, resize: 'vertical' }}
            />
            {errors.message && (
              <p style={ERROR_STYLE}>{errors.message.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitState === 'loading'}
            className="contact-submit"
            onMouseEnter={(e) => {
              if (submitState === 'idle') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(124,111,247,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            style={{
              width: '100%',
              marginTop: '8px',
              background: btnBg,
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              cursor: submitState === 'loading' ? 'wait' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              animation:
                submitState === 'loading'
                  ? 'contactPulse 1.2s ease-in-out infinite'
                  : 'none',
            }}
          >
            {btnLabel}
          </button>
        </motion.form>
      </div>

      <style>{`
        @keyframes contactPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .contact-input:focus {
          border-bottom-color: var(--accent-dev) !important;
        }
        .contact-input::placeholder {
          color: var(--text-tertiary);
        }

        .contact-link {
          position: relative;
        }
        .contact-link-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
          background: var(--accent-dev);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .contact-link:hover .contact-link-text {
          color: var(--text-primary) !important;
        }
        .contact-link:hover .contact-link-arrow {
          transform: translateX(4px);
        }
        .contact-link:hover .contact-link-underline {
          transform: scaleX(1);
        }

        @media (max-width: 1023px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
