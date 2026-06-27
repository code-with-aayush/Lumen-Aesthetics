/**
 * MembershipTierCard — one of three tiers on /memberships (PRD §5.4, §8.5).
 *
 * Tier name in Cormorant italic, price large Cormorant italic gold,
 * "/month" cadence in DM Sans muted, perks list with tiny gold bullets,
 * and a "Begin Membership" CTA → `/book?tier={slug}`. The recommended
 * tier (Signature) renders with a stronger gold border and filled
 * CTA variant — visual pick per PRD §5.4.
 *
 * Server component — purely presentational. Hover transitions are CSS
 * only, respecting PRD §2.3's "no movement, no scale" rule.
 */

import { Button } from "@/components/shared/Button";

type Props = {
  name: string;
  /** Slug used in the /book?tier=... query string. */
  slug: string;
  /** Display price (e.g. "$299"). */
  price: string;
  /** Cadence label shown next to the price (e.g. "/ month"). */
  cadence: string;
  perks: ReadonlyArray<string>;
  /** When true: gold border, "Most Popular" badge, filled CTA. */
  highlighted: boolean;
};

export function MembershipTierCard({
  name,
  slug,
  price,
  cadence,
  perks,
  highlighted,
}: Props): JSX.Element {
  return (
    <article
      className={
        highlighted
          ? "relative flex flex-col border border-lumen-gold bg-lumen-dark p-8 transition-all duration-500 md:p-10"
          : "relative flex flex-col border border-lumen-border bg-lumen-black/40 p-8 transition-all duration-500 hover:border-lumen-gold/60 md:p-10"
      }
    >
      {highlighted ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-lumen-black px-4 font-body text-[10px] uppercase tracking-widest text-lumen-gold">
          Most Popular
        </span>
      ) : null}

      <h3 className="font-display text-3xl font-light italic text-lumen-offwhite">
        {name}
      </h3>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-5xl font-light italic text-lumen-gold">
          {price}
        </span>
        <span className="font-body text-xs uppercase tracking-wider text-lumen-muted">
          {cadence}
        </span>
      </p>

      <p className="mt-2 font-body text-xs uppercase tracking-wider text-lumen-muted">
        Billed monthly
      </p>

      <ul className="mt-8 space-y-3 font-body text-sm font-light leading-relaxed text-lumen-offwhite/85">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-lumen-gold"
            />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-2">
        <Button
          href={`/book?tier=${slug}`}
          variant={highlighted ? "filled" : "outline"}
          className="w-full"
        >
          Begin Membership
        </Button>
      </div>
    </article>
  );
}
