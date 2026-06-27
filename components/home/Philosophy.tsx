/**
 * Philosophy — full-width brand belief statement (PRD §5.1).
 *
 * Dark editorial image spans the full viewport width with a text
 * overlay on the left third. Headline "Medicine first. Aesthetics
 * second." in Cormorant italic. Three-line philosophy below. No CTA —
 * this is a pure brand belief statement.
 *
 * Image is an inline SVG placeholder (C5 swap target). A dark gradient
 * overlay on the left third ensures the text stays legible regardless
 * of the image content behind it.
 */

import Image from "next/image";

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const PHILOSOPHY_LINES = [
  "Every treatment is clinically indicated.",
  "Every result is calibrated, not maximised.",
  "Every patient is seen by the same provider, every visit.",
] as const;

export function Philosophy(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-black">
      <div className="relative w-full overflow-hidden">
        {/* Image: full bleed, 21:9 cinematic aspect. */}
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/images/philosophy-interior.svg"
            alt="The Lumen Aesthetics treatment room"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark gradient overlay on the left third for text legibility.
              Sits between the image and the text content below. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-lumen-black via-lumen-black/70 to-transparent"
          />

          {/* Text content, left third */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-content px-6">
              <div className="max-w-md">
                <h2 className="font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl lg:text-6xl">
                  Medicine first.
                  <br />
                  Aesthetics second.
                </h2>
                <ul className="mt-8 space-y-3 font-body text-base font-light leading-relaxed text-lumen-offwhite/80 md:text-lg">
                  {PHILOSOPHY_LINES.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
