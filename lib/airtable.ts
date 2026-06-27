/**
 * Airtable lead-capture helper.
 *
 * Posts a quiz lead to an Airtable base. Called from app/api/quiz/route.ts
 * only when the request includes a `lead` payload (i.e. the user submitted
 * the form rather than skipping it).
 *
 * Design rules (per CLAUDE.md §5):
 *   - API key is read from env. Never logged.
 *   - Never throw to caller — caller wraps in try/catch and logs.
 *   - Sanitised log on failure (category tag, never raw provider text).
 *
 * Field mapping (per PRD §11):
 *   Name, Email, Q1, Q2, Q3, Q4, Q5, Timestamp
 *
 * REQUIRED AIRTABLE TABLE SCHEMA — the operator must create these fields
 * exactly in their base before Airtable will accept rows. Airtable returns
 * HTTP 422 on any mismatch and the lead is silently dropped. This is the
 * only configuration the operator needs to do for the integration.
 *
 *   - Name        : Single line text
 *   - Email       : Email
 *   - Q1          : Single line text
 *   - Q2          : Single line text
 *   - Q3          : Single line text
 *   - Q4          : Single line text
 *   - Q5          : Single line text
 *   - Timestamp   : Date (ISO 8601 string — Airtable auto-parses)
 *
 * Behavior when env is unset: this is a no-op that returns `{ skipped: true }`
 * so the route handler can stay agnostic about whether Airtable is
 * configured. The local-dev case is the primary consumer of this branch.
 */

export interface QuizLead {
  name: string;
  email: string;
}

export interface QuizAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

export interface AirtableResult {
  /** True when the row was created. False on any error or when skipped. */
  ok: boolean;
  /** True when no Airtable env was configured and the call was skipped. */
  skipped?: boolean;
  /** Coarse error category for logging. Absent on success/skip. */
  category?: string;
}

const ALLOW_INSECURE_BASE_URL =
  process.env.AIRTABLE_BASE_URL_ALLOW_INSECURE === "true";

export async function postLeadToAirtable(
  lead: QuizLead,
  answers: QuizAnswers,
): Promise<AirtableResult> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "QuizLeads";

  // No credentials configured — skip silently. This is the expected local-dev
  // case and is not an error. Caller decides whether to log this skip.
  if (!apiKey || !baseId) {
    return { ok: false, skipped: true };
  }

  // URL construction with strict host check (Codex review: prior version had a
  // bypass for AIRTABLE_BASE_URL which defeated its own URL validation —
  // medium-severity SSRF hole that the env override made trivial). We now:
  //   - default to https://api.airtable.com/v0,
  //   - accept AIRTABLE_BASE_URL only when its URL parses to that exact host,
  //   - or accept any URL with an explicit AIRTABLE_BASE_URL_ALLOW_INSECURE=true
  //     opt-in (warned loudly so it cannot ship to prod by accident).
  const rawBaseUrl =
    process.env.AIRTABLE_BASE_URL ?? "https://api.airtable.com/v0";

  let url: string;
  if (ALLOW_INSECURE_BASE_URL) {
    console.warn(
      "[airtable] AIRTABLE_BASE_URL_ALLOW_INSECURE=true — outbound host check disabled. Never set this in production.",
    );
    url = `${rawBaseUrl.replace(/\/$/, "")}/${baseId}/${encodeURIComponent(tableName)}`;
  } else {
    let parsed: URL;
    try {
      parsed = new URL(rawBaseUrl);
    } catch {
      return { ok: false, category: "config" };
    }
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "api.airtable.com" ||
      !/^\/v\d+\/?$/.test(parsed.pathname)
    ) {
      return { ok: false, category: "config" };
    }
    const base = `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/$/, "")}`;
    url = `${base}/${baseId}/${encodeURIComponent(tableName)}`;
  }

  // Sanitise display name only: collapse CR/LF so multi-line input doesn't
  // split the cell in the operator's Airtable view. Email is left intact —
  // modifying its shape would invalidate the validation we did upstream.
  const fields = {
    Name: lead.name.replace(/[\r\n]+/g, " "),
    Email: lead.email,
    Q1: answers.q1,
    Q2: answers.q2,
    Q3: answers.q3,
    Q4: answers.q4,
    Q5: answers.q5,
    // Airtable auto-parses ISO-8601 for Date fields. The recommended Airtable
    // field type for Timestamp is "Date" with "Include time" + "Use ISO 8601"
    // (so the cell displays as "2026-06-26 20:17"). Operator must create the
    // field as Date — not "Single line text" — or the cell will be empty.
    Timestamp: new Date().toISOString(),
  };

  // Network timeout: 5s. Airtable is usually <1s; anything longer means
  // something is wrong on their end and we shouldn't block the user.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }] }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // 422 is the schema-mismatch signal — Airtable's response body names the
      // offending field in `error.field`. Surface that to the operator log so
      // they can fix their base schema without grepping for raw payloads.
      // Other 4xx/5xx stay generic. We never log the full response body, since
      // it can echo input values back.
      if (res.status === 422) {
        try {
          const errBody = (await res.json()) as {
            error?: { field?: unknown; message?: unknown };
          };
          const field =
            typeof errBody?.error?.field === "string"
              ? errBody.error.field
              : undefined;
          const category = field ? `http_422_field_${field}` : "http_422";
          return { ok: false, category };
        } catch {
          return { ok: false, category: "http_422" };
        }
      }
      return { ok: false, category: `http_${res.status}` };
    }

    return { ok: true };
  } catch (error) {
    // Detect abort by name rather than constructor. Node's built-in fetch
    // surfaces aborts as DOMException, but other runtimes can throw a plain
    // Error with name === "AbortError". Codex review: original check used
    // only DOMException, missing the plain-Error case and miscategorising
    // timeouts as provider_error.
    const name = (error as { name?: unknown })?.name;
    if (name === "AbortError") {
      return { ok: false, category: "timeout" };
    }
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("network") || msg.includes("econnrefused")) {
        return { ok: false, category: "network" };
      }
      return { ok: false, category: "provider_error" };
    }
    return { ok: false, category: "unknown" };
  } finally {
    clearTimeout(timeoutId);
  }
}