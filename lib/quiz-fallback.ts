/**
 * Quiz fallback recommendations.
 *
 * Provider-agnostic. Used by app/api/quiz/route.ts whenever the Gemini call
 * fails or the API key is missing. Recommendations are keyed on Q1 (primary
 * skin concern) per PRD §6.3 so users still see plausible, concern-relevant
 * treatments instead of a raw error.
 *
 * Never expose raw provider errors to the client — return one of these.
 */

export interface FallbackTreatment {
  name: string;
  tagline: string;
  description: string;
  why: string;
  timeline: string;
  priceFrom: string;
}

export interface FallbackResult {
  treatments: FallbackTreatment[];
  meta: { fallback: true };
}

/** Q1 -> treatments. Falls through to "Fine lines & wrinkles" on unknown input. */
const BY_Q1: Record<string, FallbackTreatment[]> = {
  "Fine lines & wrinkles": [
    {
      name: "Injectables",
      tagline: "Quietly refreshed, never frozen.",
      description:
        "Botox, Dysport, and dermal fillers administered with clinical precision. Conservative dosing, conservative outcomes.",
      why: "The most clinically effective route to softening expression lines while preserving facial mobility.",
      timeline: "Visible in 3–7 days, full effect at 14 days.",
      priceFrom: "From $14/unit Botox · Fillers from $750/syringe",
    },
    {
      name: "RF Microneedling",
      tagline: "Collagen, rebuilt from within.",
      description:
        "Radiofrequency microneedling for skin tightening and collagen induction. Builds structural improvement over time.",
      why: "Pairs with injectables to address skin quality alongside lines — a more complete result than either alone.",
      timeline: "Gradual improvement over 1–3 months.",
      priceFrom: "From $800/session",
    },
    {
      name: "Skin Optimisation",
      tagline: "Your daily protocol, recalibrated.",
      description:
        "Medical-grade facials, peels, and bespoke skin programmes built around your skin biology — not a menu.",
      why: "Pre- and post-injectable skin health extends the life of every treatment you invest in.",
      timeline: "Ongoing — monthly protocol.",
      priceFrom: "From $275/session",
    },
  ],
  "Loss of volume": [
    {
      name: "Injectables",
      tagline: "Structure, restored.",
      description:
        "Hyaluronic acid fillers placed with anatomical precision to restore volume in cheeks, temples, and under-eyes.",
      why: "Volume loss is a structural problem — fillers are the most direct clinical answer.",
      timeline: "Immediate result, lasts 9–18 months.",
      priceFrom: "Fillers from $750/syringe",
    },
    {
      name: "RF Microneedling",
      tagline: "Skin quality, rebuilt.",
      description:
        "Stimulates collagen and elastin to firm lax skin that often accompanies volume loss.",
      why: "Addresses the skin-quality dimension that fillers alone cannot reach.",
      timeline: "Gradual, 1–3 months.",
      priceFrom: "From $800/session",
    },
    {
      name: "Skin Optimisation",
      tagline: "Daily support, clinically selected.",
      description:
        "Custom protocol designed to support dermal health alongside in-clinic work.",
      why: "Sustains volume-restoration results by maintaining skin integrity over time.",
      timeline: "Monthly.",
      priceFrom: "From $275/session",
    },
  ],
  "Skin texture & tone": [
    {
      name: "Laser Resurfacing",
      tagline: "Pigmentation, refined.",
      description:
        "Medical-grade laser protocols for pigmentation, texture, sun damage, and tone. Calibrated per skin type.",
      why: "The most direct intervention for uneven texture and tone. Not a one-setting-fits-all approach.",
      timeline: "Visible in 1–2 weeks, full effect over 3 months.",
      priceFrom: "From $350/session",
    },
    {
      name: "RF Microneedling",
      tagline: "Texture, rebuilt.",
      description:
        "Stimulates dermal remodelling for visible texture improvement and scar revision.",
      why: "Works at a structural level that topical regimens cannot reach.",
      timeline: "Gradual, 1–3 months.",
      priceFrom: "From $800/session",
    },
    {
      name: "Skin Optimisation",
      tagline: "Your protocol, written for your skin.",
      description:
        "Bespoke programme of medical-grade facials and peels, recalibrated as your skin changes.",
      why: "Maintains and extends the gains from in-clinic resurfacing work.",
      timeline: "Monthly.",
      priceFrom: "From $275/session",
    },
  ],
  "Unwanted hair": [
    {
      name: "Laser Hair Removal",
      tagline: "Lasting reduction, clinically calibrated.",
      description:
        "Medical-grade laser protocols calibrated to your skin and hair type for safe, lasting hair reduction.",
      why: "The clinical standard for lasting hair reduction — calibrated to your skin and hair, not a one-setting-fits-all approach.",
      timeline: "Series of 6–8 sessions, 4–6 weeks apart.",
      priceFrom: "From $350/session",
    },
    {
      name: "Skin Optimisation",
      tagline: "Skin between sessions.",
      description:
        "Medical-grade skincare to maintain skin health between laser sessions and reduce post-treatment reactivity.",
      why: "Healthy skin responds better to laser and recovers faster between sessions.",
      timeline: "Ongoing.",
      priceFrom: "From $275/session",
    },
    {
      name: "RF Microneedling",
      tagline: "Texture refinement, if needed.",
      description:
        "For residual texture concerns like ingrown-hair scarring once hair reduction is underway.",
      why: "Addresses the secondary concern that often follows long-term hair removal — scarring or textural change.",
      timeline: "Gradual, 1–3 months.",
      priceFrom: "From $800/session",
    },
  ],
  "Body contouring": [
    {
      name: "Body Sculpting",
      tagline: "Stubborn areas, clinically addressed.",
      description:
        "Non-surgical body contouring with medical-grade technology for stubborn fat and skin laxity.",
      why: "The most direct non-surgical intervention for areas that don't respond to diet and exercise.",
      timeline: "Visible in 8–12 weeks as the body clears treated fat.",
      priceFrom: "From $1,200/session",
    },
    {
      name: "RF Microneedling",
      tagline: "Skin quality, body-wide.",
      description:
        "Radiofrequency microneedling for skin tightening on body areas post-contouring or weight loss.",
      why: "Addresses skin laxity that often follows fat reduction — completes the result.",
      timeline: "Gradual, 1–3 months.",
      priceFrom: "From $800/session",
    },
    {
      name: "Skin Optimisation",
      tagline: "Whole-body protocol.",
      description:
        "Skincare protocols designed to support in-clinic body work and maintain skin integrity.",
      why: "Sustains results between in-clinic sessions with at-home clinical-grade support.",
      timeline: "Monthly.",
      priceFrom: "From $275/session",
    },
  ],
};

/** Safe default if Q1 isn't recognised — same as the most common concern. */
const DEFAULT_Q1 = "Fine lines & wrinkles";

export function getFallbackRecommendations(answers: {
  q1: string;
}): FallbackResult {
  const q1 = answers?.q1 in BY_Q1 ? answers.q1 : DEFAULT_Q1;
  const treatments = BY_Q1[q1] ?? BY_Q1[DEFAULT_Q1];
  if (!treatments) {
    // Unreachable given the constant above, but keeps the return type tight.
    throw new Error("Fallback table misconfigured: no default treatments.");
  }
  return {
    treatments,
    meta: { fallback: true },
  };
}
