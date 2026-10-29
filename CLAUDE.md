# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `AGENTS.md` for the full contributor guide (structure, style, commit conventions). This file covers only what's not in there.

## Stack

Astro (`output: "server"`) + EmDash + Svelte 5 + TypeScript + Tailwind v4. Local adapter is `@astrojs/node` with SQLite and local media (`data/emdash.db`, `data/uploads`). React is admin-only (`/_emdash/admin`).

**EmDash is content truth.** Publishing an entry updates the live site. Public slugs are kebab-case. Quotes are home-only.

## Commands

- `npm run dev` — Astro + EmDash on `http://localhost:4321`. Requires `.env` with `EMDASH_ENCRYPTION_KEY` (`npx emdash secrets generate`).
- `npm run build` — production server build into `dist/`.
- `npm run preview` — serve `dist/` with `.env` loaded.
- `npm run check` — `astro check`. Run this after touching types, pages, or `import.meta.env`.
- `npm run test:unit` — Vitest (unit `*.test.ts` colocated with source). Single test: `npx vitest run path/to/file.test.ts -t "name"`.
- `npm test` — Playwright E2E in `tests/`. Debug with `npx playwright test --ui`.
- `npm run verify:public-js` — after a production client build, fail if public JS reaches React or `@emdash-cms/admin`.
- `npm run lint` / `npm run format` — Prettier + ESLint.
- `npm run storybook` — component workshop; needs no CMS and no `.env`.

Node version is pinned in `.nvmrc`.

## EmDash content pipeline

The public site reads published EmDash entries at request time (`src/util/emdash-content.ts` → `getEmDashCollection` / `getEmDashEntry`). There is no Notion runtime and no build-time content fetch.

1. Collections: `pages` (slug `home` → `/`), `companies` (`/work/{slug}/`), `roles` (listed on the company page), `projects`, `tech` (`/tech/{slug}/`), `links` (home), `bookmarks` (`/bookmarks`, `noindex`), `quotes` (home footer only).
2. Route cache (`memoryCache`) on `/`, `/work`, `/work/[slug]`, `/tech`, `/tech/[slug]`, `/bookmarks`. Do not cache `/_emdash/*` or `/api/*`.
3. Canonical health: `GET /api/health/` → 200. Unsuffixed `/api/health` is 404 under `trailingSlash: 'always'`.

When adding a collection-backed page: query in the Astro frontmatter (not a client fetch), tag the route cache, and keep editorial copy out of the template.

## Routing notes

- Pages live in `src/pages/`, not SvelteKit `src/routes/`.
- `src/pages/tech/[slug].astro` and `src/pages/work/[slug].astro` use `entry.slug` (`toUrlSlug`). Valid slug: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- `src/data/` is types and view models only — not content rows.
- Footer quotes load only on `src/pages/index.astro`. `/work` and `/tech` do not.

## Env vars

Required in `.env` / `.env.local` for `npm run dev`:

- `EMDASH_ENCRYPTION_KEY` — generated locally; never commit

Optional:

- `PUBLIC_FATHOM_SITE_ID` — analytics; skipped when empty

Notion `NOTION_*` vars are only for a live `npm run import:notion -- --apply`. They are not required to boot the site.
