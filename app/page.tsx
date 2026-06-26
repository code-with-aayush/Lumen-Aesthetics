// Minimal landing page — Task A1. Full homepage assembled in B2–B4.
export default function Home() {
  return (
    <main className="min-h-screen bg-lumen-black text-lumen-offwhite">
      <div className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center px-6 py-24">
        <p className="mb-6 font-body text-xs uppercase tracking-wider text-lumen-muted">
          Lumen Aesthetics
        </p>
        <h1 className="mb-8 text-center font-display text-5xl font-light italic text-lumen-offwhite md:text-7xl">
          Where Science Meets Artistry.
        </h1>
        <p className="max-w-xl text-center font-body text-base font-light leading-relaxed text-lumen-muted">
          Scaffold ready. The site is coming together — this is a blank canvas
          for the AI treatment quiz, the treatment showcase, and the rest of the
          brand experience.
        </p>
        {/* Token smoke test — visible gold dot proves Tailwind lumen-* config is wired up. */}
        <div
          aria-hidden
          className="mt-12 h-2 w-2 rounded-full bg-lumen-gold"
        />
      </div>
    </main>
  );
}
