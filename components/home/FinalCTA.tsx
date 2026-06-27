/**
 * FinalCTA — full-width last call before the footer.
 *
 * Per PRD §5.1 + breakdown: dark section, large Cormorant italic headline,
 * two CTAs (primary outline → /book, secondary text → /quiz). The quiz
 * CTA is intentional — by the time a visitor reaches this point they've
 * seen the Hero, the QuizEntry section, and the testimonials; offering
 * the quiz again as a low-commitment next step matches the demo's
 * hero-moment strategy.
 */

import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export function FinalCTA(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-dark">
      <div className="mx-auto max-w-content px-6 py-24 text-center md:py-32">
        <p className="mb-6 font-body text-[10px] uppercase tracking-widest text-lumen-gold">
          Your skin. Calibrated.
        </p>
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl lg:text-6xl">
          Begin with a consultation.
          <br />
          Stay for the results.
        </h2>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
          <Button href="/book" variant="outline">
            Reserve Your Appointment
          </Button>
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
          >
            Or take the 60-second quiz
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}