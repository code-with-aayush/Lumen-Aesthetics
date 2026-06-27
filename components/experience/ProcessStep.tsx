/**
 * ProcessStep — one of the four numbered steps on /experience (PRD §8.4).
 *
 * Layout: tiny gold number top-left, Cormorant italic title, 1–2 lines of
 * DM Sans muted body text below. The step sits in a 4-up grid on desktop,
 * single column on mobile. A subtle gold left-rail appears on hover but
 * the component never moves, scales, or springs (PRD §2.3).
 *
 * Server component — purely presentational.
 */

type Props = {
  number: string;
  title: string;
  body: string;
};

export function ProcessStep({ number, title, body }: Props): JSX.Element {
  return (
    <div className="group relative border-l border-lumen-border pl-6 transition-colors duration-500 hover:border-lumen-gold md:border-l-0 md:border-t md:pl-0 md:pt-6">
      <span className="font-display text-3xl font-light italic text-lumen-gold md:text-4xl">
        {number}
      </span>
      <h3 className="mt-4 font-display text-xl font-light italic text-lumen-offwhite md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 font-body text-sm font-light leading-relaxed text-lumen-muted md:text-base">
        {body}
      </p>
    </div>
  );
}
