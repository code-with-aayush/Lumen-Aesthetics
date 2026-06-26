/**
 * QuizQuestion — renders one question + its answer options.
 *
 * Click any option to call `onAnswer` and advance. Pure presentational
 * component; the parent Quiz owns the state machine.
 *
 * Per PRD §6.1: full-width on mobile, tap targets ≥44×44px, gold border on
 * hover, checkmark on selected (when shown).
 */

"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestionProps {
  /** 1-based question number, used for the "Question N of 5" eyebrow. */
  number: number;
  question: string;
  options: readonly QuizOption[];
  /** Currently selected option's value (used to show the checkmark if revisiting). */
  selectedValue?: string;
  onAnswer: (value: string) => void;
}

export function QuizQuestion({
  number,
  question,
  options,
  selectedValue,
  onAnswer,
}: QuizQuestionProps): JSX.Element {
  return (
    <motion.div
      key={`q-${number}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      <p className="text-xs uppercase tracking-wider text-lumen-muted mb-6">
        Question {number} of 5
      </p>

      <h2 className="font-display italic font-light text-3xl md:text-4xl text-lumen-black leading-tight mb-10">
        {question}
      </h2>

      <ul className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onAnswer(option.value)}
                aria-pressed={isSelected}
                className={cn(
                  // Base — full-width, ≥44px tap target, calm hover.
                  "w-full min-h-[56px] px-5 py-4 flex items-center text-left",
                  "border bg-white",
                  "transition-all duration-500",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
                  // Default state: subtle border, off-black text.
                  "border-lumen-border text-lumen-black",
                  // Hover (only when not yet selected).
                  !isSelected && "hover:border-lumen-gold",
                  // Selected: gold border, gold checkmark on the left.
                  isSelected && "border-lumen-gold",
                )}
              >
                <span
                  className={cn(
                    "mr-4 inline-flex h-5 w-5 shrink-0 items-center justify-center border",
                    "transition-colors duration-500",
                    isSelected
                      ? "border-lumen-gold bg-lumen-gold text-white"
                      : "border-lumen-border",
                  )}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 6.5L5 9.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="font-body text-base md:text-[17px] leading-snug">
                  {option.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}