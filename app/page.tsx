/**
 * Homepage — assembled incrementally across B2 → B4.
 *
 *   B2 (this commit): Hero + Ticker (inside Hero) + ProofStrip.
 *   B3 (next):         TreatmentsPreview, QuizEntry, Philosophy.
 *   B4 (next-next):    Testimonials, MembershipTeaser, FinalCTA.
 *
 * The Hero carries its own scrolling ticker at the bottom per PRD §5.1;
 * we don't render a second <Ticker /> here.
 */

import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";

export default function Home() {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      <Hero />
      <ProofStrip />
    </main>
  );
}
