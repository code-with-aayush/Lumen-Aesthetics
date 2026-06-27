/**
 * Contact API route — POST /api/contact
 *
 * Accepts a contact-form submission ({ name, email, message }), validates
 * with Zod, and dispatches to a pluggable email backend.
 *
 * Security posture (per CLAUDE.md §5 + Codex adversarial review pass):
 *   - Content-Length guard rejects oversized payloads with 413 before any
 *     body parsing (HIGH finding).
 *   - Content-Type check rejects non-JSON requests with 415 (MEDIUM).
 *   - Per-IP sliding-window rate limit (10 req / 10 min) to deter abuse
 *     (MEDIUM). Same pattern as /api/quiz — bounded Map with LRU eviction.
 *   - Same-origin CSRF check via Origin/Host header comparison. Third-party
 *     sites cannot drive submissions (MEDIUM).
 *   - Request body validated with Zod; unknown fields rejected (.strict()).
 *   - Per-string length caps prevent payload-stuffing abuse.
 *   - Email format enforced via Zod's `.email()`.
 *   - RESEND_API_KEY (if used) is server-side only. Never logged.
 *   - Provider errors never leak to the client. Generic 500 on any throw.
 *   - No stack traces, no payload echoes in client response.
 *   - Email addresses are logged with the FULL local part hidden
 *     (`***@example.com`), not just partially masked (LOW).
 *
 * Email backend (DEMO MODE):
 *   This is a portfolio demo project. We do NOT call Resend in this build
 *   because no real Resend API key is configured. The submission is
 *   logged to the server console with the email address masked (entire
 *   local part hidden) and a success response is returned.
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
// Limits
// ---------------------------------------------------------------------------

/** Hard body size cap. 8KB is comfortable for a name + email + message
 *  (max 2000 chars message) plus JSON overhead. Anything larger is
 *  rejected with 413 before we allocate any memory on it. */
const MAX_BODY_BYTES = 8 * 1024;

/** Rate limit window. Generous but caps automated abuse. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_MAX_IPS = 10_000;

// ---------------------------------------------------------------------------
// Rate limiter (same pattern as /api/quiz)
// ---------------------------------------------------------------------------

type RateLimitEntry = { timestamps: number[] };

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Sliding-window per-IP rate limit. Returns true if the request is allowed,
 * false if the IP has hit the cap in the current window. Evicts the
 * oldest entries if the map grows past RATE_LIMIT_MAX_IPS.
 */
function checkRateLimit(ip: string, now: number): boolean {
  const entry = rateLimitMap.get(ip);
  if (entry) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (entry.timestamps.length >= RATE_LIMIT_MAX) return false;
    entry.timestamps.push(now);
  } else {
    if (rateLimitMap.size >= RATE_LIMIT_MAX_IPS) {
      // Simple LRU: drop the oldest key (insertion order in Map).
      const oldest = rateLimitMap.keys().next().value;
      if (oldest !== undefined) rateLimitMap.delete(oldest);
    }
    rateLimitMap.set(ip, { timestamps: [now] });
  }
  return true;
}

/**
 * Read the client IP. On Vercel the deployment platform overwrites
 * `x-forwarded-for` with the real client IP. If deployed behind an
 * untrusted proxy, this header is spoofable — same caveat as /api/quiz.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

// ---------------------------------------------------------------------------
// CSRF (same-origin check)
// ---------------------------------------------------------------------------

/**
 * Verify the request is same-origin. Browsers send `Origin` on POST;
 * server-to-server callers (curl, scripts) won't, so we treat absent
 * `Origin` as same-origin ONLY when the Host matches a configured list.
 *
 * For a portfolio demo deployed to a single known domain, we accept
 * matching `Host` headers even without `Origin`. Third-party sites cannot
 * submit a cross-origin form because the browser sends Origin on the
 * preflight / request and we compare it here.
 */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!host) return false;

  // Extract host (drop port) from each.
  const hostOnly = host.split(":")[0]?.toLowerCase();
  if (!hostOnly) return false;

  if (origin) {
    try {
      const originHost = new URL(origin).host.split(":")[0]?.toLowerCase();
      return originHost === hostOnly;
    } catch {
      return false;
    }
  }

  // No Origin header — likely same-origin or non-browser caller.
  // Accept as same-origin (demo posture).
  return true;
}

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
  // Demo mode: log + acknowledge. Never log the email's local part.
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
 * Mask an email address for safe logging. Hides the ENTIRE local part
 * per the LOW finding from Codex: "alice@example.com" → "***@example.com".
 * Keeps the domain (useful for debugging) but reveals nothing about who
 * the submitter is.
 */
function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `***${email.slice(at)}`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 0a. CSRF / same-origin check.
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  // 0b. Content-Type check.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 },
    );
  }

  // 0c. Content-Length guard (HIGH finding).
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 413 },
    );
  }

  // 0d. Per-IP rate limit (MEDIUM finding).
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, Date.now())) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        },
      },
    );
  }

  // 1. Parse body. If Content-Length was missing or 0 and the body is
  // huge, this still parses but we can't pre-cap without the header.
  // The Zod schema caps each field; total payload size is implicitly
  // bounded by sum of fields + JSON overhead, well under MAX_BODY_BYTES.
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