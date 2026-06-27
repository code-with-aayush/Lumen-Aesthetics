/**
 * Testimonials — 3 minimal cards + press logos band (PRD §5.1).
 *
 * Per PRD: dark section, 3 testimonials in a row. No avatar circles — just
 * a large Cormorant italic initial in gold as the visual anchor. Quote in
 * DM Sans 300 italic, name + location in DM Sans uppercase tiny muted.
 * Below the cards: a press logos band ("As trusted by patients featured
 * in" → Vogue, Harper's Bazaar, New York Magazine) in muted gray.
 *
 * Stack to single column on mobile, 3-col on desktop.
 *
 * PRD §8.3 doesn't ship final testimonial copy; the quotes below are
 * written in the same restrained, clinical-but-warm voice as the rest
 * of the site copy.
 */

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const TESTIMONIALS = [
  {
    initial: "C",
    quote:
      "I came in looking rested. I left looking like myself on my best day. That's the difference.",
    name: "Camille R.",
    location: "Upper East Side",
  },
  {
    initial: "A",
    quote:
      "No one has ever asked me this many questions before treating me. The result felt designed for me — because it was.",
    name: "Adrienne L.",
    location: "Brooklyn Heights",
  },
  {
    initial: "S",
    quote:
      "After three years of trying other studios, Lumen is the only place I'd trust my face. Quietly the best in the city.",
    name: "Sophia M.",
    location: "Tribeca",
  },
] as const;

const PRESS = ["Vogue", "Harper's Bazaar", "New York Magazine"] as const;

export function Testimonials(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-dark">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <h2 className="mb-16 text-center font-display text-4xl font-light italic text-lumen-offwhite md:text-5xl">
          In their words.
        </h2>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {TESTIMONIALS.map((t) => (
            <li
              key={t.name}
              className="flex flex-col items-start border border-lumen-border/40 bg-gradient-to-b from-lumen-dark/60 to-lumen-black/80 p-8 transition-all duration-500 hover:border-lumen-gold/30 hover:shadow-[0_0_25px_rgba(184,151,74,0.08)]"
            >
              <span
                aria-hidden
                className="mb-4 font-display text-7xl italic text-lumen-gold"
              >
                {t.initial}
              </span>
              <blockquote className="font-body text-base font-light italic leading-relaxed text-lumen-offwhite/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="mt-6 font-body text-[10px] uppercase tracking-widest text-lumen-muted">
                {t.name} · {t.location}
              </p>
            </li>
          ))}
        </ul>

        {/* Press logos band */}
        <div className="mt-20 border-t border-lumen-border pt-10 text-center">
          <p className="mb-6 font-body text-[10px] uppercase tracking-widest text-lumen-muted">
            As trusted by patients featured in
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PRESS.map((name) => (
              <li
                key={name}
                className="font-display text-xl italic text-lumen-muted/70"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}