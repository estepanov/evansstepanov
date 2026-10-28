# Native Astro + EmDash CMS

Date: 2026-10-28

Replace Notion-at-build + `@sveltejs/adapter-static` with one EmDash-backed Astro app: public site, admin, media, MCP, and HTTP endpoints.

## Goal

Evans authors work, projects, tech, links, bookmarks, about copy, and footer quotes in EmDash. Publishing updates the live site without a rebuild. The public UI keeps the current visual system. Hiring pages stay fast. Agents can edit content through EmDash MCP.

## Non-goals

- Keeping Notion as a runtime or build dependency after cutover
- A second headless CMS process
- React islands on public pages
- Hardcoded editorial copy in templates
- Deriving company cards from role rows (`companyHighlights`)

## Stack

- Astro `output: "server"` with EmDash integration and React (admin only)
- Svelte 5 via `@astrojs/svelte` for public components
- Tailwind v4 + existing `src/app.css` tokens
- Storybook `@storybook/svelte-vite` (not SvelteKit)
- Vitest for units, Playwright for E2E
- Local: `@astrojs/node` + SQLite + local media so `npm run dev` / Playwright work without Cloudflare credentials
- Production: Cloudflare Workers + D1 + R2 when `ADAPTER=cloudflare`

## Content model

Collections (slugs are stable; do not rename after seed):

| Collection | Label | Routable | Public |
| --- | --- | --- | --- |
| `pages` | Pages | no | `getEmDashEntry("pages", "home")` renders `/` |
| `companies` | Work | yes, `/work/{slug}` | landing cards + `/work` + `/work/[slug]` |
| `roles` | Roles | no | listed on the company page |
| `projects` | Projects | no | landing + related lists |
| `tech` | Tech | yes, `/tech/{slug}` | `/tech` + `/tech/[slug]` + home rows |
| `links` | Links | no | home Links section |
| `bookmarks` | Bookmarks | no | `/bookmarks` (`noindex`) |
| `quotes` | Quotes | no | home footer only |

### Fields

- **pages:** `about` portableText. Seed one published entry, slug `home`.
- **companies:** `name` string required, `url` url, `summary` text required. System slug is the URL.
- **roles:** `title` string required (position), `summary` text, `url` url, `start_date` datetime required, `end_date` datetime (empty = current), `company` reference one, `tech` reference many.
- **projects:** `name`, `description` text, `url`, `source` url, `is_active` boolean, `start_date` / `end_date` datetime, `media` repeater of `image`, `tech` reference many. Tags taxonomy `project_tags`.
- **tech:** `name` string required, `type` select (Runtime, Language, Framework, Library, Database, Data, Cloud, DevOps, AI — this option order is the home row order), `proficiency` select (Beginner, Intermediate, Advanced, Expert), `description` text, `url` url. System slug is the URL.
- **links:** `title`, `url`.
- **bookmarks:** `title`, `url`. Taxonomy `bookmark_tags`.
- **quotes:** `text` text required, `attribution` string required.

Relations: `roles_company` (role → one company), `roles_tech` (role → many tech), `projects_tech` (project → many tech).

Site settings: title `Evans Stepanov`. Footer copyright year is computed; the name comes from settings title.

### Derived (not copy)

From a company’s roles: `isCurrent` (any role with no `end_date`), tenure start = earliest `start_date`, tenure end = latest `end_date` unless current, `techTags` = union of related tech **names** for display, ordered by proficiency then name.

Do not invent company summary from the latest role.

### Quotes

Home footer only. Seed Edison as published:

- text: `I have not failed. I've just found 10,000 ways that won't work.`
- attribution: `Thomas A. Edison`

SSR the Edison (or first published) quote. A Svelte island picks uniformly among published quotes on the client. The footer already reveals on scroll, so the shuffle is off-screen. No-JS keeps the SSR quote. `/work` and `/tech` do not load quotes.

## URL slugs

Public paths use EmDash’s system `entry.slug`, never the display name.

`toUrlSlug(input)`:

1. NFKD, strip combining marks
2. lowercase
3. replace `+` with `-plus-` (so `C++` → `c-plus-plus`)
4. replace every run of `[^a-z0-9]` with `-`
5. trim leading/trailing `-`
6. reject empty result

Valid slug: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

Import and any seed entries must set `slug` with this function. Company names like `Amazon Web Services` → `amazon-web-services`. Tech names like `Node.js` → `node-js` (today’s `/tech/Node.js` is not kebab-case; import writes a 308 from the old name path to the new slug). Trailing slash remains on (current site uses `trailingSlash: 'always'`).

Tech and company templates link with `entry.slug`, not `data.name`.

## Public UI

Astro pages under `src/pages/` compose existing Svelte components. Default: SSR, no `client:*`. Hydrate only:

- `ProfileDiamond` — `client:visible`
- `ThemeToggle` — `client:load`
- `DetailsModal` / galleries — `client:idle`
- `FooterQuote` — `client:load`

No React on public routes. Admin is `client:only="react"` on `/_emdash/admin` only. Build fails if a file in the public client graph imports `react`, `react-dom`, or `@emdash-cms/admin`.

Remove `$app/*` and `$env/*` from public Svelte. Theme uses `document` / `localStorage` only.

Storybook: `@storybook/svelte-vite`, same colocated `*.stories.svelte`, same `src/app.css` + theme decorator. No Notion, no EmDash, no image prefetch.

## Rendering and APIs

Route cache (Node: `memoryCache`; Cloudflare: `cacheCloudflare`) on `/`, `/work`, `/work/[slug]`, `/tech`, `/tech/[slug]`, `/bookmarks` with tags matching collection names. Do not cache `/_emdash/*` or `/api/*`.

`src/pages/api/health.ts` returns 200. Further APIs are added as real Astro endpoints when needed; they stay uncached.

## Copy rules

Editorial copy lives in EmDash. Collection `label` supplies section titles (Work, Projects, Tech, Links). About is `pages/home` portable text; ProfileDiamond is a template widget, not CMS text.

Chrome that stays in templates: “Skip to content”, theme toggle aria, “Visit”, “Back to Home”, date formatting.

## Migration

One-shot script: Notion DBs → EmDash REST (or local seed apply) + media upload. Companies created from distinct company names; roles point at them; company `summary` copied from today’s `pickSummary` result as a starting value (then authored in CMS). Tech/company slugs via `toUrlSlug`. Redirects for previous tech name URLs.

After cutover: drop `@notionhq/client`, `scripts/download-build-images.ts`, `src/util/notion*.ts`, `formate-notion-files.ts`, `motion-files.ts` download path, `adapter-static`, `NOTION_*` env vars.

## Product / docs

Update `PRODUCT.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`: EmDash is content truth; publish is live; Storybook needs no CMS.

## Verification (always)

Agents must be able to boot without Notion credentials:

1. `npm run dev` → `/` and `/_emdash/admin`
2. `npm run test:unit`
3. `npm run check` (astro check / tsc as configured)
4. `npm run verify:public-js` after a production client build
5. `npm test` Playwright against seeded SQLite (CLEAR company + Edison quote so existing E2E still has an anchor)

Do not merge a task that fails its own verify block.
