/**
 * QuizProgress — thin gold line at the top of the screen that fills as the
 * user advances through questions.
 *
 * Width animates from `(current / 5) * 100%` to `((current + 1) / 5) * 100%`
 * using Framer Motion's `animate` prop on a `motion.div`. The line's height
 * is 1px (per PRD §7.x design language: hairline dividers).
 *
 * Easing [0.16, 1, 0.3, 1] and 500ms duration match the brand-wide animation
 * rules (slow, deliberate, no bouncy springs).
 */

"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION_S = 0.5;
const TOTAL = 5;

export interface QuizProgressProps {
  /** 0-based index of the current question (0..4). After Q5 → 5. */
  current: number;
}

export function QuizProgress({ current }: QuizProgressProps): JSX.Element {
  const clamped = Math.max(0, Math.min(current, TOTAL));
  const targetPct = (clamped / TOTAL) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(targetPct)}
      aria-label={`Quiz progress: ${Math.round(targetPct)} percent`}
      className="fixed top-0 left-0 right-0 z-50 h-[1px] bg-lumen-border/60"
    >
      <motion.div
        className="h-full bg-lumen-gold origin-left"
        initial={false}
        animate={{ width: `${targetPct}%` }}
        transition={{ duration: DURATION_S, ease: EASE }}
      />
    </div>
  );
}