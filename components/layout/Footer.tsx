/**
 * Footer — 4-column dark footer with clinic identity + address + copyright.
 *
 * Per PRD §7.2:
 *   Column 1: wordmark + tagline + Instagram link
 *   Column 2: Quick Links (Treatments, Experience, Memberships, Skin Quiz, Book)
 *   Column 3: Treatments list (full clinic menu)
 *   Column 4: Address (740 Park Avenue, NYC), phone, email, hours
 *   Bottom bar: copyright + "Portfolio demonstration site"
 *
 * Stacks to a single column under md breakpoint.
 */

import Link from "next/link";
import { Instagram } from "lucide-react";

const QUICK_LINKS = [
  { label: "Treatments", href: "/treatments" },
  { label: "Experience", href: "/experience" },
  { label: "Memberships", href: "/memberships" },
  { label: "Skin Quiz", href: "/quiz" },
  { label: "Book", href: "/book" },
] as const;

const TREATMENTS = [
  "Injectables",
  "Laser Resurfacing",
  "RF Microneedling",
  "Body Sculpting",
  "Skin Optimisation",
  "Laser Hair Removal",
] as const;

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lumen-black border-t border-lumen-border">
      <div className="mx-auto max-w-content px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          {/* Column 1 — Identity */}
          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-body text-sm uppercase tracking-widest text-lumen-offwhite">
                LUMEN
              </span>
              <span className="h-3 w-px bg-lumen-gold/60" aria-hidden />
              <span className="font-body text-xs uppercase tracking-widest text-lumen-muted">
                AESTHETICS
              </span>
            </div>
            <p className="font-display text-xl italic text-lumen-offwhite mb-8 leading-snug">
              Where science meets artistry.
            </p>
            <a
              href="https://instagram.com/lumenaesthetics"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center border border-lumen-border text-lumen-muted transition-all duration-500 hover:border-lumen-gold hover:text-lumen-gold"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </a>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-lumen-muted mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-lumen-offwhite/80 transition-colors duration-500 hover:text-lumen-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Treatments */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-lumen-muted mb-6">
              Treatments
            </h3>
            <ul className="space-y-3">
              {TREATMENTS.map((t) => (
                <li
                  key={t}
                  className="font-body text-sm text-lumen-offwhite/80"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Visit */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-lumen-muted mb-6">
              Visit
            </h3>
            <address className="not-italic font-body text-sm text-lumen-offwhite/80 space-y-4">
              <p>
                740 Park Avenue
                <br />
                New York, NY 10021
              </p>
              <p>
                <a
                  href="tel:+12125550847"
                  className="transition-colors duration-500 hover:text-lumen-gold"
                >
                  (212) 555-0847
                </a>
              </p>
              <p>
                <a
                  href="mailto:hello@lumenaesthetics.com"
                  className="transition-colors duration-500 hover:text-lumen-gold"
                >
                  hello@lumenaesthetics.com
                </a>
              </p>
              <p className="text-lumen-muted text-xs leading-relaxed pt-1">
                Mon–Sat 9am–7pm
                <br />
                Sun by arrangement
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-lumen-border flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-lumen-muted">
            © {year} Lumen Aesthetics. All rights reserved.
          </p>
          <p className="font-body text-xs text-lumen-muted">
            Portfolio demonstration site.
          </p>
        </div>
      </div>
    </footer>
  );
}