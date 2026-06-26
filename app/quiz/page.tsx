import type { Metadata } from "next";

import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Skin Quiz · Lumen Aesthetics",
  description:
    "Answer five questions and our AI consultant will match you with the treatments best suited to your skin, your lifestyle, and your timeline. Takes 60 seconds.",
};

/**
 * /quiz — AI treatment quiz landing.
 *
 * Server component shell. The interactive state machine lives in <Quiz/>.
 * Per PRD §5.6: white background is a deliberate contrast break from the
 * dark site.
 */

export default function QuizPage(): JSX.Element {
  return <Quiz />;
}