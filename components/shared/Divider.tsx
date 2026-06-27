/**
 * Divider — thin 1px gold line at 30% opacity.
 *
 * Used to separate homepage sections (proof strip → treatments → quiz entry
 * → philosophy → testimonials, etc) without a heavy rule. Per PRD §2.1 the
 * gold accent appears as borders and underlines, never as backgrounds.
 */

type Props = {
  className?: string;
};

export function Divider({ className }: Props): JSX.Element {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`h-px w-full bg-lumen-gold/30 ${className ?? ""}`}
    />
  );
}