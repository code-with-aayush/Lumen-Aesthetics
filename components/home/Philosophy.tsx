/**
 * Philosophy — full-width brand belief statement (PRD §5.1).
 *
 * Dark editorial image spans the full viewport width with a text
 * overlay on the left third. Headline "Medicine first. Aesthetics
 * second." in Cormorant italic. Three-line philosophy below. No CTA —
 * this is a pure brand belief statement.
 *
 * Image is an inline PNG (C5 swap target). A dark gradient
 * overlay on the left third ensures the text stays legible regardless
 * of the image content behind it.
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const EASE = [0.16, 1, 0.3, 1] as const;

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
            src="/images/philosophy-interior.png"
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
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl lg:text-6xl"
                >
                  Medicine first.
                  <br />
                  Aesthetics second.
                </motion.h2>
                <motion.ul
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.3,
                      },
                    },
                  }}
                  className="mt-8 space-y-3 font-body text-base font-light leading-relaxed text-lumen-offwhite/80 md:text-lg"
                >
                  {PHILOSOPHY_LINES.map((line) => (
                    <motion.li
                      key={line}
                      variants={{
                        hidden: { opacity: 0, x: -15 },
                        show: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {line}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
