/**
 * StandardItem — single credentials badge on /experience (PRD §5.3).
 *
 * Tiny gold check icon, uppercase muted DM Sans title, 1-line description.
 * Stacks into a 3-up grid on desktop, single column on mobile. No hover
 * movement — just a subtle gold border on hover so the grid feels
 * responsive without being busy (PRD §2.3).
 *
 * Server component.
 */

import { CheckCircle } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export function StandardItem({ title, description }: Props): JSX.Element {
  return (
    <div className="group flex flex-col gap-3 border border-lumen-border bg-lumen-black/30 p-6 transition-colors duration-500 hover:border-lumen-gold/60 md:p-7">
      <CheckCircle
        className="h-4 w-4 text-lumen-gold"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="font-body text-[10px] uppercase tracking-widest text-lumen-offwhite md:text-xs">
        {title}
      </h3>
      <p className="font-body text-sm font-light leading-relaxed text-lumen-muted">
        {description}
      </p>
    </div>
  );
}
