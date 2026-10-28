/** Loading mark: a spool of rust thread with a running stitch pulling off it. */
export function Spool({ label = 'Threading the needle' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3">
      <svg width="120" height="48" viewBox="0 0 120 48" aria-hidden className="text-thread">
        {/* Spool: two wooden flanges and the wound thread between them */}
        <rect x="6" y="6" width="6" height="36" rx="2" fill="#6b3a2a" />
        <rect x="36" y="6" width="6" height="36" rx="2" fill="#6b3a2a" />
        <rect x="12" y="10" width="24" height="28" fill="currentColor" />
        {[14, 18, 22, 26, 30, 34].map((y) => (
          <line key={y} x1="12" x2="36" y1={y} y2={y} stroke="#7d3a20" strokeWidth="1" opacity="0.5" />
        ))}
        {/* The thread running off the spool, sewn in as it goes */}
        <path
          d="M36 24 C 52 24, 56 34, 70 32 S 96 18, 116 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="6 5"
          className="animate-[thread-run_0.9s_linear_infinite]"
        />
      </svg>
      <p className="label text-ink-soft">{label}</p>
    </div>
  );
}
