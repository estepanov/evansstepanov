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

Local data lives in gitignored `data/` (SQLite + media). Seed: `seed/seed.json`. Local `dev` / `build` / `preview` use `@astrojs/node`.

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

## Cloudflare (production)

Production is Cloudflare Workers + D1 + R2. `ADAPTER=cloudflare` switches `astro.config.mjs` off Node/SQLite.

```bash
npx wrangler login
npm run build:cloudflare
npx wrangler deploy
npx wrangler secret put EMDASH_ENCRYPTION_KEY
```

The first deploy provisions the `evansstepanov` D1 database and `evansstepanov-media` R2 bucket from `wrangler.jsonc`. Optional analytics: `npx wrangler vars put PUBLIC_FATHOM_SITE_ID`. Local Cloudflare simulation: `npm run preview:cloudflare`.

Do not put secrets in `wrangler.jsonc`.

## Storybook

Component workshop for presentational components in `src/components/`. Storybook needs no CMS and works with no `.env`.

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
