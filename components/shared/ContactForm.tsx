/**
 * ContactForm — single contact form used wherever the site needs one.
 *
 * Spec:
 *   - Three fields: Name, Email, Message (textarea).
 *   - React Hook Form for input state + client-side validation.
 *   - On submit: POST /api/contact. Show inline success state on 200, an
 *     inline error message on failure (the API returns generic copy; we
 *     just surface it as-is).
 *   - All transitions use the standard EASE; no jarring swap between form
 *     and success states.
 *
 * The form is a single self-contained client component. Drop it anywhere
 * with `<ContactForm />`. (Currently unused on pages — C4 task spec asks
 * for the component to exist + the API to work; the Footer could host
 * it later, or a dedicated /contact page in a future iteration.)
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/shared/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", message: "" },
  });

  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const onSubmit = handleSubmit(async (values) => {
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        // API returns { error: string }. Fall back to generic if missing.
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setState({
          kind: "error",
          message:
            body?.error ??
            "Something went wrong. Please try again or call (212) 555-0847.",
        });
        return;
      }
      reset();
      setState({ kind: "success" });
    } catch {
      setState({
        kind: "error",
        message:
          "Network error. Please check your connection or call (212) 555-0847.",
      });
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.kind === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-start gap-4 border border-lumen-gold/40 bg-lumen-dark p-8"
        >
          <CheckCircle2
            className="h-8 w-8 text-lumen-gold"
            strokeWidth={1.5}
            aria-hidden
          />
          <h3 className="font-display text-2xl italic text-lumen-offwhite">
            Thank you.
          </h3>
          <p className="font-body text-sm font-light leading-relaxed text-lumen-muted">
            Your message has been received. A member of our team will be in
            touch within one business day. For urgent enquiries, call{" "}
            <a
              href="tel:+12125550847"
              className="text-lumen-offwhite underline-offset-4 hover:underline"
            >
              (212) 555-0847
            </a>
            .
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onSubmit={onSubmit}
          className="flex flex-col gap-6"
          noValidate
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="font-body text-[10px] uppercase tracking-widest text-lumen-muted"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              {...register("name", {
                required: "Please enter your name",
                maxLength: { value: 120, message: "Name is too long" },
              })}
              className="border-b border-lumen-border bg-transparent py-3 font-body text-base text-lumen-offwhite outline-none transition-colors duration-500 focus:border-lumen-gold"
            />
            {errors.name ? (
              <p className="font-body text-xs text-red-400/80">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-email"
              className="font-body text-[10px] uppercase tracking-widest text-lumen-muted"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
                maxLength: { value: 254, message: "Email is too long" },
              })}
              className="border-b border-lumen-border bg-transparent py-3 font-body text-base text-lumen-offwhite outline-none transition-colors duration-500 focus:border-lumen-gold"
            />
            {errors.email ? (
              <p className="font-body text-xs text-red-400/80">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="font-body text-[10px] uppercase tracking-widest text-lumen-muted"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              {...register("message", {
                required: "Please write a message",
                minLength: { value: 10, message: "Please write at least 10 characters" },
                maxLength: { value: 2000, message: "Message is too long" },
              })}
              className="resize-none border-b border-lumen-border bg-transparent py-3 font-body text-base text-lumen-offwhite outline-none transition-colors duration-500 focus:border-lumen-gold"
            />
            {errors.message ? (
              <p className="font-body text-xs text-red-400/80">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          {/* Server-side error */}
          {state.kind === "error" ? (
            <p className="font-body text-sm text-red-400/90">{state.message}</p>
          ) : null}

          <div>
            <Button
              type="submit"
              variant="outline"
              disabled={state.kind === "submitting" || !isValid}
            >
              {state.kind === "submitting" ? "Sending…" : "Send Message"}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}