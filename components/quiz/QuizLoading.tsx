/**
 * QuizLoading — full-screen loader shown immediately after the user answers
 * the 5th question.
 *
 * Per PRD §5.6: must display for a minimum of 2 seconds even if the API
 * responds faster. The parent `Quiz` component enforces the minimum display
 * time so a slow API doesn't surprise the user.
 *
 * Three pulsing dots + a calm "Analysing your skin profile..." message in the
 * brand voice. No spinner — luxury is slow and deliberate, not busy.
 */

"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function QuizLoading(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="w-full max-w-md mx-auto px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="Analysing your skin profile"
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-lumen-gold"
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: EASE,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <p className="font-display italic text-2xl md:text-3xl text-lumen-black mb-3">
        Analysing your skin profile
      </p>
      <p className="font-body text-sm md:text-base text-lumen-muted">
        Matching you with the treatments best suited to your skin.
      </p>
    </motion.div>
  );
}