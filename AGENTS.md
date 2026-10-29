# Repository Guidelines

These notes keep contributions consistent across the Astro + EmDash site and its automation scripts. Prefer small, reviewable changes and keep commands reproducible.

## EmDash documentation

Look up EmDash APIs, seed format, hooks, and config via the `emdash-docs` MCP server (`https://docs.emdashcms.com/mcp`, configured in `.mcp.json`). Prefer that over training-data assumptions. The site MCP at `http://localhost:4321/_emdash/api/mcp` is for content after `npm run dev` is running; it is not a substitute for the docs MCP.

**EmDash is content truth.** Editorial copy lives in CMS collections. Publishing an entry updates the live site. Public slugs are kebab-case (`toUrlSlug`). Quotes are home-only.

## Project Structure & Module Organization

- `src/pages/` holds Astro page endpoints (`index.astro`, `work/`, `tech/`, `bookmarks/`, `api/health.ts`). Each folder is a URL segment. Do not add SvelteKit `src/routes/`.
- `src/layouts/Base.astro` is the document shell (theme boot, fonts, Fathom, skip link).
- `src/components/` contains reusable UI grouped by Storybook taxonomy (`actions/`, `feedback/`, `chrome/`, `layout/`, `media/`, `icons/`, `domain/*/`); keep names PascalCase and colocate `*.stories.svelte`.
- `src/data/` holds TypeScript types, enums, and view models only — not content rows. `src/util/` hosts cross-cutting utilities (`emdash-content.ts` reads published entries).
- `static/` serves unprocessed assets; `src/app.css` and Tailwind v4 define global styling.
- `seed/seed.json` is the EmDash content model + seed entries. Local SQLite/media live in gitignored `data/`.
- `scripts/import-notion.ts` is an optional one-shot Notion → EmDash import. It is not part of `dev`/`build`.
- Tests live in `src/*.test.ts` and `scripts/*.test.ts` (unit) and `tests/test.ts` (Playwright E2E).

## Build, Test, and Development Commands

- `npm run dev [-- --open]`: Astro + EmDash on `:4321`. Requires `EMDASH_ENCRYPTION_KEY` in `.env`.
- `npm run build` / `npm run preview`: production Node server from `dist/`.
- `npm run check`: `astro check`.
- `npm run lint` / `npm run format`: Prettier + ESLint check or write.
- `npm run test:unit`: Vitest. `npm test` / `npx playwright test`: Playwright E2E against preview.
- `npm run verify:public-js`: fail the production client graph if public islands reach React or the EmDash admin bundle (run after `npm run build`).
- `npm run storybook` / `npm run build-storybook`: component workshop on port 6006. Needs no CMS and no `.env`.

## Coding Style & Naming Conventions

- TypeScript, Astro, and Svelte with 2-space indentation; rely on Prettier defaults (`prettier-plugin-svelte`) and ESLint (`eslint-plugin-svelte`, `@typescript-eslint`).
- Components and Svelte files use PascalCase (`Button.svelte`); utilities and stores use `camelCase` filenames.
- Keep pages thin; extract shared UI into `src/components/`. Prefer Tailwind classes plus scoped component styles over ad-hoc globals.
- Public pages: SSR by default. Hydrate only Diamond, theme, modal/gallery, and FooterQuote. No React on public routes.

## Testing Guidelines

- Add unit specs alongside implementations using `*.test.ts`; favor pure utilities in Vitest.
- E2E lives in `tests/`; cover landing, work/tech kebab-case hrefs, and seeded CMS anchors (CLEAR, Edison). Run `npm test` before merging; use `npx playwright test --ui` to debug when needed.
- Mock external calls. Do not hit live Notion from default unit or E2E runs.

## Commit & Pull Request Guidelines

- Follow the repo’s history: short, imperative messages (`clean up styles`, `extract grid item component`); one logical change per commit.
- PRs should state scope, testing performed, and any screenshots for UI updates; link related issues.
- Include setup notes if new env vars or scripts are required; keep PRs small to ease review.
- Do not commit `.env`, `data/*`, `.emdash/`, or `EMDASH_ENCRYPTION_KEY`.

## Security & Configuration

- Required for `npm run dev`: `EMDASH_ENCRYPTION_KEY` in `.env` or `.env.local`; never commit it. Review `README.md` for setup details.
- Optional: `PUBLIC_FATHOM_SITE_ID`. Notion credentials are only for a live `scripts/import-notion.ts` run.
- Avoid embedding secrets in tests or fixtures.
