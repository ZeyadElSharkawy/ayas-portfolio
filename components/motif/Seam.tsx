// A stitched seam: a running-stitch line, optionally with cross-stitches at the ends.
// `animate` stitches it in from left to right when it mounts.

export function Seam({
  className = '',
  ends = false,
  animate = false,
}: {
  className?: string;
  ends?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={`relative flex items-center text-thread ${className}`} aria-hidden>
      {ends && <Cross />}
      <div className={`stitch flex-1 ${animate ? 'animate-[stitch-in_1.2s_var(--ease-thread)_both]' : ''}`} />
      {ends && <Cross />}
    </div>
  );
}

function Cross() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="mx-1.5 shrink-0">
      <path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
