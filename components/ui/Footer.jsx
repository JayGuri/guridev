export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 24px',
        background: 'var(--bg-base)',
      }}
    >
      <div
        className="footer-row"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
          }}
        >
          Jay Guri &middot; Mumbai &middot; 2025
        </p>

        <a
          href="#hero"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-dev)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '18px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          JG
        </a>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            fontStyle: 'italic',
          }}
        >
          Built with Next.js, Three.js, and too much chai.
        </p>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '24px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
          }}
        >
          All photography &copy; Jay Guri. All rights reserved.
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-row {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
