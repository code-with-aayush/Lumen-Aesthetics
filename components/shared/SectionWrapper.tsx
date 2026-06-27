/**
 * SectionWrapper — scroll-triggered fade-up wrapper.
 *
 * Per PRD §2.3: opacity 0→1, translateY 20px→0, duration 700ms, easing
 * [0.16, 1, 0.3, 1]. The motion fires once when the section enters the
 * viewport (threshold 0.15) so re-scrolling doesn't replay it.
 *
 * Used by every homepage section (B2–B4) and any content page that wants
 * scroll-driven reveals.
 */

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Trigger threshold (0..1) of viewport coverage before animation fires. */
  amount?: number;
};

export function SectionWrapper({
  children,
  className,
  id,
  amount = 0.15,
}: Props): JSX.Element {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}