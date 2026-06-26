/**
 * Quiz — the main state machine for /quiz.
 *
 * Owns: currentQuestion (0..4), answers (q1..q5), and post-quiz placeholders
 * for A4 (isLoading, showLeadCapture, results). A3 only uses currentQuestion
 * and answers; the rest are stubbed so A4 can wire them up without changing
 * this file's structure.
 *
 * Per PRD §6.1: questions and answer options are verbatim from the PRD. The
 * order here is the source of truth — do not duplicate it elsewhere.
 *
 * Per PRD §5.6: white (#FFFFFF) page background is a deliberate contrast break
 * from the dark site.
 */

"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizQuestion, type QuizOption } from "@/components/quiz/QuizQuestion";

export type Answers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

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
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const handleAnswer = useCallback((value: string) => {
    const key = QUESTION_KEYS[currentQuestion];
    if (!key) return; // out-of-range guard; unreachable given the state machine
    setAnswers((prev) => ({ ...prev, [key]: value }));

    // Advance to the next question. After Q5, A3 stops with a console.log of
    // the collected answers — A4 replaces this with the loading + lead
    // capture + results flow.
    const next = currentQuestion + 1;
    if (next < QUESTIONS.length) {
      setCurrentQuestion(next);
    } else {
      // A3 spec: log the answers object after Q5. A4 replaces this with the
      // loading + lead capture + results flow.
      // eslint-disable-next-line no-console -- intentional per A3 spec.
      console.log("[quiz] answers:", { ...answers, [key]: value });
    }
  }, [currentQuestion, answers]);

  const active = QUESTIONS[currentQuestion];

  return (
    <main className="min-h-screen bg-white text-lumen-black flex flex-col">
      <QuizProgress current={currentQuestion} />

      <div className="flex-1 flex items-center justify-center py-24">
        {active ? (
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        ) : null}
      </div>

      {/* Reserve a calm footer line — the page is intentionally quiet so the
          question is the focus. A4 will replace this with the lead capture. */}
      <footer className="py-8 text-center">
        <p className="text-xs uppercase tracking-wider text-lumen-muted">
          Lumen Aesthetics · Skin Quiz
        </p>
      </footer>
    </main>
  );
}