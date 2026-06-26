# Lumen Aesthetics

Portfolio / spec project for a luxury NYC med spa. AI-powered treatment quiz + full marketing site. Cold-luxury aesthetic — dark backgrounds, gold accents, editorial typography.

## Tech stack

Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion · Google Gemini

## Status

In active development. See `tracking/PROJECT_CONTEXT.md` for project context and `tracking/TASKS.md` for live task progress.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

A `.env.local` is required for the AI quiz and integrations. Copy the keys you need — the project builds and serves without them, but features depending on them will degrade.

| Var | Used for | Required? |
|---|---|---|
| `GEMINI_API_KEY` | AI treatment quiz | Yes, for live quiz |
| `RESEND_API_KEY` | Contact form email | Yes, for contact form |
| `AIRTABLE_*` | Quiz lead capture | Yes, for lead capture |
| `NEXT_PUBLIC_CAL_*` | Cal.com booking embed | Yes, for booking page |

Server-side keys (`GEMINI_API_KEY`, `RESEND_API_KEY`, `AIRTABLE_*`) are never exposed to the client. Anything prefixed `NEXT_PUBLIC_` is public and visible in the browser bundle.

## AI provider notes

This project uses **Google Gemini `gemini-2.5-flash`** (free tier) instead of the Claude model in the original PRD — see `tracking/PROJECT_CONTEXT.md` for the rationale.

### Free-tier caveats

- Per the Gemini API Additional Terms (Dec 18, 2025), prompts and responses on the free tier may be reviewed by humans and used to improve Google products. Quiz answers here are anonymous skin-concern selections — low sensitivity.
- The free tier is not available for end-users in the EEA, UK, or Switzerland. A paid tier key is required for those regions.
- Per-account rate limits apply; check the AI Studio rate limit dashboard for the exact numbers that apply to your key.

## Build

```bash
npm run build
npm run start
```

## License

Portfolio demonstration site. Not for production use.
