# Native Astro + EmDash CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Notion + `adapter-static` SvelteKit site with one Astro + EmDash app that keeps the current Svelte UI as SSR/islands, authors all editorial copy in the CMS, and serves URL-friendly `/work/{slug}` and `/tech/{slug}` paths.

**Architecture:** Astro `output: "server"` hosts public pages, `/_emdash/admin`, media, MCP, and `/api/*`. Content lives in EmDash collections (pages, companies, roles, projects, tech, links, bookmarks, quotes). Public Svelte components SSR by default; only Diamond, theme, modal/gallery, and FooterQuote hydrate. React is admin-only. Local Node + SQLite for agent boot; Cloudflare D1/R2 later via `ADAPTER=cloudflare`.

**Tech Stack:** Astro 6, EmDash, `@astrojs/node`, `@astrojs/svelte`, `@astrojs/react` (admin), Svelte 5, Tailwind v4, Vitest, Playwright, Storybook svelte-vite.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-10-28-emdash-native-cms-design.md`. If this plan and the spec disagree, stop and ask.
- No Notion client, no `adapter-static`, no hardcoded About/quote/company-summary copy in templates.
- No React / `@emdash-cms/admin` in the public client graph.
- Public company and tech hrefs use `entry.slug` matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, never `data.name`.
- `toUrlSlug` is the only slugger: NFKD, lower, `+` → `-plus-`, non-alphanumerics → `-`, trim `-`.
- Trailing slashes on public URLs (match today’s `trailingSlash: 'always'`).
- Quotes collection is rendered only on `/`.
- Keep existing Svelte visual components, `src/app.css`, `static/logo/`, Storybook stories.
- Node `>=22.23.4`. Prefer the version in `.nvmrc` when it satisfies that floor.
- Do not commit `.env`, SQLite files, or `EMDASH_ENCRYPTION_KEY`.
- TDD for every new helper and endpoint. No production helper without a failing test first.
- After every task: run that task’s Verify block. Do not start the next task on failure.
- Commit once per task with a short imperative message (repo style: `extract grid item component`).

## Agent boot

Read in this order, then start Task 1:

1. This plan
2. `docs/superpowers/specs/2026-10-28-emdash-native-cms-design.md`
3. `PRODUCT.md` (visual/brand commitments still apply)

You do not need `NOTION_TOKEN` after Task 3’s seed is applied. You do need a generated `EMDASH_ENCRYPTION_KEY` in gitignored `.env` once EmDash is installed.

Work on a branch (`feat/emdash-native`). Do not commit to `main` unless the human asks.

## File map

Keep: `src/components/**/*.svelte` and `*.stories.svelte`, `src/app.css`, `src/util/dates.ts`, `src/util/tech-icons.ts`, `src/util/links.ts`, `src/util/id-hash-link-format.ts`, `src/data/*.ts` (types only, then reshape), `static/logo/`, `static/favicon.png`, `fonts` usage from `src/app.html`, Playwright `tests/test.ts` (update hrefs), `.storybook` (rewire).

Create:

- `astro.config.mjs`, `svelte.config.js` (Vite preprocess only), `src/live.config.ts`, `wrangler.jsonc`
- `seed/seed.json`
- `src/layouts/Base.astro`
- `src/pages/index.astro`, `work/index.astro`, `work/[slug].astro`, `tech/index.astro`, `tech/[slug].astro`, `bookmarks/index.astro`, `api/health.ts`
- `src/util/to-url-slug.ts`, `src/util/company-from-roles.ts`, `src/util/emdash-content.ts`
- `src/components/chrome/FooterQuote.svelte` (+ story)
- `scripts/verify-public-js.ts`, `scripts/bootstrap-dev.ts`, `scripts/import-notion.ts`
- `src/util/to-url-slug.test.ts`, `src/util/company-from-roles.test.ts`, `scripts/verify-public-js.test.ts`

Delete after replacements exist: `src/routes/**`, `svelte.config.js` Kit adapter usage, `src/util/notion.ts`, `notion-mappers.ts`, `formate-notion-files.ts`, `scripts/download-build-images.ts`, Notion env usage.

---

### Task 1: URL slug helper

**Files:**

- Create: `src/util/to-url-slug.ts`
- Create: `src/util/to-url-slug.test.ts`
- Modify: `src/util/company.ts` — make `companySlug` a deprecated alias of `toUrlSlug` until companies move to EmDash (keep existing tests passing)

**Interfaces:**

- Consumes: nothing
- Produces: `toUrlSlug(input: string): string`, `isUrlSlug(input: string): boolean`, `URL_SLUG_PATTERN` (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`)

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { toUrlSlug, isUrlSlug } from './to-url-slug';

describe('toUrlSlug', () => {
	it('kebabs company names', () => {
		expect(toUrlSlug('Amazon Web Services')).toBe('amazon-web-services');
		expect(toUrlSlug('CLEAR')).toBe('clear');
		expect(toUrlSlug('  Foo & Bar Co. ')).toBe('foo-bar-co');
	});

	it('kebabs tech names', () => {
		expect(toUrlSlug('Node.js')).toBe('node-js');
		expect(toUrlSlug('TypeScript')).toBe('typescript');
		expect(toUrlSlug('C++')).toBe('c-plus-plus');
	});

	it('throws on empty or punctuation-only input', () => {
		expect(() => toUrlSlug('   ')).toThrow(/url slug/i);
		expect(() => toUrlSlug('***')).toThrow(/url slug/i);
	});
});

describe('isUrlSlug', () => {
	it('accepts kebab-case and rejects names', () => {
		expect(isUrlSlug('amazon-web-services')).toBe(true);
		expect(isUrlSlug('Node.js')).toBe(false);
		expect(isUrlSlug('CLEAR')).toBe(false);
		expect(isUrlSlug('')).toBe(false);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/util/to-url-slug.test.ts`

Expected: FAIL (module not found)

- [ ] **Step 3: Implement**

```ts
export const URL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function toUrlSlug(input: string): string {
	const slug = input
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\+/g, '-plus-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (!slug) throw new Error(`Cannot build a url slug from "${input}"`);
	return slug;
}

export function isUrlSlug(input: string): boolean {
	return URL_SLUG_PATTERN.test(input);
}
```

Point `companySlug` at `toUrlSlug`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/util/to-url-slug.test.ts src/util/company.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/util/to-url-slug.ts src/util/to-url-slug.test.ts src/util/company.ts
git commit -m "$(cat <<'EOF'
add shared kebab-case url slug helper

EOF
)"
```

**Verify:** unit tests above green.

---

### Task 2: Scaffold Astro + EmDash (Node + SQLite)

**Files:**

- Create: `astro.config.mjs`, `src/live.config.ts`, `src/pages/index.astro` (temporary hello page OK until Task 6), `src/env.d.ts`
- Modify: `package.json` scripts (`dev`, `build`, `preview`, `check`, `test:unit`, `test`, `storybook` — drop `download-images*`)
- Modify: `svelte.config.js` to Vite preprocess only (no adapter)
- Create: `.env` locally (gitignored) with `EMDASH_ENCRYPTION_KEY` from `npx emdash secrets generate`

**Interfaces:**

- Consumes: none
- Produces: `npm run dev` serves Astro on `http://localhost:4321` and admin at `/_emdash/admin`

Do not paste a secret into chat or into git.

- [ ] **Step 1: Install runtime**

```bash
npm install astro emdash @astrojs/node @astrojs/svelte @astrojs/react react react-dom
npm install -D @types/react
```

Keep `svelte`, `vite`, `vitest`, `tailwindcss`, `@tailwindcss/vite`, Storybook packages. Remove `@sveltejs/kit`, `@sveltejs/adapter-static`, `@sveltejs/adapter-auto`, `@sveltejs/vite-plugin-svelte` if `@astrojs/svelte` replaces it, `@notionhq/client` only after import ships (Task 12). Until Task 12, Notion may remain installed unused.

- [ ] **Step 2: `astro.config.mjs`**

```js
import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';

export default defineConfig({
	output: 'server',
	trailingSlash: 'always',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		svelte(),
		react(),
		emdash({
			database: sqlite({ url: 'file:./data/emdash.db' }),
			storage: local({
				directory: './data/uploads',
				baseUrl: '/_emdash/api/media/file'
			})
		})
	],
	vite: {
		plugins: [tailwindcss()]
	},
	cache: {
		provider: memoryCache()
	},
	routeRules: {
		'/': { maxAge: 86_400, swr: 604_800, tags: ['pages', 'links', 'companies', 'roles', 'projects', 'tech', 'quotes'] },
		'/work': { maxAge: 86_400, swr: 604_800, tags: ['companies', 'roles', 'tech'] },
		'/work/[slug]': { maxAge: 86_400, swr: 604_800, tags: ['companies', 'roles', 'projects', 'tech'] },
		'/tech': { maxAge: 86_400, swr: 604_800, tags: ['tech'] },
		'/tech/[slug]': { maxAge: 86_400, swr: 604_800, tags: ['tech', 'projects', 'companies', 'roles'] },
		'/bookmarks': { maxAge: 86_400, swr: 604_800, tags: ['bookmarks'] }
	}
});
```

Import `memoryCache` from `astro/config`. Do not put `/_emdash` or `/api` in `routeRules`.

`src/live.config.ts`:

```ts
import { defineLiveCollection } from 'astro:content';
import { emdashLoader } from 'emdash/runtime';

export const collections = {
	_emdash: defineLiveCollection({ loader: emdashLoader() })
};
```

- [ ] **Step 3: Scripts**

`dev`: `astro dev`  
`build`: `astro build`  
`preview`: `node --env-file=.env ./dist/server/entry.mjs`  
`check`: `astro check`  
`test:unit`: `vitest run`

Add `data/` to `.gitignore`.

- [ ] **Step 4: Boot**

Run: `mkdir -p data && npm run dev`

Expected: `localhost:4321` 200. `/_emdash/admin` loads (setup wizard on empty DB).

- [ ] **Step 5: Commit** (no `.env`, no `data/`)

```bash
git commit -m "$(cat <<'EOF'
scaffold Astro and EmDash on Node SQLite

EOF
)"
```

**Verify:** admin route is not a 404. `git status` does not list `.env` or `*.db`.

---

### Task 3: Seed the content model + Edison quote + Playwright anchors

**Files:**

- Create: `seed/seed.json`
- Modify: `package.json` → `"emdash": { "seed": "seed/seed.json" }`

**Interfaces:**

- Consumes: Task 2 runtime
- Produces: collections listed in the spec; published `quotes` Edison; published `pages` `home`; published `companies` `clear` with two roles matching current Playwright copy

Seed collections, relations, taxonomies, and `content` as specified. Required seed content (so E2E can run without Notion):

```json
{
	"quotes": [
		{
			"id": "quote-edison",
			"status": "published",
			"data": {
				"text": "I have not failed. I've just found 10,000 ways that won't work.",
				"attribution": "Thomas A. Edison"
			}
		}
	],
	"pages": [
		{
			"id": "page-home",
			"slug": "home",
			"status": "published",
			"data": {
				"about": [
					{
						"_type": "block",
						"style": "normal",
						"children": [{ "_type": "span", "text": "I'm a product focused software engineer." }]
					}
				]
			}
		}
	],
	"companies": [
		{
			"id": "co-clear",
			"slug": "clear",
			"status": "published",
			"data": {
				"name": "CLEAR",
				"url": "https://www.clearme.com",
				"summary": "Placeholder company summary for local seed."
			}
		}
	]
}
```

Roles for CLEAR must include titles `Staff Software Engineer` and `Senior Software Engineer` and date ranges that format (UTC, `src/util/dates.ts`) to `August 2026 — Present` and `June 2023 — August 2026`.

Every `companies` and `tech` seed `slug` must equal `toUrlSlug(name)`.

`tech` `type` select `validation.options` in this order: Runtime, Language, Framework, Library, Database, Data, Cloud, DevOps, AI.

`companies.urlPattern`: `/work/{slug}`. `tech.urlPattern`: `/tech/{slug}`. `roles` and `quotes` and `pages` `routable: false` except pages may omit urlPattern; home is loaded by slug in `index.astro`.

- [ ] **Step 1: Write `seed/seed.json`** (full file; no TODOs)
- [ ] **Step 2: Apply seed** via the template’s documented command (`npx emdash seed` or first-request apply). If the wizard already ran on an empty DB, reset `data/emdash.db` and re-dev.
- [ ] **Step 3: Confirm in admin** that Quotes lists Edison and Work lists CLEAR with slug `clear`.
- [ ] **Step 4: Commit `seed/seed.json` only**

**Verify:** `toUrlSlug('CLEAR') === 'clear'`. Admin shows those entries. No Notion env required.

---

### Task 4: Content loaders

**Files:**

- Create: `src/util/emdash-content.ts`
- Create: `src/util/company-from-roles.ts`
- Create: `src/util/company-from-roles.test.ts`
- Modify: `src/data/work.ts`, `src/data/tech.ts`, `src/data/projects.ts` to match EmDash-facing view types (keep Storybook fixtures compiling)

**Interfaces:**

- Consumes: `getEmDashCollection`, `getEmDashEntry` from `emdash`
- Produces:

```ts
export async function loadPublished(name: 'quotes' | 'links' | 'bookmarks' | 'tech' | 'projects' | 'companies' | 'roles'): Promise<{ entries: ContentEntry[]; cacheHint: CacheHint }>;
export async function loadHomePage(): Promise<{ entry: ContentEntry; cacheHint: CacheHint }>;
export async function loadCompanyBySlug(slug: string): Promise<CompanyPage | null>;
export async function loadTechBySlug(slug: string): Promise<TechPage | null>;

export interface CompanyView {
	slug: string;
	name: string;
	url?: string;
	summary: string;
	roles: RoleView[];
	techTags: string[];
	isCurrent: boolean;
	startDate?: Date;
	endDate?: Date;
}
```

`CompanyView.slug` must `isUrlSlug`. `loadTechBySlug` 404s unless `isUrlSlug(slug)` (do not look up by display name).

`companyFromRoles(company, roles)` implements derived tenure / current / tech union. Test: two CLEAR roles → one company, `isCurrent` true, tech union unique, summary is `company.data.summary` not the latest role text.

- [ ] **Step 1: Failing tests for `companyFromRoles` and slug rejection**
- [ ] **Step 2: Run Vitest — FAIL**
- [ ] **Step 3: Implement loaders**
- [ ] **Step 4: Vitest PASS**
- [ ] **Step 5: Commit**

**Verify:** `npx vitest run src/util/company-from-roles.test.ts src/util/to-url-slug.test.ts`

---

### Task 5: `Base.astro`, theme without `$app`, health endpoint

**Files:**

- Create: `src/layouts/Base.astro`
- Create: `src/pages/api/health.ts`
- Create: `src/pages/api/health.test.ts` if you extract a handler; otherwise Playwright in Task 11
- Modify: `src/lib/theme.svelte.ts` — remove `$app/environment`; use `typeof document !== 'undefined'`
- Move theme boot script from `src/app.html` into `Base.astro` `<head>` (same no-flash logic)

**Interfaces:**

- Consumes: `PUBLIC_FATHOM_SITE_ID` as `import.meta.env.PUBLIC_FATHOM_SITE_ID`
- Produces: layout with skip link, Fathom on load, `ThemeToggle client:load`, `<slot />`

Health:

```ts
export const GET = () => new Response('OK', { status: 200 });
```

- [ ] **Step 1: Theme unit tests still pass** (add a test that `theme.svelte.ts` does not import `$app`)
- [ ] **Step 2: Implement layout + health**
- [ ] **Step 3: `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/api/health` → `200`**
- [ ] **Step 4: Commit**

**Verify:** no `$app/` imports under `src/` except deleted Kit files. Health 200.

---

### Task 6: Home page

**Files:**

- Modify: `src/pages/index.astro`
- Create: `src/components/chrome/FooterQuote.svelte`
- Create: `src/components/chrome/FooterQuote.stories.svelte`
- Create: `src/components/chrome/FooterQuote.test.ts` for the picker helper

**Interfaces:**

- Consumes: `loadHomePage`, `loadPublished` for links, companies, projects, tech, quotes
- Produces: same sections as current `src/routes/+page.svelte` (About, Links, Work, Projects, Tech, footer)

About: render `pages/home` portable text; inject `<ProfileDiamond client:visible />` at the start of the about block (template widget).

Work cards: `companies` (one per entry), `href={`/work/${company.slug}/`}` with `isUrlSlug(company.slug)`.

Tech rows: group by `data.type` using the select option order from the spec; item href `/tech/${entry.slug}/` (not `data.name`).

Footer: `<FooterQuote quotes={...} fallback={edison} client:load />`. Extract `pickRandomQuote(quotes, fallback)` and test: single quote always returned; multiple quotes stay in the set.

Section headings: collection labels (`Work`, `Projects`, `Tech`, `Links`) or the heading strings already used in Playwright (`Work`, `Links`) — those labels must remain exact for E2E.

Pass `cacheHint`s to `Astro.cache.set` when cache exists.

- [ ] **Step 1: Failing test for `pickRandomQuote`**
- [ ] **Step 2: Implement helper + island + `index.astro`**
- [ ] **Step 3: Manual: `/` shows About, CLEAR card linking to `/work/clear/`, Edison in footer HTML, tech hrefs kebab-case**
- [ ] **Step 4: Commit**

**Verify:** `document.querySelectorAll('a[href^="/tech/"]').forEach` — every pathname after `/tech/` matches `URL_SLUG_PATTERN` (ignore hash links `/tech/#...`). Work card `href` is `/work/clear/` or `/work/clear`.

---

### Task 7: Work index + company detail

**Files:**

- Create: `src/pages/work/index.astro`, `src/pages/work/[slug].astro`
- Reuse: `WorkExperienceCard`, `TopicHero`, `TechHeader`, `ProjectCard`

**Interfaces:**

- Consumes: `loadCompanyBySlug`, `loadPublished('companies'|'roles'|'projects'|'tech')`
- Produces: `/work/` list; `/work/[slug]/` 404 unless `isUrlSlug(slug)` and a published company exists

Related projects: published projects whose tech set intersects the company’s derived `techTags`.

Decode params with EmDash `decodeSlug` if the docs require it.

- [ ] **Step 1: Unit test: unknown slug / `Node.js` as company param → not found**
- [ ] **Step 2: Implement pages**
- [ ] **Step 3: `/work/clear/` shows both CLEAR roles from seed**
- [ ] **Step 4: Commit**

**Verify:** Playwright assertions in Task 11; locally open `/work/CLEAR/` should 404 (wrong slug).

---

### Task 8: Tech index + detail

**Files:**

- Create: `src/pages/tech/index.astro`, `src/pages/tech/[slug].astro`

**Interfaces:**

- Consumes: `loadTechBySlug`
- Produces: `/tech/` grouped by type; `/tech/[slug]/` uses slug not name. Related work uses **companies** that have a role referencing that tech (one card per company), not `companyHighlights` on filtered roles.

Home tech anchors stay `/tech/#{type.toLowerCase()}`.

- [ ] **Step 1: Test `loadTechBySlug('Node.js')` is null; `loadTechBySlug('node-js')` hits the Node.js entry if seeded**
- [ ] **Step 2: Implement pages**
- [ ] **Step 3: Commit**

**Verify:** no public tech link contains `.` or uppercase.

---

### Task 9: Bookmarks

**Files:**

- Create: `src/pages/bookmarks/index.astro`

`noindex, nofollow, noarchive` on this page. Group by `bookmark_tags`.

- [ ] **Step 1: Implement**
- [ ] **Step 2: View source contains `noindex`**
- [ ] **Step 3: Commit**

**Verify:** robots meta present. Page does not import quotes.

---

### Task 10: Storybook on svelte-vite

**Files:**

- Modify: `.storybook/main.ts`, `.storybook/preview.ts`
- Modify: `package.json` storybook scripts (unchanged commands, new framework)

```ts
import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-a11y', '@storybook/addon-themes'],
	framework: { name: '@storybook/svelte-vite', options: {} }
};
export default config;
```

Preview: keep `src/app.css` import and `withThemeByClassName`. Change the `Preview` type import to `@storybook/svelte-vite`.

Fix any story that imported `$app` or Notion types.

- [ ] **Step 1: `npm run storybook`**
- [ ] **Step 2: Open FooterQuote, ProfileDiamond, WorkExperienceCard stories**
- [ ] **Step 3: Commit**

**Verify:** Storybook compiles without SvelteKit. No Notion env needed.

---

### Task 11: Public JS isolation + Playwright

**Files:**

- Create: `scripts/verify-public-js.ts`
- Create: `scripts/verify-public-js.test.ts` (unit-test the scanner against fixture strings)
- Modify: `package.json` `"verify:public-js": "tsx scripts/verify-public-js.ts"`
- Modify: `playwright.config.ts` webServer to Astro preview (port: use `4321` or set `PORT=4173`)
- Modify: `tests/test.ts` — tech item hrefs must match `/^\/tech\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/`; keep CLEAR / Links / orbit tests against seed

Scanner: after `astro build`, inspect client assets (not URLs under `/_emdash/`). Fail if any public chunk contains `from "react"` / `@emdash-cms/admin` / `react-dom`. Allow those strings only in admin-named chunks if the build emits a separate admin bundle that public HTML does not reference.

Also add a Vite `manualChunks` guard in `astro.config.mjs` client `outputOptions` as in EmDash issue 1413 (react vs emdash-admin split) so a mistake cannot couple them.

- [ ] **Step 1: Failing scanner test + failing Playwright if hrefs still use names**
- [ ] **Step 2: Implement scanner, chunk split, Playwright updates**
- [ ] **Step 3:**

```bash
npm run test:unit
npm run build
npm run verify:public-js
npx playwright test
```

Expected: all pass.

- [ ] **Step 4: Commit**

**Verify:** the four commands above. `curl -s localhost:4321/api/health` → OK.

---

### Task 12: Notion import + tech redirects

**Files:**

- Create: `scripts/import-notion.ts`
- Create: `src/util/legacy-tech-path.ts`
- Create: `src/util/legacy-tech-path.test.ts`

**Interfaces:**

```ts
export function legacyTechPaths(name: string, slug: string): string[]
```

Returns distinct paths to 308 onto `/tech/${slug}/`, including `/tech/${name}`, `/tech/${name}/`, and encodeURI variants. Never returns a path that already equals the destination.

Import (local, uses existing Notion env):

1. Query Tech, Work, Projects, Links, Bookmarks DBs (same IDs as today)
2. `toUrlSlug` each tech name and company name; on collision throw
3. Upsert collections via EmDash REST `Authorization: Bearer $EMDASH_TOKEN` against `http://localhost:4321/_emdash/api`
4. Create companies from unique work company names; set `summary` to today’s `pickSummary` output as initial CMS copy
5. Create roles pointing at companies + tech refs
6. Upload project media (replace `download-build-images.ts`)
7. Write EmDash redirects for `legacyTechPaths`

Do not commit tokens. After a successful production import, delete Notion helpers in a follow-up commit on this task.

- [ ] **Step 1: Tests for `legacyTechPaths('Node.js', 'node-js')`**
- [ ] **Step 2: Implement import; dry-run log first**
- [ ] **Step 3: Manual import against local EmDash**
- [ ] **Step 4: Remove `@notionhq/client` and Notion util files if import succeeded**
- [ ] **Step 5: Commit**

**Verify:** `/tech/Node.js/` 308 → `/tech/node-js/`. `/work/amazon-web-services/` 200 if that company existed in Notion.

---

### Task 13: Docs + Cloudflare adapter (optional deploy)

**Files:**

- Modify: `README.md`, `PRODUCT.md`, `AGENTS.md`, `CLAUDE.md`
- Create: `wrangler.jsonc` and `ADAPTER=cloudflare` branch of `astro.config.mjs` only if deploying

Docs must say: EmDash is content truth; `npm run dev` needs `EMDASH_ENCRYPTION_KEY`; Storybook needs no CMS; publish is live; slugs are kebab-case; quotes are home-only.

- [ ] **Step 1: Update docs**
- [ ] **Step 2: `npm run check && npm run test:unit && npm run verify:public-js && npx playwright test`**
- [ ] **Step 3: Commit**

**Verify:** README sample `.env` has no `NOTION_*`. AGENTS.md does not say `src/data/` holds static content rows.

---

## Definition of done

- [ ] `/` About comes from CMS portable text
- [ ] Home footer shuffles `quotes`; Edison in seed; `/work` has no footer quote
- [ ] One Work card per company; promotions are roles
- [ ] `/work/{kebab}/` and `/tech/{kebab}/` only
- [ ] Storybook runs without EmDash
- [ ] Public JS check fails a fixture that imports React and passes the real build
- [ ] Playwright green against seeded SQLite
- [ ] `/api/health` 200
- [ ] Notion optional until Task 12, gone after it
