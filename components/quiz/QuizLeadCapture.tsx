/**
 * QuizLeadCapture — optional name + email form between loading and results.
 *
 * Skippable: a "Skip, show my results" link does the same POST as submit
 * but without a lead payload. A5 will extend the API route to actually
 * persist leads to Airtable; for now, the lead is sent in the request body
 * and the server logs it (no-op for the lead destination).
 *
 * Email is validated client-side; full server-side validation lives in the
 * API route's Zod schema (extended in A5).
 */

"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

// Permissive email regex — matches the common case without false-negatives
// on TLDs the browser engine hasn't seen yet. Server-side validation is the
// authoritative gate (per CLAUDE.md §5 input validation).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LeadPayload {
  name: string;
  email: string;
}

export interface QuizLeadCaptureProps {
  onSubmit: (lead: LeadPayload) => void;
  onSkip: () => void;
  /** Disable both buttons during in-flight submit. */
  disabled?: boolean;
}

export function QuizLeadCapture({
  onSubmit,
  onSkip,
  disabled = false,
}: QuizLeadCaptureProps): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = email === "" || EMAIL_RE.test(email);
  const canSubmit =
    !disabled &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    emailValid;

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), email: email.trim() });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="w-full max-w-md mx-auto px-6"
      noValidate
    >
      <p className="text-xs uppercase tracking-wider text-lumen-muted mb-6 text-center">
        Your results are ready
      </p>

      <h2 className="font-display italic text-3xl md:text-4xl text-lumen-black leading-tight mb-4 text-center">
        Save them for later?
      </h2>

      <p className="font-body text-sm md:text-base text-lumen-muted text-center mb-10">
        Add your name and email and we&apos;ll send you a copy of your
        personalised recommendations.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="quiz-name" className="sr-only">
            Name
          </label>
          <input
            id="quiz-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            autoComplete="name"
            disabled={disabled}
            className={cn(
              "w-full min-h-[52px] px-4 py-3 bg-white text-lumen-black",
              "border border-lumen-border focus:border-lumen-gold",
              "transition-colors duration-500",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
              "font-body text-base",
              "placeholder:text-lumen-muted",
            )}
          />
        </div>

        <div>
          <label htmlFor="quiz-email" className="sr-only">
            Email
          </label>
          <input
            id="quiz-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
            disabled={disabled}
            aria-invalid={touched && !emailValid}
            aria-describedby={touched && !emailValid ? "quiz-email-err" : undefined}
            className={cn(
              "w-full min-h-[52px] px-4 py-3 bg-white text-lumen-black",
              "border focus:border-lumen-gold",
              "transition-colors duration-500",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
              "font-body text-base",
              "placeholder:text-lumen-muted",
              touched && !emailValid
                ? "border-red-400"
                : "border-lumen-border",
            )}
          />
          {touched && !emailValid && (
            <p
              id="quiz-email-err"
              className="mt-2 text-xs text-red-600 font-body"
            >
              Please enter a valid email.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "mt-4 w-full min-h-[52px] px-6 py-3",
            "border border-lumen-gold text-lumen-gold",
            "transition-colors duration-500",
            "font-body text-sm uppercase tracking-wider",
            "hover:bg-lumen-gold hover:text-white",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-lumen-gold",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
          )}
        >
          Save my results
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={disabled}
          className={cn(
            "w-full min-h-[44px] py-3",
            "text-lumen-muted hover:text-lumen-black",
            "transition-colors duration-500",
            "font-body text-sm",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          Skip, show my results →
        </button>
      </div>
    </motion.form>
  );
}