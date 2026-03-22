'use client';

// StarBorder — travelling sparkle that orbits the element's border.
//
// Props:
//   as        — outer element tag ('span' default, 'div' for block contexts)
//   color     — sparkle color
//   speed     — animation duration in seconds (number) or CSS value (string)
//   thickness — border thickness in px (controls padding behind the conic gradient)
//   ...rest   — any other props (onClick, className, style, etc.) are forwarded
//
// When `as="div"`, all internal wrapper elements also become divs so the
// HTML remains valid (block elements can't be children of <span>).
export default function StarBorder({
  as: Outer = 'span',
  children,
  color = '#7C6FF7',
  speed = 6,
  thickness = 1,
  className = '',
  style = {},
  ...rest
}) {
  const isBlock = Outer === 'div' || Outer === 'section' || Outer === 'article';
  const Inner = isBlock ? 'div' : 'span';
  const duration = typeof speed === 'number' ? `${speed}s` : speed;

  return (
    <Outer
      className={`star-border-outer ${className}`}
      style={{
        position: 'relative',
        display: isBlock ? 'block' : 'inline-block',
        padding: `${thickness}px`,
        borderRadius: 'inherit',
        ...style,
      }}
      {...rest}
    >
      {/* Spinning conic gradient — the travelling sparkle */}
      <Inner
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
          animation: `star-border-spin ${duration} linear infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content sits above the gradient */}
      <Inner style={{ position: 'relative', zIndex: 1, display: isBlock ? 'block' : 'inherit' }}>
        {children}
      </Inner>

      <style>{`
        @keyframes star-border-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </Outer>
  );
}
