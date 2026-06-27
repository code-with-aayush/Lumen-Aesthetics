/**
 * QuizEntry — the "hero demo moment" (PRD §5.1).
 *
 * Per PRD: white background contrast break, left column with headline
 * "Not sure where to start?" in dark Cormorant italic + quiz explainer
 * + dark CTA button. Right column shows an animated preview of the quiz
 * UI (a fake question card with answer chips, subtle pulse to invite
 * interaction). Badge "Powered by AI · Results in 60 seconds" sits
 * above the headline.
 *
 * The preview is intentionally a static stylised mock of Q1 — the real
 * quiz lives at /quiz. The pulse animation runs forever on the primary
 * CTA to draw the eye without being aggressive.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/shared/Button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

const EASE = [0.16, 1, 0.3, 1] as const;

const MOCK_OPTIONS = [
  "Fine lines & wrinkles",
  "Volume loss",
  "Skin tone & texture",
  "Body contouring",
] as const;

export function QuizEntry(): JSX.Element {
  return (
    <SectionWrapper className="bg-white">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 md:gap-16 md:py-32">
        {/* Left: copy + CTA */}
        <div className="flex flex-col justify-center">
          <span className="mb-6 inline-flex w-fit items-center gap-2 border border-lumen-black/20 bg-lumen-black/[0.03] px-3 py-1.5 font-body text-[10px] uppercase tracking-widest text-lumen-black/70">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-lumen-gold"
            />
            Powered by AI · Results in 60 seconds
          </span>

          <h2 className="font-display text-4xl font-light italic leading-tight text-lumen-black md:text-5xl lg:text-6xl">
            Not sure where to start?
          </h2>

          <p className="mt-6 max-w-md font-body text-base font-light leading-relaxed text-lumen-black/70">
            Answer five questions. Our clinical AI recommends two to three
            treatments calibrated to your concerns, timeline, and aesthetic —
            in under a minute.
          </p>

          <div className="mt-8">
            <Button
              href="/quiz"
              variant="filled"
              className="!bg-lumen-black !text-lumen-offwhite hover:!bg-lumen-black/90"
            >
              Take the Skin Quiz
              <span aria-hidden className="ml-2">
                →
              </span>
            </Button>
          </div>
        </div>

        {/* Right: animated mock of the quiz question card */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="w-full max-w-md border border-lumen-gold/25 bg-lumen-black/95 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <p className="mb-2 font-body text-[10px] uppercase tracking-widest text-lumen-gold">
              Question 1 of 5
            </p>
            <h3 className="mb-6 font-display text-xl italic text-lumen-offwhite">
              What&apos;s your primary concern?
            </h3>

            <ul className="space-y-3">
              {MOCK_OPTIONS.map((option, i) => (
                <motion.li
                  key={option}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: 0.2 + i * 0.08,
                  }}
                >
                  <motion.button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    className="group flex w-full items-center justify-between border border-lumen-border bg-lumen-black/40 px-4 py-3 text-left font-body text-sm text-lumen-offwhite/80 transition-all duration-500 hover:border-lumen-gold/50"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(184,151,74,0)",
                        "0 0 0 6px rgba(184,151,74,0.12)",
                        "0 0 0 0 rgba(184,151,74,0)",
                      ],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1 + i * 0.2,
                    }}
                  >
                    <span className="group-hover:text-lumen-offwhite transition-colors duration-500">{option}</span>
                    <span aria-hidden className="text-lumen-gold/60 transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
