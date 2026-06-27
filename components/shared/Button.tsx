/**
 * Polymorphic button. Renders a <Link> when `href` is set, otherwise a
 * <button>. Two variants per PRD §7.1:
 *
 *   outline  — 1px gold border + gold text. Hover fills with gold and flips
 *              text to lumen-black. Used for primary CTAs ("Book Now").
 *   filled   — solid gold bg + lumen-black text. Hover drops to 90% opacity.
 *              Reserved for the strongest action on a given page.
 *
 * All transitions are duration-500 (PRD §2.3: never under 300ms).
 */

"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "outline" | "filled";

const variantStyles: Record<Variant, string> = {
  outline:
    "border border-lumen-gold text-lumen-gold hover:bg-lumen-gold hover:text-lumen-black",
  filled:
    "bg-lumen-gold text-lumen-black hover:opacity-90",
};

const baseStyles =
  "inline-flex items-center justify-center font-body text-xs uppercase tracking-wider transition-all duration-500 px-6 py-3";

type OwnProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

// Next's <Link> accepts `href` and a few intrinsic <a> props; we strip our
// own `variant` / `className` / `children` before spreading.
type LinkProps = OwnProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, keyof OwnProps | "href">;

type BtnProps = OwnProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, keyof OwnProps>;

type Props = LinkProps | BtnProps;

function isLinkProps(p: Props): p is LinkProps {
  return typeof (p as LinkProps).href === "string";
}

export function Button(props: Props): JSX.Element {
  const variant: Variant = props.variant ?? "outline";
  const classes = cn(baseStyles, variantStyles[variant], props.className);

  if (isLinkProps(props)) {
    // `rest` carries href + any Link-specific attributes the caller passed.
    const { variant: _v, className: _c, children, ...rest } = props;
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children, href: _h, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}