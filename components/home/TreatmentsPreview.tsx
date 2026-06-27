/**
 * TreatmentsPreview — 5-card grid showcasing the clinic menu.
 *
 * Per PRD §5.1: 5 treatment cards, horizontal scroll on mobile / 3-col grid
 * on desktop. Each card: dark bg (#141414), 3px gold top border, name in
 * Cormorant italic, one-line description in DM Sans muted, "From $X" price
 * in Cormorant italic gold, arrow link. Hover: border brightens, subtle
 * gold glow (box-shadow: 0 0 20px rgba(184,151,74,0.15)) — no movement,
 * no scale. Section headline "Precision. Artistry. Results." centered
 * above the grid. "View All Treatments →" link at the bottom.
 *
 * Prices and descriptions are stub copy; C1 expands each treatment into
 * a full-width section on /treatments with the real clinical copy.
 */

import Link from "next/link";

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const TREATMENTS = [
  {
    name: "Injectables",
    description: "Botox & dermal filler, calibrated to your anatomy.",
    priceFrom: "$650",
  },
  {
    name: "Laser Resurfacing",
    description: "Fractional laser for tone, texture, and luminosity.",
    priceFrom: "$1,200",
  },
  {
    name: "RF Microneedling",
    description: "Collagen induction with radiofrequency precision.",
    priceFrom: "$950",
  },
  {
    name: "Body Sculpting",
    description: "Non-invasive contouring for stubborn areas.",
    priceFrom: "$1,500",
  },
  {
    name: "Skin Optimisation",
    description: "Medical-grade facials, peels, and at-home protocols.",
    priceFrom: "$350",
  },
] as const;

export function TreatmentsPreview(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-black">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <h2 className="mb-16 text-center font-display text-4xl font-light italic text-lumen-offwhite md:text-5xl">
          Precision. Artistry. Results.
        </h2>

        {/* Mobile: horizontal scroll, no scrollbar. Desktop: 3-col grid. */}
        <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* On desktop, the 4th and 5th cards sit in row 2 of the 3-col grid. */}
          {TREATMENTS.map((t) => (
            <li
              key={t.name}
              className="group relative flex w-[80vw] shrink-0 snap-start flex-col border-t-[3px] border-lumen-gold/40 bg-lumen-dark p-8 transition-all duration-500 hover:border-lumen-gold hover:shadow-[0_0_20px_rgba(184,151,74,0.15)] md:w-auto"
            >
              <h3 className="font-display text-2xl italic text-lumen-offwhite">
                {t.name}
              </h3>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-lumen-muted">
                {t.description}
              </p>
              <div className="mt-6 flex items-end justify-between">
                <span className="font-display text-lg italic text-lumen-gold">
                  From {t.priceFrom}
                </span>
                <span
                  aria-hidden
                  className="font-body text-sm text-lumen-offwhite/60 transition-all duration-500 group-hover:translate-x-1 group-hover:text-lumen-gold"
                >
                  →
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href="/treatments"
            className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
          >
            View All Treatments
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
