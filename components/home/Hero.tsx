/**
 * Hero — homepage above-the-fold section (PRD §5.1).
 *
 * Layout: full-viewport-height split — left 55% holds the headline, subhead,
 * and two CTAs. Right 45% holds a tall (3:4 aspect) editorial portrait
 * inset inside a thin gold frame.
 *
 * Animation: the headline animates word-by-word on first paint
 * (translateY 20px → 0, opacity 0 → 1, stagger 0.08s, ease [0.16, 1, 0.3, 1]).
 * Subhead, CTAs, and image fade in together after the headline finishes.
 * The "5.0 ★ · 1,200+ Patients" badge drifts in last for a layered reveal.
 *
 * Bottom of the hero carries a 1px gold divider (30% opacity) and the
 * repeating ticker ("EST. 2018 ✦ UPPER EAST SIDE ✦ BY APPOINTMENT ✦
 * MEDICALLY DIRECTED ✦") that scrolls at a 40s reading pace.
 *
 * Server-renderable: the headline word animation is a client boundary
 * inside this component; the surrounding markup and image are SSR-friendly.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/shared/Button";
import { Ticker } from "@/components/shared/Ticker";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE_WORDS = ["Where", "Science", "Meets", "Artistry."] as const;

const TICKER_CONTENT =
  "EST. 2018 ✦ UPPER EAST SIDE ✦ BY APPOINTMENT ✦ MEDICALLY DIRECTED ✦";

export function Hero(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  // For users who prefer reduced motion: skip the staggered reveal and
  // show the headline in its final state immediately. The ticker still
  // scrolls because that's a continuous loop, not an entrance.
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen bg-lumen-black pt-24 md:pt-20">
      {/* Main split: 55% text, 45% image. Stacks on mobile. */}
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-6 pb-16 md:min-h-[calc(100vh-5rem)] md:grid-cols-[55fr_45fr] md:items-center md:gap-16 md:pb-24">
        {/* Left: text block */}
        <div className="flex flex-col justify-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold"
          >
            Medical Aesthetics · New York
          </motion.p>

          {/* Headline — word-by-word staggered reveal. */}
          <h1 className="font-display text-5xl font-light italic leading-[1.05] text-lumen-offwhite sm:text-6xl md:text-7xl lg:text-[88px]">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block pr-[0.3em]"
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                variants={wordVariants}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: 0.2 + i * 0.08,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subhead — fades in after the headline finishes. */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="mt-8 max-w-lg font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg"
          >
            New York&apos;s most discreet medical aesthetics studio. Results
            that speak for themselves.
          </motion.p>

          {/* CTAs — primary outline button + secondary text link. */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
            className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
          >
            <Button href="/book" variant="outline">
              Begin Your Consultation
            </Button>
            <Link
              href="/treatments"
              className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
            >
              Discover Treatments
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Right: gold-framed editorial portrait. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="relative mx-auto w-full max-w-md md:max-w-none"
        >
          {/* Gold frame — 2px solid gold, slight inset from the photo. */}
          <div className="relative aspect-[3/4] w-full border-2 border-lumen-gold p-3">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src="/images/hero-portrait.svg"
                alt="Editorial portrait"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating credibility badge — positioned over the image. */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.3 }}
            className="absolute -left-4 bottom-8 border border-lumen-gold bg-lumen-black/90 px-5 py-3 backdrop-blur-sm md:-left-8 md:bottom-12"
          >
            <p className="font-body text-xs uppercase tracking-wider text-lumen-offwhite">
              <span className="font-display text-base italic text-lumen-gold">
                5.0
              </span>{" "}
              ★ · 1,200+ Patients
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom band: gold divider + scrolling ticker. Sits at the bottom
          of the hero section regardless of viewport height. */}
      <div className="border-t border-lumen-gold/30">
        <Ticker content={TICKER_CONTENT} speed={40} />
      </div>
    </section>
  );
}
