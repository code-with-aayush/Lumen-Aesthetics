/**
 * Homepage — fully assembled across B2 → B4.
 *
 *   B2: Hero + ProofStrip.
 *   B3: TreatmentsPreview, QuizEntry, Philosophy.
 *   B4: Testimonials, MembershipTeaser, FinalCTA.
 */

import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { MembershipTeaser } from "@/components/home/MembershipTeaser";
import { Philosophy } from "@/components/home/Philosophy";
import { ProofStrip } from "@/components/home/ProofStrip";
import { QuizEntry } from "@/components/home/QuizEntry";
import { Testimonials } from "@/components/home/Testimonials";
import { TreatmentsPreview } from "@/components/home/TreatmentsPreview";

export default function Home() {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      <Hero />
      <ProofStrip />
      <TreatmentsPreview />
      <QuizEntry />
      <Philosophy />
      <Testimonials />
      <MembershipTeaser />
      <FinalCTA />
    </main>
  );
}