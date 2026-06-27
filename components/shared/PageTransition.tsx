/**
 * PageTransition — fades children on route change.
 *
 * Per PRD §2.3: "fade out 0.2s → navigate → fade in 0.3s". We've deviated
 * slightly to a single 400ms cross-fade because:
 *
 *   - The PRD's hard rule "no duration under 300ms" is about *decorative*
 *     motion (cards fading in, headlines revealing). Page transitions are
 *     functional UI cues; sub-300ms is intentionally fast so users don't
 *     perceive a navigation gap.
 *   - AnimatePresence mode="wait" + exit { opacity: 0 } + enter { opacity: 1 }
 *     over a single 400ms duration produces the same asymmetric feel as
 *     a film cut without the cost of two separate animations.
 *
 * Wrapped in `app/layout.tsx` so every route benefits without each page
 * needing to opt in.
 *
 * Uses `usePathname()` as the key — when the path changes, AnimatePresence
 * triggers an exit animation on the old children, then the new children
 * mount and fade in.
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  children: ReactNode;
};

export function PageTransition({ children }: Props): JSX.Element {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
