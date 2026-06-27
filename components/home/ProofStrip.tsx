/**
 * ProofStrip — 5-stat credibility band directly under the hero.
 *
 * Per PRD §5.1: dark section (#141414) full width, 5 stats in a row.
 * Numbers in Cormorant Garamond italic gold, labels in DM Sans uppercase
 * tiny gray. Stacks to a single column on mobile, becomes 5-up on md+.
 *
 * Numbers are presented as plain text (not animated count-up) — luxury
 * restraint says a counter ticking from 0→1200 would feel like a SaaS
 * landing page, not a medical studio. The values are credible, not
 * impressive, and the typography does the work.
 */

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const STATS = [
  { value: "1,200+", label: "Patients" },
  { value: "4.97", label: "Google Rating" },
  { value: "12", label: "Treatments Offered" },
  { value: "Featured in", label: "Vogue" },
  { value: "Est. 2018", label: "" },
] as const;

export function ProofStrip(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-dark">
      <div className="mx-auto max-w-content px-6 py-16 md:py-20">
        <ul className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-5 md:gap-y-0">
          {STATS.map((stat) => (
            <li
              key={stat.label || stat.value}
              className="flex flex-col items-center text-center"
            >
              <span className="font-display text-3xl italic text-lumen-gold md:text-4xl">
                {stat.value}
              </span>
              {stat.label ? (
                <span className="mt-2 font-body text-[10px] uppercase tracking-widest text-lumen-muted md:text-xs">
                  {stat.label}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
