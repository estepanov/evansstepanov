# Evans Stepanov

Personal site: Astro + EmDash, with the existing Svelte visual system.

**EmDash is content truth.** Work, projects, tech, links, bookmarks, about copy, and footer quotes are authored in the CMS. Publishing an entry updates the live site — no rebuild.

Public company and tech URLs use kebab-case slugs (`/work/amazon-web-services/`, `/tech/node-js/`), never display names. Quotes render on the home footer only.

## Developing

`npm run dev` needs `EMDASH_ENCRYPTION_KEY` in gitignored `.env` (generate with `npx emdash secrets generate`). Do not commit the key.

```bash
npm install
npm run dev
# http://localhost:4321/          public site
# http://localhost:4321/_emdash/admin/   CMS admin
```

Local data lives in gitignored `data/` (SQLite + media). Seed: `seed/seed.json`.

## Sample `.env`

```bash
EMDASH_ENCRYPTION_KEY=
PUBLIC_FATHOM_SITE_ID=
```

## Building

```bash
npm run build
npm run preview
```

## Storybook

Component workshop for presentational components in `src/components/`. Storybook needs no CMS (no EmDash, no Notion) and works with no `.env`.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # storybook-static/
```

Stories are colocated as `*.stories.svelte` (Svelte CSF). The toolbar theme switcher toggles the `dark` class on `<html>`.

### Story organization

- `Actions/` — buttons, links, select
- `Feedback/` — status + spinners
- `Chrome/` — site header, logos, theme toggle, footer quote
- `Layout/` — page/section scaffolding
- `Media/` — images, backdrops, profile diamond
- `Icons/` — custom tech icons (+ Gallery)
- `Domain/Tech|Work|Links/` — feature composites

Presentational `*View` shells are what Storybook targets for analytics-coupled composites (`GridItem`, `LinkItem`, `DetailsModal`).

## Optional Notion import

A one-shot importer can copy Notion databases into EmDash. Daily `dev` / `build` / Storybook do not need Notion credentials. A live import does:

```bash
npm run import:notion            # dry-run
npm run import:notion -- --apply # write (needs Notion + EMDASH_TOKEN)
```

For `--apply`: `NOTION_TOKEN`, `LANDING_LINKS_NOTION_DB_ID`, `PROJECTS_NOTION_DB_ID`, `WORK_NOTION_DB_ID`, `TECH_NOTION_DB_ID`, `BOOKMARKS_NOTION_DB_ID`, and `EMDASH_TOKEN` (admin PAT). Optional `EMDASH_URL` defaults to `http://localhost:4321`.
