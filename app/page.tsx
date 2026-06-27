/**
 * Homepage — fully assembled across B2 → B4.
 *
 *   B2: Hero + ProofStrip.
 *   B3: TreatmentsPreview, QuizEntry, Philosophy.
 *   B4: Testimonials, MembershipTeaser, FinalCTA.
 */

import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { MembershipTeaser } from "@/components/home/MembershipTeaser";
import { Philosophy } from "@/components/home/Philosophy";
import { ProofStrip } from "@/components/home/ProofStrip";
import { QuizEntry } from "@/components/home/QuizEntry";
import { Testimonials } from "@/components/home/Testimonials";
import { TreatmentsPreview } from "@/components/home/TreatmentsPreview";

export const metadata: Metadata = {
  title: "Lumen Aesthetics | Medical Aesthetics New York",
  description:
    "Where science meets artistry. New York's most discreet medical aesthetics studio — injectables, laser resurfacing, RF microneedling, body sculpting, skin optimisation.",
};

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