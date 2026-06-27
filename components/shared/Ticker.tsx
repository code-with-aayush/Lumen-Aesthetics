/**
 * Ticker — infinite horizontal scroll of repeating text.
 *
 * Used by the homepage "scrolling proof strip" (PRD §5.1) and any page that
 * wants a subtle motion band without the cost of a JS animation loop.
 *
 * Implementation: the content block is duplicated, then translated by
 * exactly -50% over `speed` seconds via a CSS keyframe. Because each half
 * is identical, the loop is seamless — no visible jump.
 *
 * Speed is seconds for one full cycle (content block off the left edge
 * and the duplicate now visible in its place). 30s is a comfortable
 * reading pace for headlines.
 */

"use client";

type Props = {
  content: string;
  /** Seconds for one full cycle. Lower = faster. */
  speed?: number;
  className?: string;
};

export function Ticker({ content, speed = 30, className }: Props): JSX.Element {
  // Build one "set" — 3 copies of the content with horizontal padding.
  // The keyframe translates by -50% so we need exactly two identical sets
  // total on screen at any time.
  const set = (
    <span className="flex shrink-0" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="px-8 font-display text-2xl italic text-lumen-offwhite/70"
        >
          {content}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <div
        className="flex w-max"
        style={{ animation: `lumen-ticker ${speed}s linear infinite` }}
      >
        {set}
        {set}
      </div>
      <style>{`
        @keyframes lumen-ticker {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}