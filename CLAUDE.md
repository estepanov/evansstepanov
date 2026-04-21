# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `AGENTS.md` for the full contributor guide (structure, style, commit conventions). This file covers only what's not in there.

## Stack

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind, shipped as a fully static site via `@sveltejs/adapter-static` (output in `build/`). Content is sourced from Notion at build/dev time.

## Commands

- `npm run dev` — downloads Notion images, then starts Vite dev server. Requires `.env` with `NOTION_TOKEN`, `LANDING_LINKS_NOTION_DB_ID`, and `PROJECTS_NOTION_DB_ID`.
- `npm run build` — same image prefetch, then static build.
- `npm run check` — `svelte-kit sync` + `svelte-check`. Run this after touching types, routes, or `$env` usage.
- `npm run test:unit` — Vitest (unit `*.test.ts` colocated with source). Single test: `npx vitest run path/to/file.test.ts -t "name"`.
- `npm test` — Playwright E2E in `tests/`. Debug with `npx playwright test --ui`.
- `npm run lint` / `npm run format` — Prettier + ESLint.

Node version is pinned in `.nvmrc`.

## Notion-driven content pipeline

The site does not hit Notion at runtime in production — all Notion reads happen during SvelteKit's prerender/build phase (server `load` functions in `+page.server.ts`), plus an image prefetch step.

1. `scripts/download-build-images.ts` runs automatically before `dev` and `build`. It queries the `PROJECTS_NOTION_DB_ID` database, downloads every file from the `Media` property, and writes them to `static/_dld/static/` with hashed filenames (`src/util/file-names.ts#hashFileName`).
2. Route `load` functions use `src/util/notion.ts` (which reads `NOTION_TOKEN` via `$env/static/private`) to fetch page content. Image URLs coming from Notion are remapped to the local hashed paths via `src/util/motion-files.ts` / `formate-notion-files.ts`.
3. Because the output is static, any new Notion-dependent data must be fetched in a server `load` (not a client-side fetch) and must be serializable.

When adding a new Notion-backed feature: add the DB id to `.env` + README, fetch in `+page.server.ts`, and if it involves images, extend `download-build-images.ts` so assets land in `static/_dld/` before the build reads them.

## Routing notes

- `src/routes/tech/[slug]/` renders per-tech-tag pages; the tag list is static in `src/data/tech.ts` and used for both the index and slug params.
- `src/routes/bookmarks/` is driven by `LANDING_LINKS_NOTION_DB_ID`.
- `src/data/` holds static content (projects, work, tech) that is not in Notion — edit these TS files directly rather than adding a new data source.

## Env vars

Required in `.env` / `.env.local`:

- `NOTION_TOKEN` — Notion integration secret
- `LANDING_LINKS_NOTION_DB_ID` — bookmarks/links DB
- `PROJECTS_NOTION_DB_ID` — projects DB (used by the image prefetch script)
