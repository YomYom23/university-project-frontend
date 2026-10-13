# Versiti Frontend

React client for the Versiti university/student matching platform: landing page, authentication, a multi-step onboarding flow, and match dashboards for students and universities.

Built with React 19, TypeScript, Vite, React Router and Framer Motion. The API it talks to is [University-project-api](https://github.com/YomYom23/University-project-api).

## Features

- Sign-up and sign-in with role selection (student or university), against the API's cookie sessions.
- Route protection: signed-out users are redirected, and the session is re-checked from `/auth/status` on load.
- Student onboarding in several steps. Each step saves to the API as you go, and returning users resume where they stopped.
- Match scoring (`src/hooks/useMatchScore.ts`): a 0–100 score from academics, budget, major, campus vibe and location, with a per-factor breakdown.
- Student dashboard: universities ranked by match, filters, saved list and editable profile.
- University dashboard: candidates ranked by match, shortlist and summary stats.
- A small reusable UI kit in `src/components/ui` (buttons, cards, range slider, chip selects, progress and score rings).

## Scope

The dashboards currently rank sample data from `src/data/`. Accounts and student onboarding go through the API; the universities and candidates on the dashboards do not yet. The university onboarding form exists but isn't saved to the API, and Messages is a placeholder.

## Run it

Requires [Bun](https://bun.sh) and a running API on `http://localhost:3000`.

```bash
bun install
bun run dev      # http://localhost:5173
```

```bash
bun run build    # type-check and production build
bun run lint
```

## Structure

```
src/
  api/          onboarding API client
  auth/         auth context and provider
  components/   layout, protected route, UI kit
  data/         sample universities and students, form options
  hooks/        match scoring, onboarding sync
  pages/        landing, sign-up, sign-in, onboarding, dashboards
```
