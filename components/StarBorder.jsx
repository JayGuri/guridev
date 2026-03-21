'use client';

// StarBorder — animates a glowing star/sparkle that orbits the element's border.
// Usage: <StarBorder color="#7C6FF7" speed={6}>{children}</StarBorder>
export default function StarBorder({
  children,
  color = '#7C6FF7',
  speed = 6,
  className = '',
  style = {},
}) {
  return (
    <span
      className={`star-border-outer ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '1px',
        borderRadius: 'inherit',
        ...style,
      }}
    >
      {/* Spinning conic gradient creates the travelling sparkle */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 80%,
            ${color}33 88%,
            ${color}CC 94%,
            #ffffff 96%,
            ${color}CC 98%,
            transparent 100%
          )`,
          animation: `star-border-spin ${speed}s linear infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Content sits above the spinning gradient */}
      <span style={{ position: 'relative', zIndex: 1, display: 'inherit' }}>
        {children}
      </span>

      <style>{`
        @keyframes star-border-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}
