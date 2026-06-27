/**
 * /book — appointment booking page.
 *
 * Per PRD §5.5: minimal dark page, centered headline "Reserve Your
 * Appointment." in Cormorant italic, subhead "By appointment only. New
 * patients welcome.", no sidebar, no distractions.
 *
 * Originally wired to a Cal.com embed; per project context this is a
 * portfolio demo with no real Cal.com account, so the page renders a
 * styled placeholder booking widget (see <BookingWidget/>).
 */

import type { Metadata } from "next";

import { BookingWidget } from "@/components/book/BookingWidget";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const metadata: Metadata = {
  title: "Reserve Your Appointment · Lumen Aesthetics",
  description:
    "Book a complimentary consultation with our medical aesthetics team. By appointment only. New patients welcome.",
};

export default function BookPage(): JSX.Element {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      {/* Hero — minimal, centered, dark bg (PRD §5.5). */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 pb-12 pt-32 text-center md:pb-16 md:pt-40">
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold">
            Booking
          </p>
          <h1 className="font-display text-5xl font-light italic leading-tight text-lumen-offwhite md:text-6xl lg:text-7xl">
            Reserve Your Appointment.
          </h1>
          <p className="mx-auto mt-6 max-w-lg font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
            By appointment only. New patients welcome.
          </p>
        </div>
      </SectionWrapper>

      {/* Booking widget placeholder — demo, no backend. */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 pb-32 md:pb-40">
          <BookingWidget />
        </div>
      </SectionWrapper>
    </main>
  );
}