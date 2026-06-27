/**
 * Treatments page — full treatment menu (PRD §5.2).
 *
 * Layout:
 *   1. Hero — small eyebrow + Cormorant italic headline + subhead.
 *   2. Five TreatmentSection blocks, each full-width, alternating between
 *      lumen-black (#0A0A0A) and lumen-dark (#141414). Image alternates
 *      left/right for visual rhythm.
 *
 * Copy is restrained and clinical-but-warm, matching the homepage voice
 * (Hero subhead, TreatmentsPreview descriptions, Philosophy lines).
 */

import { TreatmentSection } from "@/components/treatments/TreatmentSection";
import type { Treatment } from "@/components/treatments/TreatmentSection";

const TREATMENTS: ReadonlyArray<Treatment> = [
  {
    slug: "injectables",
    name: "Injectables",
    description:
      "Botox and dermal filler, placed by hand and dosed to your anatomy. We favour restraint over volume and never treat a face we haven't first mapped in stillness.",
    whoFor:
      "Patients seeking softened expression lines, restored volume, or refined facial balance without the telltale signs of intervention.",
    whatToExpect:
      "A 45-minute consultation and treatment in a single visit. Discomfort is minimal; most patients return to normal activity the same day.",
    timeline: "Visible refinement within 5–7 days; full settling by week two. Results last 3–4 months for Botox, 9–14 months for filler.",
    priceFrom: "$650",
    image: "/images/treatment-injectables.svg",
  },
  {
    slug: "laser-resurfacing",
    name: "Laser Resurfacing",
    description:
      "Fractional laser treatment that resurfaces tone, refines texture, and rebuilds luminosity from the deeper layers up. We calibrate depth and density to your skin's history, not a protocol.",
    whoFor:
      "Patients with sun damage, fine lines, acne scarring, or uneven tone who want one meaningful treatment rather than a stack of modest ones.",
    whatToExpect:
      "Numbing cream, a 60–90 minute session, and a controlled 5–7 day recovery. Skin reads pink, then flutes, then reveals.",
    timeline: "Visible improvement at 2 weeks; collagen remodelling continues for 3 months. A single treatment is often transformative; deeper concerns may need a pair.",
    priceFrom: "$1,200",
    image: "/images/treatment-laser.svg",
  },
  {
    slug: "rf-microneedling",
    name: "RF Microneedling",
    description:
      "Radiofrequency energy delivered through a matrix of fine needles, triggering a measured injury-and-response pattern that rebuilds collagen and tightens skin from within.",
    whoFor:
      "Patients noticing early laxity, crepey texture, or loss of firmness along the jawline, neck, or décolletage — and who want structure, not just surface.",
    whatToExpect:
      "Three to four sessions, four weeks apart. Mild redness for 24–48 hours; no real downtime beyond that.",
    timeline: "Initial tightening at 4–6 weeks; the deeper collagen build continues for 6 months. Results last 12–18 months with maintenance.",
    priceFrom: "$950",
    image: "/images/treatment-rf-microneedling.svg",
  },
  {
    slug: "body-sculpting",
    name: "Body Sculpting",
    description:
      "Non-invasive contouring for the areas that don't respond to training or discipline. We treat the body the way we treat the face: as a study, not a target.",
    whoFor:
      "Patients at or near their baseline weight who are dealing with localised fat pockets, mild laxity, or asymmetry that diet and exercise won't resolve.",
    whatToExpect:
      "A series of 2–4 sessions per area, spaced 6 weeks apart. No anaesthesia, no incisions, no downtime — most patients return to the gym within a day.",
    timeline: "Initial change at 6 weeks; final contour visible at 12 weeks. Results are durable with weight stability.",
    priceFrom: "$1,500",
    image: "/images/treatment-body-sculpting.svg",
  },
  {
    slug: "skin-optimisation",
    name: "Skin Optimisation",
    description:
      "Medical-grade facials, peels, and an at-home protocol built around your skin's actual behaviour. The unglamorous foundation that makes every other treatment work harder.",
    whoFor:
      "Patients who want better skin as a baseline — not a one-off fix — and who are willing to invest in maintenance rather than miracles.",
    whatToExpect:
      "An opening skin analysis, a 60-minute first treatment, and a written protocol you can actually follow. Monthly visits refine from there.",
    timeline: "Visible improvement within 2 weeks; meaningful change by month three. This is the long game — and it compounds.",
    priceFrom: "$350",
    image: "/images/treatment-skin-optimisation.svg",
  },
];

export const metadata = {
  title: "Treatments — Lumen Aesthetics",
  description:
    "Injectables, laser, RF microneedling, body sculpting, and skin optimisation — each treatment calibrated, not maximised.",
};

export default function TreatmentsPage(): JSX.Element {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      {/* Page hero — eyebrow + Cormorant italic headline + subhead. */}
      <section className="bg-lumen-black pt-32 md:pt-40">
        <div className="mx-auto max-w-content px-6 pb-20 md:pb-28">
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold">
            The Treatment Menu
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-light italic leading-[1.05] text-lumen-offwhite sm:text-6xl md:text-7xl lg:text-[88px]">
            Treatments, considered.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
            Five categories, each delivered by the same provider who
            assessed your skin. Every treatment is clinically indicated,
            dosed to your anatomy, and held to a standard that prizes
            refinement over volume.
          </p>
        </div>
      </section>

      {/* Five treatment sections, alternating bg + image side. */}
      {TREATMENTS.map((treatment, i) => (
        <TreatmentSection
          key={treatment.slug}
          treatment={treatment}
          reversed={i % 2 === 1}
          index={i}
        />
      ))}
    </main>
  );
}