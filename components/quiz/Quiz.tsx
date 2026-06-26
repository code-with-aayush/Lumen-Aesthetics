/**
 * Quiz — the main state machine for /quiz.
 *
 * Phase model:
 *   questions   -> user is answering Q1..Q5
 *   loading     -> POST in flight, displayed for min 2s
 *   leadCapture -> optional name + email (skippable)
 *   results     -> 2-3 treatment cards + book CTA
 *
 * Per PRD §6.1: questions and answer options are verbatim from the PRD. The
 * order here is the source of truth — do not duplicate it elsewhere.
 *
 * Per PRD §5.6: white (#FFFFFF) page background is a deliberate contrast break
 * from the dark site.
 *
 * A4 wiring: error path. If the POST fails (network or non-2xx), we still
 * show results by calling the in-process fallback directly — never block the
 * user from seeing recommendations.
 */

"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { QuizLeadCapture, type LeadPayload } from "@/components/quiz/QuizLeadCapture";
import { QuizLoading } from "@/components/quiz/QuizLoading";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizQuestion, type QuizOption } from "@/components/quiz/QuizQuestion";
import { QuizResults, type Treatment } from "@/components/quiz/QuizResults";

export type Answers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

type Phase = "questions" | "loading" | "leadCapture" | "results";

const MIN_LOADING_MS = 2_000;

const QUESTIONS: ReadonlyArray<{
  number: number;
  question: string;
  options: readonly QuizOption[];
}> = [
  {
    number: 1,
    question: "What's your primary skin concern right now?",
    options: [
      { value: "Fine lines & wrinkles", label: "Fine lines & wrinkles" },
      { value: "Loss of volume", label: "Loss of volume" },
      { value: "Skin texture & tone", label: "Skin texture & tone" },
      { value: "Unwanted hair", label: "Unwanted hair" },
      { value: "Body contouring", label: "Body contouring" },
    ],
  },
  {
    number: 2,
    question: "How would you describe your skin type?",
    options: [
      { value: "Normal", label: "Normal" },
      { value: "Dry", label: "Dry" },
      { value: "Oily", label: "Oily" },
      { value: "Combination", label: "Combination" },
      { value: "Sensitive", label: "Sensitive" },
    ],
  },
  {
    number: 3,
    question: "What's your biggest hesitation about treatment?",
    options: [
      { value: "Looking unnatural", label: "Looking unnatural" },
      { value: "Recovery time", label: "Recovery time" },
      { value: "Cost", label: "Cost" },
      { value: "Not sure what I need", label: "Not sure what I need" },
      { value: "I have no hesitations", label: "I have no hesitations" },
    ],
  },
  {
    number: 4,
    question: "What kind of results timeline works for you?",
    options: [
      { value: "Immediate (same day)", label: "Immediate (same day)" },
      { value: "Short-term (1-2 weeks)", label: "Short-term (1-2 weeks)" },
      { value: "Gradual (1-3 months)", label: "Gradual (1-3 months)" },
      { value: "Long-term investment", label: "Long-term investment" },
    ],
  },
  {
    number: 5,
    question: "Have you had aesthetic treatments before?",
    options: [
      { value: "Yes, regularly", label: "Yes, regularly" },
      { value: "Yes, a few times", label: "Yes, a few times" },
      { value: "Once or twice", label: "Once or twice" },
      { value: "Never, this is my first time", label: "Never, this is my first time" },
    ],
  },
] as const;

const QUESTION_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export function Quiz(): JSX.Element {
  const [phase, setPhase] = useState<Phase>("questions");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Guard against double-firing the min-loading delay if the user is unusually
  // fast. Refs survive renders without triggering re-renders.
  const loadingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const fetchResults = useCallback(
    async (payload: { answers: Answers; lead?: LeadPayload }): Promise<void> => {
      setSubmitting(true);
      const startedAt = Date.now();
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // Server returned 4xx/5xx. Don't block the user — render fallback.
          setTreatments(getClientFallback(payload.answers.q1));
          return;
        }

        const data = (await res.json()) as {
          treatments?: Treatment[];
          meta?: { fallback?: boolean };
        };

        if (!data.treatments || data.treatments.length === 0) {
          setTreatments(getClientFallback(payload.answers.q1));
          return;
        }

        setTreatments(data.treatments);
      } catch {
        // Network failure or malformed JSON. Fall back client-side so the
        // user still sees plausible recommendations.
        setTreatments(getClientFallback(payload.answers.q1));
      } finally {
        // Enforce the minimum 2s loading display, even if the API was faster.
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, MIN_LOADING_MS - elapsed);
        if (loadingTimerRef.current !== null) {
          window.clearTimeout(loadingTimerRef.current);
        }
        loadingTimerRef.current = window.setTimeout(() => {
          loadingTimerRef.current = null;
          setSubmitting(false);
          setPhase("results");
        }, wait);
      }
    },
    [],
  );

  const handleAnswer = useCallback(
    (value: string) => {
      const key = QUESTION_KEYS[currentQuestion];
      if (!key) return;

      setAnswers((prev) => {
        const updated = { ...prev, [key]: value };

        // After updating, decide whether to advance to the next question or
        // transition out of the questions phase.
        const next = currentQuestion + 1;
        if (next < QUESTIONS.length) {
          setCurrentQuestion(next);
        } else {
          // Move into the loading phase. The loading screen shows for at
          // least 2 seconds; meanwhile we POST /api/quiz (no lead yet —
          // user hasn't seen the capture form).
          setPhase("loading");
          void fetchResults({ answers: updated });
        }

        return updated;
      });
    },
    [currentQuestion, fetchResults],
  );

  const handleLeadSubmit = useCallback(
    (lead: LeadPayload) => {
      if (submitting) return;
      // Re-enter loading so the lead submit also sees the 2s minimum.
      setPhase("loading");
      void fetchResults({ answers, lead });
    },
    [answers, fetchResults, submitting],
  );

  const handleLeadSkip = useCallback(() => {
    if (submitting) return;
    setPhase("loading");
    void fetchResults({ answers });
  }, [answers, fetchResults, submitting]);

  const active = QUESTIONS[currentQuestion];

  return (
    <main className="min-h-screen bg-white text-lumen-black flex flex-col">
      <QuizProgress current={Math.min(currentQuestion, QUESTIONS.length)} />

      <div className="flex-1 flex items-center justify-center py-24">
        <AnimatePresence mode="wait">
          {phase === "questions" && active ? (
            <QuizQuestion
              key={`q-${active.number}`}
              number={active.number}
              question={active.question}
              options={active.options}
              selectedValue={
                currentQuestion >= 0 && currentQuestion < QUESTION_KEYS.length
                  ? answers[QUESTION_KEYS[currentQuestion] ?? "q1"] || undefined
                  : undefined
              }
              onAnswer={handleAnswer}
            />
          ) : phase === "loading" ? (
            <QuizLoading key="loading" />
          ) : phase === "leadCapture" ? (
            <QuizLeadCapture
              key="lead-capture"
              onSubmit={handleLeadSubmit}
              onSkip={handleLeadSkip}
              disabled={submitting}
            />
          ) : phase === "results" && treatments ? (
            <QuizResults key="results" treatments={treatments} />
          ) : null}
        </AnimatePresence>
      </div>

      <footer className="py-8 text-center">
        <p className="text-xs uppercase tracking-wider text-lumen-muted">
          Lumen Aesthetics · Skin Quiz
        </p>
      </footer>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Client-side fallback (mirrors lib/quiz-fallback.ts semantics).
//
// The server already returns a fallback on provider failure, but if the
// network itself fails we still want the user to see plausible recommendations
// instead of an error. Kept inline (not imported) to avoid bundling the
// server-only module into the client. Per the plan, the canonical table lives
// in lib/quiz-fallback.ts; this is a parallel minimal copy used only on the
// unhappy path. A future task could extract this to a shared `lib/` module.
// ---------------------------------------------------------------------------

function getClientFallback(q1: string): Treatment[] {
  switch (q1) {
    case "Loss of volume":
      return [
        {
          name: "Injectables",
          tagline: "Structure, restored.",
          description:
            "Hyaluronic acid fillers placed with anatomical precision to restore volume in cheeks, temples, and under-eyes.",
          why: "Volume loss is a structural problem — fillers are the most direct clinical answer.",
          timeline: "Immediate result, lasts 9–18 months.",
          priceFrom: "Fillers from $750/syringe",
        },
        {
          name: "RF Microneedling",
          tagline: "Skin quality, rebuilt.",
          description:
            "Stimulates collagen and elastin to firm lax skin that often accompanies volume loss.",
          why: "Addresses the skin-quality dimension that fillers alone cannot reach.",
          timeline: "Gradual, 1–3 months.",
          priceFrom: "From $800/session",
        },
        {
          name: "Skin Optimisation",
          tagline: "Daily support, clinically selected.",
          description:
            "Custom protocol designed to support dermal health alongside in-clinic work.",
          why: "Sustains volume-restoration results by maintaining skin integrity over time.",
          timeline: "Monthly.",
          priceFrom: "From $275/session",
        },
      ];
    case "Skin texture & tone":
      return [
        {
          name: "Laser Resurfacing",
          tagline: "Pigmentation, refined.",
          description:
            "Medical-grade laser protocols for pigmentation, texture, sun damage, and tone. Calibrated per skin type.",
          why: "The most direct intervention for uneven texture and tone. Not a one-setting-fits-all approach.",
          timeline: "Visible in 1–2 weeks, full effect over 3 months.",
          priceFrom: "From $350/session",
        },
        {
          name: "RF Microneedling",
          tagline: "Texture, rebuilt.",
          description:
            "Stimulates dermal remodelling for visible texture improvement and scar revision.",
          why: "Works at a structural level that topical regimens cannot reach.",
          timeline: "Gradual, 1–3 months.",
          priceFrom: "From $800/session",
        },
        {
          name: "Skin Optimisation",
          tagline: "Your protocol, written for your skin.",
          description:
            "Bespoke programme of medical-grade facials and peels, recalibrated as your skin changes.",
          why: "Maintains and extends the gains from in-clinic resurfacing work.",
          timeline: "Monthly.",
          priceFrom: "From $275/session",
        },
      ];
    case "Unwanted hair":
      return [
        {
          name: "Laser Hair Removal",
          tagline: "Lasting reduction, clinically calibrated.",
          description:
            "Medical-grade laser protocols calibrated to your skin and hair type for safe, lasting hair reduction.",
          why: "The clinical standard for lasting hair reduction — calibrated to your skin and hair, not a one-setting-fits-all approach.",
          timeline: "Series of 6–8 sessions, 4–6 weeks apart.",
          priceFrom: "From $350/session",
        },
        {
          name: "Skin Optimisation",
          tagline: "Skin between sessions.",
          description:
            "Medical-grade skincare to maintain skin health between laser sessions and reduce post-treatment reactivity.",
          why: "Healthy skin responds better to laser and recovers faster between sessions.",
          timeline: "Ongoing.",
          priceFrom: "From $275/session",
        },
        {
          name: "RF Microneedling",
          tagline: "Texture refinement, if needed.",
          description:
            "For residual texture concerns like ingrown-hair scarring once hair reduction is underway.",
          why: "Addresses the secondary concern that often follows long-term hair removal — scarring or textural change.",
          timeline: "Gradual, 1–3 months.",
          priceFrom: "From $800/session",
        },
      ];
    case "Body contouring":
      return [
        {
          name: "Body Sculpting",
          tagline: "Stubborn areas, clinically addressed.",
          description:
            "Non-surgical body contouring with medical-grade technology for stubborn fat and skin laxity.",
          why: "The most direct non-surgical intervention for areas that don't respond to diet and exercise.",
          timeline: "Visible in 8–12 weeks as the body clears treated fat.",
          priceFrom: "From $1,200/session",
        },
        {
          name: "RF Microneedling",
          tagline: "Skin quality, body-wide.",
          description:
            "Radiofrequency microneedling for skin tightening on body areas post-contouring or weight loss.",
          why: "Addresses skin laxity that often follows fat reduction — completes the result.",
          timeline: "Gradual, 1–3 months.",
          priceFrom: "From $800/session",
        },
        {
          name: "Skin Optimisation",
          tagline: "Whole-body protocol.",
          description:
            "Skincare protocols designed to support in-clinic body work and maintain skin integrity.",
          why: "Sustains results between in-clinic sessions with at-home clinical-grade support.",
          timeline: "Monthly.",
          priceFrom: "From $275/session",
        },
      ];
    case "Fine lines & wrinkles":
    default:
      return [
        {
          name: "Injectables",
          tagline: "Quietly refreshed, never frozen.",
          description:
            "Botox, Dysport, and dermal fillers administered with clinical precision. Conservative dosing, conservative outcomes.",
          why: "The most clinically effective route to softening expression lines while preserving facial mobility.",
          timeline: "Visible in 3–7 days, full effect at 14 days.",
          priceFrom: "From $14/unit Botox · Fillers from $750/syringe",
        },
        {
          name: "RF Microneedling",
          tagline: "Collagen, rebuilt from within.",
          description:
            "Radiofrequency microneedling for skin tightening and collagen induction. Builds structural improvement over time.",
          why: "Pairs with injectables to address skin quality alongside lines — a more complete result than either alone.",
          timeline: "Gradual improvement over 1–3 months.",
          priceFrom: "From $800/session",
        },
        {
          name: "Skin Optimisation",
          tagline: "Your daily protocol, recalibrated.",
          description:
            "Medical-grade facials, peels, and bespoke skin programmes built around your skin biology — not a menu.",
          why: "Pre- and post-injectable skin health extends the life of every treatment you invest in.",
          timeline: "Ongoing — monthly protocol.",
          priceFrom: "From $275/session",
        },
      ];
  }
}