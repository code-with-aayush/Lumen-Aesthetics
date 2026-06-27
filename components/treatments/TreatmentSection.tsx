/**
 * TreatmentSection — full-width editorial section for /treatments (PRD §5.2).
 *
 * Per-section layout: 60/40 split. Large editorial image on one side,
 * treatment info on the other. `reversed` flips the layout so the image
 * alternates left/right across the page for visual rhythm. On mobile the
 * columns stack to single column (image above text).
 *
 * Each section carries alternating backgrounds: index 0 = #0A0A0A,
 * index 1 = #141414, etc. The section itself is a plain <section>; the
 * scroll fade-up animation is delegated to SectionWrapper, which handles
 * the 700ms / [0.16, 1, 0.3, 1] ease per PRD §2.3.
 *
 * Hover behavior: the treatment info card has a 1px lumen-border edge that
 * brightens to lumen-gold with a soft glow on hover. NO movement, NO
 * scale, NO bouncy springs (PRD §2.3).
 *
 * Server component — no client-side state needed. All transitions are CSS
 * only, and the scroll-triggered fade is on the parent SectionWrapper.
 */

import Image from "next/image";

import { Button } from "@/components/shared/Button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export type Treatment = {
  slug: string;
  name: string;
  description: string;
  whoFor: string;
  whatToExpect: string;
  timeline: string;
  priceFrom: string;
  image: string;
};

type Props = {
  treatment: Treatment;
  /** When true, the image sits on the right and text on the left. */
  reversed?: boolean;
  /** 0 = lumen-black, 1 = lumen-dark, alternates. */
  index: number;
};

export function TreatmentSection({
  treatment,
  reversed = false,
  index,
}: Props): JSX.Element {
  // Alternating backgrounds — locked in PRD §5.2.
  const backgroundClass =
    index % 2 === 0 ? "bg-lumen-black" : "bg-lumen-dark";

  return (
    <SectionWrapper className={backgroundClass}>
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <div
          className={cn(
            "grid grid-cols-1 gap-10 md:grid-cols-[60fr_40fr] md:gap-16 md:items-center",
            reversed && "md:[&>div:first-child]:order-2",
          )}
        >
          {/* Image — 60% on desktop, full-width on mobile (always first). */}
          <div className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[4/5]">
            <Image
              src={treatment.image}
              alt={`${treatment.name} treatment editorial`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          {/* Text — 40% on desktop. */}
          <div className="group relative border border-lumen-border bg-lumen-black/40 p-8 transition-all duration-500 hover:border-lumen-gold hover:shadow-[0_0_20px_rgba(184,151,74,0.15)] md:p-10">
            {/* Gold top border accent — mirrors the treatments preview cards. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] bg-lumen-gold/40 transition-colors duration-500 group-hover:bg-lumen-gold"
            />

            {/* Treatment name */}
            <h2 className="mt-2 font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              {treatment.name}
            </h2>

            {/* Clinical description */}
            <p className="mt-6 font-body text-base font-light leading-relaxed text-lumen-offwhite/85 md:text-lg">
              {treatment.description}
            </p>

            {/* Detail fields */}
            <dl className="mt-8 space-y-5">
              <DetailRow label="Who it&apos;s for" value={treatment.whoFor} />
              <DetailRow
                label="What to expect"
                value={treatment.whatToExpect}
              />
              <DetailRow label="Results timeline" value={treatment.timeline} />
            </dl>

            {/* Footer: price + CTA */}
            <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-lumen-border pt-8 sm:flex-row sm:items-center">
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-lumen-muted">
                  Starting at
                </p>
                <p className="mt-1 font-display text-2xl italic text-lumen-gold">
                  {treatment.priceFrom}
                </p>
              </div>
              <Button
                href={`/book?treatment=${treatment.slug}`}
                variant="outline"
              >
                Book This Treatment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div>
      <dt className="font-body text-[10px] uppercase tracking-widest text-lumen-muted">
        {label}
      </dt>
      <dd className="mt-1.5 font-body text-sm font-light leading-relaxed text-lumen-offwhite/80">
        {value}
      </dd>
    </div>
  );
}

// Local cn — keeps this component self-contained. Same shape as
// lib/cn.ts; we don't import it to keep the import surface tight.
function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter((v): v is string => Boolean(v)).join(" ");
}