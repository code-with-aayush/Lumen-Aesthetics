/**
 * /thank-you — post-booking confirmation.
 *
 * Renders after the /book flow completes (or any visitor reaches this URL
 * directly). Three sections per the spec:
 *
 *   1. Confirmation hero — gold check, headline "You're confirmed.", subhead
 *      about the calendar invite + intake form email.
 *   2. Next steps row — Add to Google Calendar (demo placeholder, href="#"),
 *      Follow us on Instagram → instagram.com/lumenaesthetics, View
 *      Treatments → /treatments.
 *   3. Reschedule footnote with phone + email reply.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/shared/Button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const metadata: Metadata = {
  title: "You're Confirmed · Lumen Aesthetics",
  description:
    "Your appointment request has been received. We'll send a calendar invitation and intake form to your email shortly.",
};

type NextStep = {
  label: string;
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
  /** Renders as the gold outline <Button/> when true, otherwise a text link. */
  primary?: boolean;
};

const NEXT_STEPS: readonly NextStep[] = [
  {
    label: "Add to Google Calendar",
    href: "#",
    primary: true,
  },
  {
    label: "Follow us on Instagram",
    href: "https://instagram.com/lumenaesthetics",
    external: true,
  },
  {
    label: "View Treatments",
    href: "/treatments",
  },
] as const;

export default function ThankYouPage(): JSX.Element {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      {/* Confirmation hero */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 pb-16 pt-32 text-center md:pb-24 md:pt-40">
          <div className="mb-8 flex justify-center">
            <CheckCircle
              className="h-12 w-12 text-lumen-gold"
              strokeWidth={1.25}
              aria-hidden
            />
          </div>
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold">
            Confirmation
          </p>
          <h1 className="font-display text-5xl font-light italic leading-tight text-lumen-offwhite md:text-6xl lg:text-7xl">
            You&apos;re confirmed.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
            We&apos;ll send a calendar invitation and intake form to your
            email shortly.
          </p>
        </div>
      </SectionWrapper>

      {/* Next steps — 3 items in a row on desktop, stacked on mobile. */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 pb-20 md:pb-28">
          <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-center gap-6 md:flex-row md:items-center md:gap-8">
            {NEXT_STEPS.map((step) => (
              <NextStepItem key={step.label} step={step} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Reschedule footnote */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content border-t border-lumen-border px-6 py-12 text-center md:py-16">
          <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-lumen-muted">
            If you need to reschedule, call{" "}
            <a
              href="tel:+12125550847"
              className="text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
            >
              (212) 555-0847
            </a>{" "}
            or reply to your confirmation email.
          </p>
        </div>
      </SectionWrapper>
    </main>
  );
}

function NextStepItem({ step }: { step: NextStep }): JSX.Element {
  // Primary action — use the project's gold outline button. Calendar link is
  // a placeholder for the demo, so we render as a button (no real href).
  if (step.primary) {
    return (
      <Button
        // Button is polymorphic — when `href` is omitted it renders a real
        // <button>, which is the right element for a non-navigating demo
        // action. The placeholder is intentional per project context.
        variant="outline"
        className="px-6 py-3"
      >
        {step.label}
      </Button>
    );
  }

  // External links get target=_blank + rel=noopener.
  if (step.external) {
    return (
      <a
        href={step.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
      >
        {step.label}
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    );
  }

  // Internal next step.
  return (
    <Link
      href={step.href}
      className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
    >
      {step.label}
      <span
        aria-hidden
        className="inline-block transition-transform duration-500 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}