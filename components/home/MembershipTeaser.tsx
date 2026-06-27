/**
 * MembershipTeaser — dark card with gold border, two tiers, CTA.
 *
 * Per PRD §5.1: "The Lumen Membership" — dark card with gold border,
 * brief description, two tiers, CTA to /memberships. Shows the entry +
 * mid tiers (Essential $299, Signature $599). Luminary is reserved for
 * the /memberships page where the full 3-tier comparison lives.
 *
 * Highlight Signature as "Most Popular" — the recommended tier per
 * PRD §5.4 — so the teaser has a clear visual pick.
 */

import Link from "next/link";

import { SectionWrapper } from "@/components/shared/SectionWrapper";

const TIERS = [
  {
    name: "Essential",
    price: "$299",
    cadence: "/month",
    perks: [
      "1 treatment / month",
      "10% off retail",
      "Priority booking",
    ],
    highlighted: false,
  },
  {
    name: "Signature",
    price: "$599",
    cadence: "/month",
    perks: [
      "2 treatments / month",
      "20% off retail",
      "Same-week guarantee",
      "Quarterly skin review",
    ],
    highlighted: true,
  },
] as const;

export function MembershipTeaser(): JSX.Element {
  return (
    <SectionWrapper className="bg-lumen-black">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <div className="border border-lumen-gold/50 bg-lumen-dark p-10 md:p-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              <span className="mb-4 font-body text-[10px] uppercase tracking-widest text-lumen-gold">
                Membership
              </span>
              <h2 className="font-display text-4xl font-light italic text-lumen-offwhite md:text-5xl">
                The Lumen Membership
              </h2>
              <p className="mt-4 font-body text-base font-light leading-relaxed text-lumen-muted">
                Invest in your skin, month after month. Predictable pricing,
                priority access, and a provider who knows your face.
              </p>
              <Link
                href="/memberships"
                className="group mt-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
              >
                Compare All Tiers
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* Right: two tier cards */}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {TIERS.map((tier) => (
                <li
                  key={tier.name}
                  className={`relative flex flex-col border p-6 transition-all duration-500 ${
                    tier.highlighted
                      ? "border-lumen-gold bg-lumen-black/40"
                      : "border-lumen-border bg-lumen-black/20 hover:border-lumen-gold/60"
                  }`}
                >
                  {tier.highlighted ? (
                    <span className="absolute -top-3 left-6 bg-lumen-black px-3 font-body text-[10px] uppercase tracking-widest text-lumen-gold">
                      Most Popular
                    </span>
                  ) : null}
                  <h3 className="font-display text-xl italic text-lumen-offwhite">
                    {tier.name}
                  </h3>
                  <p className="mt-2">
                    <span className="font-display text-3xl italic text-lumen-gold">
                      {tier.price}
                    </span>
                    <span className="ml-1 font-body text-xs uppercase tracking-wider text-lumen-muted">
                      {tier.cadence}
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2 font-body text-sm font-light text-lumen-offwhite/80">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-lumen-gold"
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}