/**
 * Header — fixed top bar with scroll-driven background reveal.
 *
 * Per PRD §7.1: transparent at top of page, fades to bg `#0A0A0A` + a thin
 * gold bottom border after 80px of scroll. All transitions duration-500.
 *
 * The transparent-at-top effect is only applied on `/` (the dark homepage
 * hero) — every other page (notably the white-bg `/quiz`) renders the
 * header with a solid background always, so the gold wordmark and nav
 * controls stay legible over any background.
 *
 * Mobile (<768px): hamburger icon opens a full-screen dark overlay with
 * Cormorant 48px nav links, staggered fade-in. Body scroll is locked while
 * the menu is open.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/shared/Button";

const NAV_LINKS = [
  { label: "Treatments", href: "/treatments" },
  { label: "Experience", href: "/experience" },
  { label: "Memberships", href: "/memberships" },
  { label: "Skin Quiz", href: "/quiz" },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header(): JSX.Element {
  const pathname = usePathname();
  // Transparent-on-scroll effect only on the dark homepage hero. On other
  // pages (white /quiz, etc) the header is always solid so links remain
  // legible regardless of the underlying page background.
  const transparentAtTop = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  // Map scroll position to a 0..1 opacity for the dark background.
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  // Same range drives the gold bottom border's opacity.
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.5]);

  // Lock body scroll while the mobile menu is open so the page behind
  // doesn't drift while the user is choosing a destination.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // If route changes (user taps a link in the mobile menu), close the menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Compose the background colour from a CSS variable so we can animate
  // the alpha via useTransform. On non-home pages the alpha is locked at 1.
  const headerBg = useTransform(bgOpacity, (o) =>
    transparentAtTop ? `rgba(10, 10, 10, ${o})` : "rgba(10, 10, 10, 1)",
  );

  return (
    <>
      <motion.header
        style={{ backgroundColor: headerBg }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <motion.div
          aria-hidden
          style={{ opacity: borderOpacity }}
          className="absolute inset-x-0 bottom-0 h-px bg-lumen-gold"
        />

        <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-baseline gap-3"
            aria-label="Lumen Aesthetics — home"
          >
            <span className="font-body text-sm uppercase tracking-widest text-lumen-offwhite">
              LUMEN
            </span>
            <span className="h-3 w-px bg-lumen-gold/60" aria-hidden />
            <span className="font-body text-xs uppercase tracking-widest text-lumen-muted transition-colors duration-500 hover:text-lumen-offwhite">
              AESTHETICS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs uppercase tracking-wider text-lumen-muted transition-colors duration-500 hover:text-lumen-offwhite"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button href="/book" variant="outline">
              Book Now
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu overlay */}
      <motion.div
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-0 z-50 bg-lumen-black md:hidden"
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-end px-6">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <motion.nav
            className="flex flex-1 flex-col items-center justify-center gap-8"
            aria-label="Mobile primary"
            variants={{
              open: {
                transition: { staggerChildren: 0.08, delayChildren: 0.15 },
              },
              closed: {
                transition: { staggerChildren: 0.04, staggerDirection: -1 },
              },
            }}
          >
            {[...NAV_LINKS, { label: "Book", href: "/book" }].map((link) => (
              <motion.div
                key={link.href}
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 10 },
                }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Link
                  href={link.href}
                  className="font-display text-4xl italic text-lumen-offwhite transition-colors duration-500 hover:text-lumen-gold"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </motion.div>
    </>
  );
}