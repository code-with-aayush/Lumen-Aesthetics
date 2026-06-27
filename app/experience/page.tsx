/**
 * /experience — The Lumen Experience (PRD §5.3, §8.4).
 *
 * Five sections in order:
 *   1. Hero — small eyebrow + Cormorant italic headline "Medicine, considered." + subhead.
 *   2. Philosophy — clinic story + medical-director credentials (2 paragraphs).
 *   3. The Process — 4 numbered steps: Consultation → Assessment → Treatment Plan → Treatment & Follow-up.
 *   4. Our Standards — 6 credentials grid.
 *   5. Team — 2 provider cards (Elena Vasquez, James Whitfield).
 *
 * Copy is pasted from PRD §8.4 verbatim. Voice is restrained, clinical-
 * but-warm, matching the homepage philosophy and testimonials.
 *
 * Server component — no client state needed. The SectionWrapper fades
 * each section in on scroll using the project's mandated 700ms /
 * [0.16, 1, 0.3, 1] ease.
 */

import type { Metadata } from "next";

import { ProcessStep } from "@/components/experience/ProcessStep";
import { StandardItem } from "@/components/experience/StandardItem";
import { TeamCard } from "@/components/experience/TeamCard";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const metadata: Metadata = {
  title: "The Experience · Lumen Aesthetics",
  description:
    "Medicine, considered. Lumen Aesthetics was founded on a single principle: that aesthetic medicine should be practised with the rigour, discretion, and continuity of any other medical specialty.",
};

// ---------------------------------------------------------------------------
// Copy — verbatim from PRD §8.4
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation",
    body: "A 45-minute assessment with your dedicated provider. We review your medical history, your goals, and — just as importantly — what you don't want.",
  },
  {
    number: "02",
    title: "Assessment",
    body: "We map your skin and facial structure in stillness, photograph under consistent light, and document baseline so we can measure what changes — and what doesn't.",
  },
  {
    number: "03",
    title: "Treatment Plan",
    body: "A bespoke protocol, in writing, with clinical rationale for every step. No surprises, no menu, no upsell.",
  },
  {
    number: "04",
    title: "Treatment & Follow-up",
    body: "Every treatment is performed by the provider who designed your plan. A two-week follow-up is built in — results reviewed, plans adjusted.",
  },
] as const;

const STANDARDS = [
  {
    title: "Board-Certified Providers",
    description:
      "Every treatment is performed by a board-certified clinician, never delegated to a technician.",
  },
  {
    title: "FDA-Approved Treatments Only",
    description:
      "We use only FDA-approved devices and products — no off-label shortcuts, no grey-market imports.",
  },
  {
    title: "Medical-Grade Products",
    description:
      "Retail-grade skincare has its place; we keep it out of the treatment room. Everything we apply is medical-grade.",
  },
  {
    title: "Same Provider Every Visit",
    description:
      "Continuity of care isn't a feature — it's the baseline. Your provider knows your face, your history, your hesitations.",
  },
  {
    title: "HIPAA-Compliant Records",
    description:
      "Patient records are encrypted, access-controlled, and never shared without explicit consent.",
  },
  {
    title: "Discretion Guaranteed",
    description:
      "Private entrance, private waiting, private exit. Your visit is your business, and never ours.",
  },
] as const;

const TEAM = [
  {
    name: "Elena Vasquez, MD",
    credentials: "Medical Director & Founder",
    bio: "Board-certified in dermatology with fellowship training in aesthetic medicine at Mount Sinai. Dr. Vasquez sees every new patient personally and oversees the clinic's clinical protocols.",
    imageSrc: "/images/team-elena.png",
    imageAlt: "Dr. Elena Vasquez — Medical Director & Founder",
  },
  {
    name: "James Whitfield, NP-C",
    credentials: "Lead Aesthetic Provider",
    bio: "A decade of experience in advanced injectables and laser medicine. James is known for the kind of results that make patients protective of their secret — and for a chairside manner that makes the work feel calm.",
    imageSrc: "/images/team-james.png",
    imageAlt: "James Whitfield — Lead Aesthetic Provider",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ExperiencePage(): JSX.Element {
  return (
    <main className="bg-lumen-black text-lumen-offwhite">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Hero                                                            */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-lumen-black pt-32 md:pt-40">
        <div className="mx-auto max-w-content px-6 pb-20 md:pb-28">
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-lumen-gold">
            The Experience
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-light italic leading-[1.05] text-lumen-offwhite sm:text-6xl md:text-7xl lg:text-[88px]">
            Medicine, considered.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
            Medicine without compromise. Aesthetics without excess. The
            principles that shape every consultation, every protocol, and
            every result at Lumen.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Philosophy — clinic story                                       */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-dark">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <h2 className="font-display text-3xl font-light italic leading-tight text-lumen-offwhite md:text-4xl">
                Founded on a single principle.
              </h2>
            </div>
            <div className="space-y-6 font-body text-base font-light leading-relaxed text-lumen-offwhite/85 md:text-lg">
              <p>
                Lumen was founded on a single principle: that aesthetic
                medicine should be practised with the same rigour, discretion,
                and continuity of care as any other medical specialty. We
                treat patients, not procedures — and we treat them the way
                we&apos;d want to be treated ourselves.
              </p>
              <p>
                Too many clinics treat patients as transactions — a different
                injector every visit, protocols selected from a menu rather
                than designed around the individual. We built Lumen to be the
                opposite of that. Every patient is seen by the same provider,
                every visit. Every protocol is written down. Every result is
                reviewed in person.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ----------------------------------------------------------------- */}
      {/* 3. The Process — 4 numbered steps                                  */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="mb-16">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
              The Process
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              How it works.
            </h2>
            <p className="mt-6 max-w-xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
              Four steps, the same each visit. No shortcuts, no surprises,
              no different face in the chair from one appointment to the
              next.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
            {PROCESS_STEPS.map((step) => (
              <li key={step.number}>
                <ProcessStep
                  number={step.number}
                  title={step.title}
                  body={step.body}
                />
              </li>
            ))}
          </ol>
        </div>
      </SectionWrapper>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Our Standards — 6 credentials grid                              */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-dark">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="mb-16">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
              Our Standards
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              The non-negotiables.
            </h2>
            <p className="mt-6 max-w-xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
              Six commitments we hold ourselves to, every visit, every
              patient, no exceptions.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {STANDARDS.map((standard) => (
              <li key={standard.title}>
                <StandardItem
                  title={standard.title}
                  description={standard.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Team — 2 provider cards                                          */}
      {/* ----------------------------------------------------------------- */}
      <SectionWrapper className="bg-lumen-black">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="mb-16">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
              The Team
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-light italic leading-tight text-lumen-offwhite md:text-5xl">
              The people behind your results.
            </h2>
            <p className="mt-6 max-w-xl font-body text-base font-light leading-relaxed text-lumen-muted md:text-lg">
              You will see the same two faces, every visit. That isn&apos;t
              a marketing line — it&apos;s how the clinic is built.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {TEAM.map((member) => (
              <TeamCard
                key={member.name}
                name={member.name}
                credentials={member.credentials}
                bio={member.bio}
                imageSrc={member.imageSrc}
                imageAlt={member.imageAlt}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
