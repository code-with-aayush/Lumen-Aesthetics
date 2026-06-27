# Lumen Aesthetics

Portfolio / spec project for a luxury NYC med spa. AI-powered treatment quiz + full marketing site. Cold-luxury aesthetic — dark backgrounds, gold accents, editorial typography.

The second of two sister projects that demonstrate range:
- **Willow & Rose Medical Aesthetics** — warm suburban, friendly, approachable (Austin, TX).
- **Lumen Aesthetics** (this project) — cold luxury, editorial minimalism, aspirational (NYC Upper East Side).

## Tech stack

Next.js 14 App Router · TypeScript (strict) · Tailwind CSS v3 with custom `lumen-*` tokens · Framer Motion · Google Gemini (`gemini-2.5-flash`) · Zod · React Hook Form · lucide-react

## Status

**Portfolio-ready demo.** All 15 planned tasks complete. See `tracking/TASKS.md` for full task log and `tracking/PROJECT_CONTEXT.md` for the architecture decisions.

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage — Hero, ProofStrip, TreatmentsPreview, QuizEntry, Philosophy, Testimonials, MembershipTeaser, FinalCTA |
| `/quiz` | AI Treatment Quiz — 5 questions → Gemini-powered recommendations |
| `/treatments` | 5 full-width treatment sections with clinical detail |
| `/experience` | Clinic story, process, standards, team |
| `/memberships` | 3-tier membership comparison + FAQ accordion |
| `/book` | Booking flow (demo placeholder — see below) |
| `/thank-you` | Post-submission confirmation |
| `/api/quiz` | POST — Gemini quiz endpoint with rate limit + fallback |
| `/api/contact` | POST — contact form handler |

## Local development

```bash
npm install
cp .env.local .env.local.bak   # back up any existing env (if present)
npm run dev
```

Open http://localhost:3000.

`npx tsc --noEmit` runs the strict typecheck. `npx next lint` runs ESLint. Both must pass before any commit.

## Environment variables

A `.env.local` is required for the AI quiz. The site builds and serves without any keys, but features depending on them will degrade gracefully.

| Var | Used for | Required? | Demo behaviour if missing |
|---|---|---|---|
| `GEMINI_API_KEY` | AI treatment quiz | Yes, for live quiz | Falls back to static recommendations from `lib/quiz-fallback.ts` |
| `RESEND_API_KEY` | Contact form email delivery | Optional | Contact submissions are logged to server console with masked email (see `app/api/contact/route.ts`) |
| `AIRTABLE_API_KEY` | Quiz lead capture | Optional | Quiz still works; leads are silently dropped |
| `AIRTABLE_BASE_ID` | Airtable base for leads | Optional | Same as above |
| `AIRTABLE_TABLE_NAME` | Airtable table name | Optional, defaults to `QuizLeads` | Same as above |
| `NEXT_PUBLIC_CAL_NAMESPACE` | Cal.com booking | Optional | Booking page renders a styled placeholder flow (no real embed) |
| `NEXT_PUBLIC_CAL_LINK` | Cal.com booking link | Optional | Same as above |

**Security:** server-side keys (`GEMINI_API_KEY`, `RESEND_API_KEY`, `AIRTABLE_*`) are never exposed to the client. Anything prefixed `NEXT_PUBLIC_` is public and visible in the browser bundle.

`.env*` files are in `.gitignore` before any commit. Never commit keys.

## AI provider notes

This project uses **Google Gemini `gemini-2.5-flash`** (free tier) instead of the Claude model in the original PRD. Rationale documented in `tracking/PROJECT_CONTEXT.md`. The schema-enforced JSON output (`responseMimeType: "application/json"` + `responseSchema`) is strictly more reliable than prompt-only JSON.

### Free-tier caveats

- Per the Gemini API Additional Terms (Dec 18, 2025), prompts and responses on the free tier may be reviewed by humans and used to improve Google products. Quiz answers here are anonymous skin-concern selections — low sensitivity — but disclosed for completeness.
- The free tier is not available for end-users in the EEA, UK, or Switzerland. A paid tier key is required for those regions. (This is a portfolio demo targeted at US visitors — non-issue, flagged for transparency.)
- Per-account rate limits apply; check the AI Studio rate limit dashboard for the exact numbers that apply to your key. The quiz API also enforces a 10 req/min/IP sliding-window rate limit in code, so per-IP abuse is capped regardless of Gemini's per-account ceiling.

## Wiring Resend (optional)

The contact form (`/api/contact`) ships in demo mode: submissions are logged to the server console with the email address's local part masked (`a***@example.com`). To enable real email delivery:

1. Sign up at [resend.com](https://resend.com) and verify your sending domain (e.g. `lumenaesthetics.com`).
2. Add `RESEND_API_KEY` to `.env.local` and to your Vercel project env.
3. Open `app/api/contact/route.ts` and replace the body of `sendContactEmail()` with the Resend SDK call documented in the function's JSDoc. Add `resend` to `package.json` dependencies (`npm install resend`).
4. The route contract (request shape, error handling, success response) is designed so this swap is one function change.

## Booking page (Cal.com)

The `/book` page ships as a styled placeholder flow: service selection → time preference → submit → inline confirmation. No real booking is dispatched.

To wire real Cal.com:
1. Sign up at [cal.com](https://cal.com) and create an event type.
2. Set `NEXT_PUBLIC_CAL_NAMESPACE=your-namespace` and `NEXT_PUBLIC_CAL_LINK=your-event-link` in `.env.local`.
3. Replace `app/book/page.tsx` with a Cal.com embed via `@calcom/embed-react` (install with `npm install @calcom/embed-react`).

## Build for production

```bash
npm run build
npm run start
```

`npm run build` runs the Next.js production build. The strict typecheck and lint should be run first:

```bash
npm run typecheck
npm run lint
```

## Deploying to Vercel

This project is wired for Vercel out of the box.

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new) — Vercel detects Next.js automatically.
3. Set the environment variables listed above in **Project Settings → Environment Variables** for the Production environment.
4. (Optional) Connect a custom domain in **Project Settings → Domains**.
5. Deploy.

The repo includes a `vercel.json` with build configuration; no Vercel-specific setup is required beyond the env vars.

## Animation rules (locked)

These are non-negotiable per `tracking/PROJECT_CONTEXT.md`:

- Easing: `[0.16, 1, 0.3, 1]` everywhere. Never default Framer ease.
- No duration under 300ms anywhere. Default to `duration-500` / `duration-700`.
- Headline word animation: `translateY(20px) → 0`, opacity `0 → 1`, stagger `0.08s`.
- Card hover: border brightens from `#2A2A2A` to `#B8974A`. Subtle gold glow. **No movement. No scale. No bouncy springs.**

## Design tokens

All colors and typography are centralized in `tailwind.config.ts` and `app/layout.tsx`. See `tracking/PROJECT_CONTEXT.md` for the full token list.

## License

Portfolio demonstration site. Not for production use. The brand name, address, phone, email, and all copy are fictional. Do not use as a template for a real medical practice without changing every identifying detail.