/**
 * /memberships — The Lumen Membership (PRD §5.4, §8.5).
 *
 * Three sections in order:
 *   1. Hero — dark bg, eyebrow + Cormorant italic headline + subhead.
 *   2. 3-tier table — Essential $299/mo, Signature $599/mo (highlighted
 *      "Most Popular"), Luminary $999/mo. Each tier links to
 *      `/book?tier={slug}`.
 *   3. FAQ accordion — 3 questions, Framer Motion height animation,
 *      easing [0.16, 1, 0.3, 1], duration 500ms (well over the 300ms
 *      floor per PRD §2.3).
 *
 * Copy is pasted from PRD §8.5 verbatim, with the FAQ questions slightly
 * expanded to match the 3-question spec in the C2 task description.
 */

import type { Metadata } from "next";

import { FAQItem } from "@/components/memberships/FAQItem";
import { MembershipTierCard } from "@/components/memberships/MembershipTierCard";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const metadata: Metadata = {
  title: "Memberships · Lumen Aesthetics",
  description:
    "Invest in your skin, month after month. Three membership tiers — Essential, Signature, and Luminary — with predictable pricing, priority access, and a provider who knows your face.",
};

// ---------------------------------------------------------------------------
// Copy — verbatim from PRD §8.5 with FAQ questions from the C2 task spec
// ---------------------------------------------------------------------------

const TIERS = [
  {
    name: "Lumen Essential",
    slug: "essential",
    price: "$299",
    cadence: "/ month",
    highlighted: false,
    perks: [
      "1 treatment per month (your choice)",
      "10% off all retail products",
      "Priority booking",
      "Monthly skin check-in",
    ],
  },
  {
    name: "Lumen Signature",
    slug: "signature",
    price: "$599",
    cadence: "/ month",
    highlighted: true,
    perks: [
      "2 treatments per month",
      "20% off retail",
      "Same-week appointment guarantee",
      "Quarterly skin review with your provider",
      "Access to new treatment previews",
    ],
  },
  {
    name: "Lumen Luminary",
    slug: "luminary",
    price: "$999",
    cadence: "/ month",
    highlighted: false,
    perks: [
      "4 treatments per month",
      "25% off retail",
      "Dedicated provider relationship",
      "Unlimited consultations",
      "Annual bespoke skin plan",
      "Invitation-only events",
    ],
  },
] as const;

const FAQ = [
  {
    question: "How does billing work?",
    answer:
      "Monthly recurring on the 1st. Cancel any time, no penalty.",
  },
  {
    question: "Can I pause my membership?",
    answer:
      "Yes — pause for up to 2 months per year, per membership year.",
  },
  {
    question: "What if I want to upgrade?",
    answer:
      "Upgrades pro-rate immediately. Downgrades take effect on the next billing cycle.",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MembershipsPage(): JSX.Element {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Hero                                                            */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-lumen-black pt-32 md:pt-40">
        <div className="mx-auto max-w-content px-6 pb-20 md:pb-28">
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold">
            Memberships
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-light italic leading-[1.05] text-lumen-offwhite sm:text-6xl md:text-7xl lg:text-[88px]">
            Invest in your skin.
            <br />
            Month after month.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
            A Lumen membership is how our most consistent results happen.
            Predictable pricing, priority access, and a provider who knows
            your skin as well as you do.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Three-tier table                                                */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-dark">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
              Choose your tier
            </p>
            <h2 className="font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              Three ways to commit.
            </h2>
            <p className="mt-6 font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
              All tiers include same-provider continuity, medical-grade
              products, and HIPAA-compliant records. Tier differences live
              in volume, access, and the depth of the relationship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-3 md:gap-8">
            {TIERS.map((tier) => (
              <MembershipTierCard
                key={tier.slug}
                name={tier.name}
                slug={tier.slug}
                price={tier.price}
                cadence={tier.cadence}
                perks={tier.perks}
                highlighted={tier.highlighted}
              />
            ))}
          </div>

          <p className="mt-12 text-center font-body text-xs uppercase tracking-wider text-lumen-muted">
            Month-to-month. Cancel with 30 days notice, no penalty.
          </p>
        </div>
      </SectionWrapper>

      {/* ----------------------------------------------------------------- */}
      {/* 3. FAQ accordion                                                    */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
              Frequently Asked
            </p>
            <h2 className="font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              The fine print, in plain English.
            </h2>
          </div>

          <div className="border-t border-lumen-border">
            {FAQ.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
