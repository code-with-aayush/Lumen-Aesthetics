/**
 * Contact API route — POST /api/contact
 *
 * Accepts a contact-form submission ({ name, email, message }), validates
 * with Zod, and dispatches to a pluggable email backend.
 *
 * Security posture (per CLAUDE.md §5):
 *   - Request body validated with Zod; unknown fields rejected.
 *   - Per-string length caps prevent payload-stuffing abuse.
 *   - Email format enforced via Zod's `.email()`.
 *   - RESEND_API_KEY (if used) is server-side only. Never logged.
 *   - Provider errors never leak to the client. Generic 500 on any throw.
 *   - No stack traces, no payload echoes in client response.
 *
 * Email backend (DEMO MODE):
 *   This is a portfolio demo project. We do NOT call Resend in this build
 *   because no real Resend API key is configured. The submission is
 *   logged to the server console with the redacted email (local part
 *   masked) and a success response is returned.
 *
 *   To wire Resend for real, replace `sendContactEmail()` with the Resend
 *   SDK call (see commented stub below). The function signature, error
 *   shape, and route contract are designed so the swap is one function
 *   change.
 *
 *   Documented in README under "Wiring Resend (optional)".
 */

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const RequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(120, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(254, "Email is too long")
      .email("Please enter a valid email address"),
    message: z
      .string()
      .trim()
      .min(10, "Please write at least 10 characters")
      .max(2000, "Message is too long"),
  })
  .strict();

type ContactSubmission = z.infer<typeof RequestSchema>;

// ---------------------------------------------------------------------------
// Email backend (demo)
// ---------------------------------------------------------------------------

type SendResult =
  | { ok: true; category: "delivered" | "logged" }
  | { ok: false; category: "auth" | "rate_limit" | "validation" | "network" | "unknown" };

/**
 * sendContactEmail — pluggable backend.
 *
 * DEMO: log to server console with redacted email. Returns "logged" so the
 * client gets a success response.
 *
 * To enable Resend, replace the body with:
 *
 *   import { Resend } from "resend";
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   const { error } = await resend.emails.send({
 *     from: "Lumen Aesthetics <hello@lumenaesthetics.com>",
 *     to: ["hello@lumenaesthetics.com"],
 *     replyTo: submission.email,
 *     subject: `New enquiry from ${submission.name}`,
 *     text: `From: ${submission.name} <${submission.email}>\n\n${submission.message}`,
 *   });
 *   if (error) return { ok: false, category: classifyError(error) };
 *   return { ok: true, category: "delivered" };
 */
async function sendContactEmail(
  submission: ContactSubmission,
): Promise<SendResult> {
  // Demo mode: log + acknowledge. Never log the full email address — mask
  // the local part so logs can't be scraped for leads.
  const masked = maskEmail(submission.email);
  // eslint-disable-next-line no-console -- intentional server-side log of demo contact submission
  console.info("[contact] demo submission received", {
    name: submission.name,
    email: masked,
    messageLength: submission.message.length,
  });
  return { ok: true, category: "logged" };
}

/**
 * Mask an email address for safe logging: "alice@example.com" → "a***@example.com".
 * Keeps the domain (useful for debugging) but hides the local part.
 */
function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  return `${local[0] ?? "*"}***${domain}`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Parse body.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  // 2. Validate with Zod.
  const parsed = RequestSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json(
      { error: first },
      { status: 400 },
    );
  }

  // 3. Dispatch to email backend.
  try {
    const result = await sendContactEmail(parsed.data);
    if (!result.ok) {
      // Backend rejected. Don't echo the category — keep client response generic.
      return NextResponse.json(
        { error: "We couldn't send your message right now. Please try again or call us at (212) 555-0847." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    // Any throw from the backend: generic 500, no stack trace leakage.
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again or call us at (212) 555-0847." },
      { status: 500 },
    );
  }
}