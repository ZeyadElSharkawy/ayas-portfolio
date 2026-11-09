// The hero's ground, after the grid-and-glow background snippets, in her colours and without the
// grid: a violet glow from the top right, a deeper purple rising from the edges and magenta behind
// her portrait, all settling back to the page's aubergine at the bottom so the hero meets the page
// without an edge. Pure CSS, no dependencies.

export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#200E27]">
      <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,#200E27_45%,#5B2A9A_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgb(160_110_235/0.32),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_52%_42%,rgb(120_30_110/0.35),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#200E27]" />
    </div>
  );
}
