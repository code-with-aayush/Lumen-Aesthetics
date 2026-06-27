/**
 * Homepage — assembled incrementally across B2 → B4.
 *
 *   B2 (done): Hero + Ticker (inside Hero) + ProofStrip.
 *   B3 (this): TreatmentsPreview, QuizEntry, Philosophy.
 *   B4 (next): Testimonials, MembershipTeaser, FinalCTA.
 */

import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { ProofStrip } from "@/components/home/ProofStrip";
import { QuizEntry } from "@/components/home/QuizEntry";
import { TreatmentsPreview } from "@/components/home/TreatmentsPreview";

export default function Home() {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      <Hero />
      <ProofStrip />
      <TreatmentsPreview />
      <QuizEntry />
      <Philosophy />
    </main>
  );
}