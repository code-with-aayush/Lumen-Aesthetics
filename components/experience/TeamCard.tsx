/**
 * TeamCard — single provider card on /experience (PRD §8.4).
 *
 * Editorial silhouette placeholder on top (matches the Hero portrait
 * aesthetic so the page feels cohesive), then name in Cormorant italic,
 * credentials line in DM Sans uppercase muted, and a 2–3 sentence bio.
 *
 * Server component — no interactivity needed. The card has a thin
 * gold-on-hover border accent to match the rest of the site, no movement.
 */

import Image from "next/image";

type Props = {
  name: string;
  credentials: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
};

export function TeamCard({
  name,
  credentials,
  bio,
  imageSrc,
  imageAlt,
}: Props): JSX.Element {
  return (
    <article className="group flex flex-col border border-lumen-border bg-lumen-black/40 transition-all duration-500 hover:border-lumen-gold hover:shadow-[0_0_20px_rgba(184,151,74,0.12)]">
      {/* Editorial silhouette — 3:4 aspect matches Hero. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 p-8 md:p-10">
        <p className="font-body text-[10px] uppercase tracking-widest text-lumen-gold">
          {credentials}
        </p>
        <h3 className="font-display text-3xl font-light italic leading-tight text-lumen-offwhite md:text-4xl">
          {name}
        </h3>
        <p className="font-body text-base font-light leading-relaxed text-lumen-muted">
          {bio}
        </p>
      </div>
    </article>
  );
}
