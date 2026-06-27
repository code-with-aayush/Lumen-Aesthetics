/**
 * FAQItem — single accordion row used by the /memberships FAQ list.
 *
 * Implements the PRD §5.4 + task C2 spec exactly:
 *   - Framer Motion `AnimatePresence` wraps a `motion.div` that animates
 *     `height: 0 → "auto"` and `opacity: 0 → 1` on open, with the reverse
 *     on close.
 *   - Easing is `[0.16, 1, 0.3, 1]` (the project's mandated luxury ease)
 *     and the duration is 500ms — well over the 300ms floor.
 *   - The button has `aria-expanded` and the icon swaps Plus ↔ Minus.
 *   - Open state is local to each item (no shared state needed — the
 *     membership FAQ is a short list and multi-open UX is the natural
 *     behaviour).
 *
 * Client component because the expand/collapse is interactive.
 */

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  question: string;
  answer: string;
};

export function FAQItem({ question, answer }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-lumen-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-7 text-left transition-colors duration-500 hover:text-lumen-gold focus:outline-none focus-visible:text-lumen-gold"
      >
        <span className="font-display text-xl font-light italic text-lumen-offwhite md:text-2xl">
          {question}
        </span>
        {open ? (
          <Minus
            className="h-4 w-4 shrink-0 text-lumen-gold"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : (
          <Plus
            className="h-4 w-4 shrink-0 text-lumen-gold"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-7 pr-10 font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
