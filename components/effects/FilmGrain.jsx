const GRAIN_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23noise)' opacity='1'/></svg>`
)}`;

export default function FilmGrain() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        opacity: 0.04,
        mixBlendMode: 'overlay',
        backgroundImage: `url("${GRAIN_SVG}")`,
        backgroundSize: '200px 200px',
      }}
    />
  );
}
