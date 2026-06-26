/**
 * QuizResults — renders the treatment recommendations from the API.
 *
 * Card spec (from plan):
 *   - bg-lumen-dark
 *   - 3px gold top border (visible on hover)
 *   - name in Cormorant italic 28px text-lumen-offwhite
 *   - tagline in DM Sans 300 italic
 *   - description in DM Sans 300 16px muted
 *   - "why" highlighted in bg-lumen-black with 1px border-lumen-border
 *   - timeline badge pill (gold text)
 *   - price in Cormorant italic gold
 *   - Stagger fade-in via Framer Motion delay: index * 0.3
 *
 * Below the cards: a "Book a Consultation to Discuss These Treatments →" CTA
 * linking to /book.
 */

"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface Treatment {
  name: string;
  tagline: string;
  description: string;
  why: string;
  timeline: string;
  priceFrom: string;
}

export interface QuizResultsProps {
  treatments: Treatment[];
}

export function QuizResults({ treatments }: QuizResultsProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="w-full max-w-3xl mx-auto px-6"
    >
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-wider text-lumen-muted mb-4">
          Your personalised recommendations
        </p>
        <h2 className="font-display italic text-3xl md:text-4xl text-lumen-black leading-tight">
          Three treatments, calibrated for you.
        </h2>
      </div>

      <ul className="flex flex-col gap-6 mb-16">
        {treatments.map((t, i) => (
          <motion.li
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.3 }}
            className={cn(
              "group relative bg-lumen-dark p-8 md:p-10",
              "border border-lumen-border",
              "transition-all duration-500",
              "hover:border-lumen-gold hover:shadow-[0_0_24px_rgba(184,151,74,0.12)]",
            )}
          >
            {/* Gold top border accent — visible on hover. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 left-0 right-0 h-[3px] bg-lumen-gold",
                "origin-top scale-y-0 group-hover:scale-y-100",
                "transition-transform duration-500",
              )}
            />

            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h3 className="font-display italic text-2xl md:text-[28px] text-lumen-offwhite">
                {t.name}
              </h3>
              <span className="font-display italic text-lg md:text-xl text-lumen-gold shrink-0">
                {t.priceFrom}
              </span>
            </div>

            <p className="font-body italic font-light text-base text-lumen-muted mb-6">
              {t.tagline}
            </p>

            <p className="font-body text-base font-light leading-relaxed text-lumen-offwhite mb-6">
              {t.description}
            </p>

            <div className="border border-lumen-border bg-lumen-black/60 p-5 mb-6">
              <p className="text-xs uppercase tracking-wider text-lumen-gold mb-2">
                Why this suits you
              </p>
              <p className="font-body text-sm font-light leading-relaxed text-lumen-offwhite">
                {t.why}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-3 py-1",
                  "border border-lumen-gold/60 rounded-full",
                  "text-xs uppercase tracking-wider text-lumen-gold",
                  "font-body",
                )}
              >
                {t.timeline}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="text-center pb-12">
        <a
          href="/book"
          className={cn(
            "inline-flex items-center min-h-[52px] px-8 py-3",
            "bg-lumen-gold text-white",
            "font-body text-sm uppercase tracking-wider",
            "transition-all duration-500",
            "hover:bg-lumen-dark hover:text-lumen-gold hover:border hover:border-lumen-gold",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
          )}
        >
          Book a Consultation to Discuss These Treatments →
        </a>
      </div>
    </motion.div>
  );
}