# Repository Guidelines

These notes keep contributions consistent across the SvelteKit site and its automation scripts. Prefer small, reviewable changes and keep commands reproducible.

## Project Structure & Module Organization
- `src/routes/` holds page endpoints (`+page.svelte`, `+page.server.ts`, `+layout.*`); each folder is a URL segment. Subroutes like `tech/` and `bookmarks/` mirror their pages.
- `src/components/` contains reusable UI blocks; keep names PascalCase and colocate styles.
- `src/data/` contains static content and Notion-derived helpers; `src/util/` hosts cross-cutting utilities.
- `static/` serves unprocessed assets; `app.css` and `tailwind.config.js` define global styling.
- `scripts/download-build-images.ts` downloads external images; it runs automatically before `dev`/`build`.
- Tests live in `src/*.test.ts` (unit) and `tests/test.ts` (Playwright E2E).

## Build, Test, and Development Commands
- `npm run dev [-- --open]`: start the SvelteKit dev server after pulling images defined in Notion.
- `npm run build`: production build; triggers image download first.
- `npm run preview`: serve the built app locally.
- `npm run check`: `svelte-check` type and config validation.
- `npm run lint` / `npm run format`: Prettier + ESLint check or write.
- `npm run test:unit`: Vitest unit suite. `npm test` runs Playwright E2E.

## Coding Style & Naming Conventions
- TypeScript and Svelte with 2-space indentation; rely on Prettier defaults (`prettier-plugin-svelte`) and ESLint (`eslint-plugin-svelte`, `@typescript-eslint`).
- Components and Svelte files use PascalCase (`Button.svelte`); utilities and stores use `camelCase` filenames.
- Keep route files minimal; extract shared UI into `src/components/`. Prefer Tailwind classes plus scoped component styles over ad-hoc globals.

## Testing Guidelines
- Add unit specs alongside implementations using `*.test.ts`; favor pure utilities in Vitest.
- E2E lives in `tests/`; ensure key flows (landing page, Notion-driven data rendering) have coverage. Run `npm test` before merging; use `npx playwright test --ui` to debug when needed.
- Mock external calls where possible; only hit live Notion in manually triggered E2E runs.

## Commit & Pull Request Guidelines
- Follow the repo’s history: short, imperative messages (`clean up styles`, `extract grid item component`); one logical change per commit.
- PRs should state scope, testing performed, and any screenshots for UI updates; link related issues or Notion tasks.
- Include setup notes if new env vars or scripts are required; keep PRs small to ease review.

## Security & Configuration
- Required secrets: `NOTION_TOKEN` and `LANDING_LINKS_NOTION_DB_ID` in `.env` or `.env.local`; never commit these. Review `README.md` for setup details.
- Avoid embedding secrets in tests or fixtures. Remove downloaded artifacts from commits unless intentionally versioned.
