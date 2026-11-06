// A fixed layer behind a project's page, for surfaces a flat colour can't give:
// falling snow for Glacier, window sunlight on Clue, a brushed paint finish and her cover calligraphy on Arabia, and the red
// paint ground of her own slides on Identity Breakdown. Arabia's calligraphy is darker than the page,
// so text over it only gains contrast.

/** Light and dark brush marks in equal measure, so the colour underneath stays the same on average. */
const paint = (seed: number) => {
  const marks = (id: string, value: number, frequency: string, gain: number, offset: number) =>
    `<filter id='${id}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${value} 0 0 0 0 ${value} 0 0 0 0 ${value} ${gain} 0 0 0 ${offset}'/></filter><rect width='100%' height='100%' filter='url(#${id})'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='1400'>${marks('l', 1, '0.009 0.03', 1.2, -0.6)}${marks('d', 0, '0.009 0.03', -1.2, 0.6)}${marks('m', 0, '0.0022 0.0034', -1.4, 0.7)}${marks('n', 1, '0.0022 0.0034', 1.4, -0.7)}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const FLAKES = 70;

function Snow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {Array.from({ length: FLAKES }, (_, i) => {
        const size = 1.5 + (i % 4) * 0.8;
        const duration = 16 + ((i * 7) % 18);
        return (
          <span
            key={i}
            className="absolute -top-2 block rounded-full bg-white motion-reduce:[animation:none] motion-reduce:[transform:translateY(var(--rest))]"
            style={
              {
                left: `${(i * 37) % 100}%`,
                width: size,
                height: size,
                opacity: 0.18 + (i % 5) * 0.09,
                animation: `snow-fall ${duration}s linear ${-((i * 2.3) % duration)}s infinite`,
                '--rest': `${(i * 53) % 100}vh`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export function PageFinish({ slug }: { slug: string }) {
  if (slug === 'glacier') return <Snow />;
  if (slug === 'clue-styling') {
    // Hard afternoon sun through a window, as on her shoot: one light across the hero and everything after it.
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: 'repeating-linear-gradient(115deg, transparent 0 170px, rgb(90 60 30 / 0.07) 170px 300px)' }}
      />
    );
  }
  if (slug === 'arabia') {
    return (
      <>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-25" style={{ backgroundImage: paint(11), backgroundSize: '1400px 1400px' }} />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[url(/media/arabia/cutout/calligraphy.webp)] bg-[length:max(92vw,640px)_auto] bg-right-bottom bg-no-repeat opacity-60"
        />
      </>
    );
  }
  if (slug === 'identity-breakdown') {
    // A wash of the page red calms her glitter paint so small text stays comfortable on it.
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: 'linear-gradient(rgb(140 15 30 / 0.55), rgb(140 15 30 / 0.55)), url(/media/identity-breakdown/clean/paint-ground-1252.webp)',
          backgroundSize: 'auto, 1252px auto',
        }}
      />
    );
  }
  return null;
}
