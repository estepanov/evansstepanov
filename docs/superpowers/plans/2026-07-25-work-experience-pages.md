# Work Experience Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/work` (timeline index) and `/work/[slug]` (company detail) backed by Notion work data, with shared mappers/chrome so we do not clone the tech page.

**Architecture:** Notion role rows map to `Work` (with `companySlug`); pure `groupWorkByCompany` builds a `Company` view model. Routes only query/filter/sort/compose. Shared sticky header, crumb header, and topic hero replace duplicated tech/home chrome. Home Work cards link to company pages; `DetailsModal` stays for role deep-dives on the detail page.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Vitest, Playwright, Notion via `queryNotion` at build/prerender, `@sveltejs/adapter-static`.

**Spec:** `docs/superpowers/specs/2026-07-25-work-experience-page-design.md`

## Global Constraints

- Static site: all Notion reads in server `load` / `entries`; no client Notion fetches.
- Company slug from company name via `companySlug` (URL-safe), not raw display text.
- Multiple roles at one company → one `/work/[slug]` page.
- Do not grow `DetailsModal` for company narrative; no third `GridItem`/`DetailsModal` type for company.
- Do not introduce `EntityDetailPage` or a shared tech+work IndexLayout.
- Prefer home’s IntersectionObserver sticky sentinel; delete tech’s scroll/rAF `stuckDetect`.
- Reuse `TechBackdrop` with company tech tags; no `CompanyBackdrop` fork.
- Thermo-nuclear: extract mappers + company model before adding work routes; keep `GridItem` / home / modal from absorbing company-page logic.
- Node `>=24 <25` (`.nvmrc`); run unit tests with `npx vitest run …`; E2E with `npm test`.

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/data/work.ts` | `Work` type (+ `companySlug`); new `Company` type |
| `src/util/company.ts` | `companySlug`, `groupWorkByCompany`, company sort/tenure helpers |
| `src/util/company.test.ts` | Unit tests for slug + grouping |
| `src/util/notion-mappers.ts` | `buildTechIdToName`, `resolveTechTags`, `mapTech`, `mapWork`, `mapProject` |
| `src/util/notion-mappers.test.ts` | Fixture-based mapper tests |
| `src/util/stuck-detect.ts` | Shared Svelte action (IO sentinel) |
| `src/components/StickySectionHeader.svelte` | Sticky title chrome + shared stuck styles |
| `src/components/TechHeader.svelte` | Parameterized crumbs (`rootLabel`, `rootHref`, `leaf`) |
| `src/components/TopicHero.svelte` | Shared hero shell + `TechBackdrop` + default slot |
| `src/components/GridItem.svelte` | Work company name → `/work/{companySlug}` |
| `src/routes/+page.server.ts` | Use mappers |
| `src/routes/+page.svelte` | Use `StickySectionHeader`; remove local stuck CSS/action |
| `src/routes/tech/+page.server.ts` | Use `mapTech` |
| `src/routes/tech/[slug]/+page.server.ts` | Use mappers |
| `src/routes/tech/[slug]/+page.svelte` | `TopicHero` + `StickySectionHeader`; drop local stuck/hero CSS |
| `src/routes/work/+layout.svelte` | Default head title/description |
| `src/routes/work/+page.server.ts` | Load + group companies |
| `src/routes/work/+page.svelte` | Timeline index UI |
| `src/routes/work/[slug]/+page.server.ts` | Company by slug, related projects, `entries` |
| `src/routes/work/[slug]/+page.svelte` | Company detail UI |
| `tests/test.ts` | E2E smoke for work index/detail/home link |

---

### Task 1: Company model, slug, and grouping

**Files:**
- Modify: `src/data/work.ts`
- Create: `src/util/company.ts`
- Test: `src/util/company.test.ts`

**Interfaces:**
- Consumes: existing `Work` fields (`companyName`, `title`, `description`, `url`, `techTags`, `startDate`, `endDate`, `isCurrent`)
- Produces:
  - `Work.companySlug: string` (required on mapped work)
  - `Company` type (see code)
  - `companySlug(name: string): string`
  - `groupWorkByCompany(work: Work[]): Company[]`

- [ ] **Step 1: Write the failing tests**

Create `src/util/company.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { companySlug, groupWorkByCompany } from './company';
import type { Work } from '../data/work';

const role = (partial: Partial<Work> & Pick<Work, 'companyName' | 'title'>): Work => ({
	description: 'Summary',
	url: 'https://example.com',
	companySlug: companySlug(partial.companyName),
	techTags: [],
	...partial
});

describe('companySlug', () => {
	it('kebab-cases and strips punctuation', () => {
		expect(companySlug('Amazon Web Services')).toBe('amazon-web-services');
		expect(companySlug('CLEAR')).toBe('clear');
		expect(companySlug('  Foo & Bar Co. ')).toBe('foo-bar-co');
	});
});

describe('groupWorkByCompany', () => {
	it('merges roles at the same company onto one page', () => {
		const work: Work[] = [
			role({
				companyName: 'CLEAR',
				title: 'Staff Engineer',
				startDate: new Date('2022-01-01'),
				isCurrent: true,
				techTags: ['TypeScript', 'React']
			}),
			role({
				companyName: 'CLEAR',
				title: 'Senior Engineer',
				startDate: new Date('2020-01-01'),
				endDate: new Date('2021-12-31'),
				isCurrent: false,
				techTags: ['React', 'Node']
			}),
			role({
				companyName: 'AWS',
				title: 'SDE',
				startDate: new Date('2018-06-01'),
				endDate: new Date('2019-12-31'),
				isCurrent: false,
				techTags: ['Java']
			})
		];

		const companies = groupWorkByCompany(work);
		expect(companies.map((c) => c.slug)).toEqual(['clear', 'aws']);
		expect(companies[0].roles.map((r) => r.title)).toEqual([
			'Staff Engineer',
			'Senior Engineer'
		]);
		expect(companies[0].isCurrent).toBe(true);
		expect(companies[0].techTags.sort()).toEqual(['Node', 'React', 'TypeScript']);
		expect(companies[0].startDate).toEqual(new Date('2020-01-01'));
		expect(companies[0].endDate).toBeUndefined();
	});

	it('sorts companies by latest role startDate descending', () => {
		const work: Work[] = [
			role({
				companyName: 'Old Co',
				title: 'Eng',
				startDate: new Date('2015-01-01'),
				endDate: new Date('2016-01-01')
			}),
			role({
				companyName: 'New Co',
				title: 'Eng',
				startDate: new Date('2023-01-01'),
				isCurrent: true
			})
		];
		expect(groupWorkByCompany(work).map((c) => c.slug)).toEqual(['new-co', 'old-co']);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/util/company.test.ts`

Expected: FAIL (module not found / exports missing)

- [ ] **Step 3: Implement types and helpers**

Update `src/data/work.ts`:

```ts
export interface Work {
	isCurrent?: boolean;
	companyName: string;
	companySlug: string;
	title: string;
	description: string;
	url: string;
	image?: string;
	startDate?: Date;
	endDate?: Date;
	techTags?: string[];
}

export interface Company {
	slug: string;
	companyName: string;
	url?: string;
	roles: Work[];
	techTags: string[];
	isCurrent: boolean;
	startDate?: Date;
	endDate?: Date;
	/** Summary for hero: current role, else latest by startDate */
	summary: string;
}
```

Create `src/util/company.ts`:

```ts
import type { Company, Work } from '../data/work';

export function companySlug(name: string): string {
	return name
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function latestStart(roles: Work[]): Date | undefined {
	const dates = roles
		.map((r) => r.startDate)
		.filter((d): d is Date => Boolean(d))
		.map((d) => new Date(d).getTime());
	if (dates.length === 0) return undefined;
	return new Date(Math.max(...dates));
}

function earliestStart(roles: Work[]): Date | undefined {
	const dates = roles
		.map((r) => r.startDate)
		.filter((d): d is Date => Boolean(d))
		.map((d) => new Date(d).getTime());
	if (dates.length === 0) return undefined;
	return new Date(Math.min(...dates));
}

function pickSummary(roles: Work[]): string {
	const current = roles.find((r) => r.isCurrent);
	if (current) return current.description;
	const sorted = [...roles].sort((a, b) => {
		const at = a.startDate ? new Date(a.startDate).getTime() : 0;
		const bt = b.startDate ? new Date(b.startDate).getTime() : 0;
		return bt - at;
	});
	return sorted[0]?.description ?? '';
}

export function groupWorkByCompany(work: Work[]): Company[] {
	const bySlug = new Map<string, Work[]>();

	for (const role of work) {
		const slug = role.companySlug || companySlug(role.companyName);
		const list = bySlug.get(slug) ?? [];
		list.push(role);
		bySlug.set(slug, list);
	}

	const companies: Company[] = [];

	for (const [slug, roles] of bySlug) {
		const sortedRoles = [...roles].sort((a, b) => {
			const at = a.startDate ? new Date(a.startDate).getTime() : 0;
			const bt = b.startDate ? new Date(b.startDate).getTime() : 0;
			return bt - at;
		});

		const isCurrent = sortedRoles.some((r) => r.isCurrent);
		const techSet = new Set<string>();
		for (const r of sortedRoles) {
			for (const t of r.techTags ?? []) techSet.add(t);
		}

		const endDates = sortedRoles
			.map((r) => r.endDate)
			.filter((d): d is Date => Boolean(d));
		const endDate = isCurrent
			? undefined
			: endDates.length
				? new Date(Math.max(...endDates.map((d) => new Date(d).getTime())))
				: undefined;

		companies.push({
			slug,
			companyName: sortedRoles[0].companyName,
			url: sortedRoles.find((r) => r.url)?.url,
			roles: sortedRoles,
			techTags: [...techSet],
			isCurrent,
			startDate: earliestStart(sortedRoles),
			endDate,
			summary: pickSummary(sortedRoles)
		});
	}

	return companies.sort((a, b) => {
		const at = latestStart(a.roles)?.getTime() ?? 0;
		const bt = latestStart(b.roles)?.getTime() ?? 0;
		return bt - at;
	});
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/util/company.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/work.ts src/util/company.ts src/util/company.test.ts
git commit -m "add company slug and groupWorkByCompany helpers"
```

---

### Task 2: Canonical Notion mappers

**Files:**
- Create: `src/util/notion-mappers.ts`
- Test: `src/util/notion-mappers.test.ts`
- Modify: `src/routes/+page.server.ts`
- Modify: `src/routes/tech/+page.server.ts`
- Modify: `src/routes/tech/[slug]/+page.server.ts`

**Interfaces:**
- Consumes: Notion page `properties` shapes already used in route loads; `formatNotionFiles`; `TechProficiencyWeight`; `companySlug`
- Produces:
  - `buildTechIdToName(pages: { id: string; properties?: Record<string, any> }[]): Map<string, string>`
  - `resolveTechTags(relations: { id: string }[] | undefined, techIdToName: Map<string, string>): string[]`
  - `mapTech(page: { properties: Record<string, any> }): Tech`
  - `mapWork(page: { properties: Record<string, any> }, techIdToName: Map<string, string>): Work`
  - `mapProject(page: { properties: Record<string, any> }, techIdToName: Map<string, string>): Project`

- [ ] **Step 1: Write the failing mapper tests**

Create `src/util/notion-mappers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
	buildTechIdToName,
	mapTech,
	mapWork,
	mapProject,
	resolveTechTags
} from './notion-mappers';

const techPage = {
	id: 'tech-1',
	properties: {
		Name: { title: [{ plain_text: 'TypeScript' }] },
		Type: { select: { name: 'Language' } },
		Proficiency: { select: { name: 'Expert' } },
		Description: { rich_text: [{ plain_text: 'Typed JS' }] },
		URL: { url: 'https://www.typescriptlang.org/' }
	}
};

const workPage = {
	id: 'work-1',
	properties: {
		Company: { rich_text: [{ plain_text: 'CLEAR' }] },
		Position: { title: [{ plain_text: 'Staff Engineer' }] },
		Summary: { rich_text: [{ plain_text: 'Built things' }] },
		URL: { url: 'https://www.clearme.com' },
		'Tech Tags': { relation: [{ id: 'tech-1' }] },
		Dates: { date: { start: '2022-01-15', end: null } }
	}
};

describe('notion mappers', () => {
	it('maps tech and resolves work tech tags + companySlug', () => {
		const idToName = buildTechIdToName([techPage]);
		expect(idToName.get('tech-1')).toBe('TypeScript');

		const tech = mapTech(techPage);
		expect(tech.name).toBe('TypeScript');
		expect(tech.proficiencyWeight).toBe(3);

		const work = mapWork(workPage, idToName);
		expect(work.companyName).toBe('CLEAR');
		expect(work.companySlug).toBe('clear');
		expect(work.isCurrent).toBe(true);
		expect(work.techTags).toEqual(['TypeScript']);
		expect(resolveTechTags([{ id: 'tech-1' }, { id: 'missing' }], idToName)).toEqual([
			'TypeScript'
		]);
	});

	it('maps project media via formatNotionFiles contract', () => {
		const idToName = buildTechIdToName([techPage]);
		const project = mapProject(
			{
				properties: {
					Name: { title: [{ plain_text: 'Site' }] },
					Description: { rich_text: [{ plain_text: 'Portfolio' }] },
					Tags: { multi_select: [{ name: 'web' }] },
					'Tech Tags': { relation: [{ id: 'tech-1' }] },
					URL: { url: 'https://example.com' },
					Source: { url: 'https://github.com/x/y' },
					Media: { files: [] },
					Active: { checkbox: true },
					Dates: { date: { start: '2024-01-01', end: null } }
				}
			},
			idToName
		);
		expect(project.name).toBe('Site');
		expect(project.techTags).toEqual(['TypeScript']);
		expect(project.media).toEqual([]);
		expect(project.isActive).toBe(true);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/util/notion-mappers.test.ts`

Expected: FAIL (module not found)

- [ ] **Step 3: Implement mappers**

Create `src/util/notion-mappers.ts` by lifting the exact property walks from `src/routes/+page.server.ts` and `src/routes/tech/[slug]/+page.server.ts`, plus `companySlug` on work:

```ts
import { TechProficiencyWeight, type Tech } from '../data/tech';
import type { Work } from '../data/work';
import type { Project } from '../data/projects';
import { formatNotionFiles } from './formate-notion-files';
import { companySlug } from './company';

type Props = Record<string, any>;

export function buildTechIdToName(
	pages: Array<{ id: string; properties?: Props }>
): Map<string, string> {
	const techIdToName = new Map<string, string>();
	for (const page of pages) {
		if (!page.properties) continue;
		const name = page.properties.Name?.title?.[0]?.plain_text;
		if (name) techIdToName.set(page.id, name);
	}
	return techIdToName;
}

export function resolveTechTags(
	relations: { id: string }[] | undefined,
	techIdToName: Map<string, string>
): string[] {
	return (relations || [])
		.map((r) => techIdToName.get(r.id))
		.filter((n): n is string => Boolean(n));
}

export function mapTech(page: { properties: Props }): Tech {
	const proficiency = page.properties.Proficiency.select.name as keyof typeof TechProficiencyWeight;
	return {
		name: page.properties.Name.title[0].plain_text,
		type: page.properties.Type?.select?.name,
		proficiency,
		proficiencyWeight: TechProficiencyWeight[proficiency],
		description: page.properties.Description?.rich_text?.[0]?.plain_text ?? undefined,
		url: page.properties.URL?.url ?? undefined
	};
}

export function mapWork(page: { properties: Props }, techIdToName: Map<string, string>): Work {
	const companyName = page.properties.Company.rich_text[0].plain_text;
	const date = page.properties.Dates?.date;
	return {
		companyName,
		companySlug: companySlug(companyName),
		title: page.properties.Position.title[0].plain_text,
		description: page.properties.Summary.rich_text[0].plain_text,
		url: page.properties.URL.url,
		techTags: resolveTechTags(page.properties['Tech Tags']?.relation, techIdToName),
		isCurrent: page.properties.Dates.date.end === null,
		startDate: date?.start ? new Date(date.start) : undefined,
		endDate: date?.end ? new Date(date.end) : undefined
	};
}

export function mapProject(
	page: { properties: Props },
	techIdToName: Map<string, string>
): Project {
	const date = page.properties.Dates?.date;
	return {
		name: page.properties.Name.title[0].plain_text,
		description: page.properties.Description.rich_text[0].plain_text,
		tags: page.properties.Tags.multi_select.map((tag: { name: string }) => tag.name),
		techTags: resolveTechTags(page.properties['Tech Tags']?.relation, techIdToName),
		url: page.properties.URL.url,
		source: page.properties.Source.url,
		media: formatNotionFiles(page.properties.Media.files),
		isActive: page.properties.Active.checkbox,
		startDate: date?.start ? new Date(date.start) : undefined,
		endDate: date?.end ? new Date(date.end) : undefined
	};
}
```

`isCurrent` must match home/`tech/[slug]` exactly: `Dates.date.end === null`.

- [ ] **Step 4: Wire route loads through mappers**

Refactor `src/routes/+page.server.ts` load body to:

```ts
const techIdToName = buildTechIdToName(
	tech.results.filter((p): p is typeof p & { properties: object } => 'properties' in p)
);
const projectsResults = projects.results
	.filter((page): page is typeof page & { properties: object } => 'properties' in page)
	.map((page) => mapProject(page as any, techIdToName));
const workResults = work.results
	.filter((page): page is typeof page & { properties: object } => 'properties' in page)
	.map((page) => mapWork(page as any, techIdToName));
const techResults = tech.results
	.filter((page): page is typeof page & { properties: object } => 'properties' in page)
	.map((page) => mapTech(page as any));
// keep existing sorts and links mapping
```

Apply the same mapper usage in `src/routes/tech/+page.server.ts` and `src/routes/tech/[slug]/+page.server.ts` (delete local `resolveTechTags` / inline maps). Preserve existing sort and 404 behavior on the tech slug route.

- [ ] **Step 5: Run unit tests and check**

Run:

```bash
npx vitest run src/util/notion-mappers.test.ts src/util/company.test.ts
npm run check
```

Expected: tests PASS; `svelte-check` clean (or only pre-existing issues unrelated to these files)

- [ ] **Step 6: Commit**

```bash
git add src/util/notion-mappers.ts src/util/notion-mappers.test.ts \
  src/routes/+page.server.ts src/routes/tech/+page.server.ts \
  src/routes/tech/[slug]/+page.server.ts
git commit -m "extract shared Notion mappers for tech work projects"
```

---

### Task 3: Shared stuckDetect + StickySectionHeader

**Files:**
- Create: `src/util/stuck-detect.ts`
- Create: `src/components/StickySectionHeader.svelte`
- Modify: `src/routes/+page.svelte` (replace local `stuckDetect` + section-header markup/CSS)
- Modify: `src/routes/tech/[slug]/+page.svelte` (delete local `stuckDetect` + section-header CSS; use component)

**Interfaces:**
- Consumes: home’s IntersectionObserver sentinel implementation
- Produces:
  - `stuckDetect(node: HTMLElement): { destroy(): void }`
  - `<StickySectionHeader>` with default slot for the title row content (h2)

- [ ] **Step 1: Extract action**

Create `src/util/stuck-detect.ts` with the **home** implementation (sentinel + IO), not the tech scroll/rAF version:

```ts
/** Svelte action: toggles `is-stuck` when the sticky node pins to the viewport top. */
export function stuckDetect(node: HTMLElement) {
	const sentinel = document.createElement('div');
	sentinel.setAttribute('aria-hidden', 'true');
	sentinel.style.cssText = 'width:1px;height:1px;pointer-events:none;';
	node.parentElement?.insertBefore(sentinel, node);

	const io = new IntersectionObserver(
		([entry]) => {
			const stuck = !entry.isIntersecting && entry.boundingClientRect.top < 0;
			node.classList.toggle('is-stuck', stuck);
		},
		{ threshold: 0 }
	);
	io.observe(sentinel);
	return {
		destroy: () => {
			io.disconnect();
			sentinel.remove();
		}
	};
}
```

- [ ] **Step 2: Create StickySectionHeader**

Create `src/components/StickySectionHeader.svelte`:

```svelte
<script lang="ts">
	import { stuckDetect } from '../util/stuck-detect';
</script>

<div
	use:stuckDetect
	class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
>
	<slot />
</div>

<style>
	.section-header {
		isolation: isolate;
		width: 100%;
	}

	.section-header :global(.section-title) {
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: 0.18em;
		transition:
			font-size 0.3s ease,
			letter-spacing 0.3s ease;
	}

	.section-header:global(.is-stuck) :global(.section-title) {
		font-size: 0.875rem;
		letter-spacing: 0.15em;
	}

	.section-header::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - 50vw);
		width: 100vw;
		z-index: -1;
		background-color: transparent;
		border-bottom: 1px solid transparent;
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			backdrop-filter 0.25s ease;
	}

	.section-header:global(.is-stuck)::before {
		background-color: rgb(255 255 255 / 0.75);
		border-bottom-color: rgb(226 232 240 / 0.8);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	:global(.dark) .section-header:global(.is-stuck)::before {
		background-color: rgb(2 6 23 / 0.75);
		border-bottom-color: rgb(30 41 59 / 0.8);
	}

	@media (prefers-reduced-motion: reduce) {
		.section-header::before,
		.section-header :global(.section-title) {
			transition: none;
		}
	}
</style>
```

- [ ] **Step 3: Migrate home and tech detail**

In `src/routes/+page.svelte`:
- Remove local `stuckDetect` function
- Replace each sticky header wrapper with `<StickySectionHeader>` keeping the inner `<h2 class="section-title …">`
- Remove duplicated `.section-header` / stuck CSS that moved into the component (keep landing-only reduced-motion rules that reference other selectors; drop section-header bits that are now unused)

In `src/routes/tech/[slug]/+page.svelte`:
- Remove local `stuckDetect`
- Use `<StickySectionHeader>` for Related Work / Related Projects headers
- Delete the local `.section-header` CSS block

- [ ] **Step 4: Verify**

Run: `npm run check`

Manually smoke in dev: sticky Work/Projects headers on `/` and Related sections on a tech slug still pin.

- [ ] **Step 5: Commit**

```bash
git add src/util/stuck-detect.ts src/components/StickySectionHeader.svelte \
  src/routes/+page.svelte src/routes/tech/[slug]/+page.svelte
git commit -m "extract shared sticky section header"
```

---

### Task 4: Parameterize crumb header

**Files:**
- Modify: `src/components/TechHeader.svelte`
- Modify: `src/components/TechHeader.stories.svelte`
- Modify: `src/routes/tech/+page.svelte` (optional: pass explicit props; defaults OK)
- Modify: `src/routes/tech/[slug]/+page.svelte` (pass `leaf={tech.name}` if renaming prop)

**Interfaces:**
- Consumes: existing header markup/animation
- Produces props:
  - `rootLabel: string = 'Tech'`
  - `rootHref: string = '/tech'`
  - `leaf?: string` (display leaf; replaces hard-coded slug-as-name usage)

- [ ] **Step 1: Update TechHeader**

Replace slug-only API with:

```svelte
<script lang="ts">
	import LogoIcon from './LogoIcon.svelte';

	export let rootLabel: string = 'Tech';
	export let rootHref: string = '/tech';
	/** When set, shows `rootLabel / leaf`; otherwise a single non-link leaf of `rootLabel`. */
	export let leaf: string | undefined = undefined;
</script>
```

Breadcrumb markup:
- If `leaf` set: link to `rootHref` with `{rootLabel}`, separator, leaf text
- Else: single `{rootLabel}` leaf

Keep existing animations/classes. Update call sites: `TechHeader slug={tech.name}` → `TechHeader leaf={tech.name}`.

- [ ] **Step 2: Update Storybook story**

Update `TechHeader.stories.svelte` argTypes to `rootLabel`, `rootHref`, `leaf`; adjust Index / WithSlug / LongSlug stories accordingly.

- [ ] **Step 3: Check and commit**

```bash
npm run check
git add src/components/TechHeader.svelte src/components/TechHeader.stories.svelte \
  src/routes/tech/+page.svelte src/routes/tech/[slug]/+page.svelte
git commit -m "parameterize tech header crumbs for reuse"
```

---

### Task 5: TopicHero shared shell

**Files:**
- Create: `src/components/TopicHero.svelte`
- Modify: `src/routes/tech/[slug]/+page.svelte`
- Modify: `src/components/TechBackdrop.svelte` (only if class rename from `tech-hero` → also accept `topic-hero`)

**Interfaces:**
- Consumes: `TechBackdrop`, existing `.tech-hero` visual CSS
- Produces: `<TopicHero tags={string[]}>` default slot for inner content; root class `topic-hero` (and keep `tech-hero` as an additional class if needed for backdrop hover selectors — prefer updating backdrop to `:global(.topic-hero)` / `:global(.tech-hero)`)

- [ ] **Step 1: Create TopicHero**

Move hero wrapper + CSS from tech slug page into `TopicHero.svelte`:

```svelte
<script lang="ts">
	import TechBackdrop from './TechBackdrop.svelte';

	export let tags: string[] = [];
</script>

<section
	class="topic-hero tech-hero relative w-full rounded-2xl border border-slate-500/20 dark:border-slate-800/80 overflow-hidden mb-20"
>
	<TechBackdrop {tags} rows={6} cols={8} size={48} />
	<div class="relative z-10 px-6 md:px-10 py-10 md:py-14 flex flex-col gap-8">
		<slot />
	</div>
</section>

<style>
	/* Move .tech-hero / .hero-icon rules from tech/[slug]/+page.svelte here,
	   keyed off .topic-hero (keep .tech-hero alias on the element for backdrop). */
</style>
```

Update `TechBackdrop.svelte` global selectors to also match `.topic-hero` wherever `.tech-hero` is referenced.

- [ ] **Step 2: Migrate tech detail page**

Wrap the existing hero inner content in `<TopicHero tags={[tech.name]}>…</TopicHero>` and delete moved CSS.

- [ ] **Step 3: Check and commit**

```bash
npm run check
git add src/components/TopicHero.svelte src/components/TechBackdrop.svelte \
  src/routes/tech/[slug]/+page.svelte
git commit -m "extract shared topic hero shell"
```

---

### Task 6: `/work` index route

**Files:**
- Create: `src/routes/work/+layout.svelte`
- Create: `src/routes/work/+page.server.ts`
- Create: `src/routes/work/+page.svelte`

**Interfaces:**
- Consumes: `queryNotion`, `WORK_NOTION_DB_ID`, `TECH_NOTION_DB_ID`, mappers, `groupWorkByCompany`
- Produces: `{ companies: Company[] }` to the page

- [ ] **Step 1: Layout + server load**

`src/routes/work/+layout.svelte`:

```svelte
<svelte:head>
	<title>Work - Evans Stepanov</title>
	<meta name="description" content="Work experience and roles." />
</svelte:head>

<slot />
```

`src/routes/work/+page.server.ts`:

```ts
import { WORK_NOTION_DB_ID, TECH_NOTION_DB_ID } from '$env/static/private';
import type { Company } from '../../data/work';
import { groupWorkByCompany } from '../../util/company';
import { buildTechIdToName, mapWork } from '../../util/notion-mappers';
import { queryNotion } from '../../util/notion';

export async function load(): Promise<{ companies: Company[] }> {
	const [work, tech] = await Promise.all([
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);

	const techIdToName = buildTechIdToName(
		tech.results.filter((p): p is typeof p & { properties: object } => 'properties' in p) as any
	);

	const roles = work.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));

	return { companies: groupWorkByCompany(roles) };
}
```

- [ ] **Step 2: Timeline page UI**

`src/routes/work/+page.svelte` — structure:

- `PageContainer`, `<TechHeader rootLabel="Work" rootHref="/work" />`
- Intro: eyebrow “Experience”, H1 “Where I’ve built and led”, one supporting sentence
- `<ol>` timeline: each company is a list item with:
  - link to `/work/{company.slug}` (company name)
  - date range via `getFormattedDate` (end omitted / “Present” when `isCurrent`)
  - optional latest role title (`company.roles[0].title`)
  - `StatusIndicator` when `company.isCurrent`
- Footer `ButtonContainer` + `AnchorButton` home

Do **not** use a card grid. Keep styling consistent with existing slate/emerald tokens (match tech index typography).

- [ ] **Step 3: Dev smoke**

Run: `npm run dev` → open `/work` → companies render and links look correct.

- [ ] **Step 4: Commit**

```bash
git add src/routes/work/+layout.svelte src/routes/work/+page.server.ts src/routes/work/+page.svelte
git commit -m "add work experience timeline index"
```

---

### Task 7: `/work/[slug]` company detail

**Files:**
- Create: `src/routes/work/[slug]/+page.server.ts`
- Create: `src/routes/work/[slug]/+page.svelte`

**Interfaces:**
- Consumes: mappers, `groupWorkByCompany`, `PROJECTS_NOTION_DB_ID`, `error` from `@sveltejs/kit`
- Produces load data:
  - `company: Company`
  - `allTech: Tech[]`
  - `relatedProjects: Project[]`
- Produces `entries(): Promise<{ slug: string }[]>` for static adapter

- [ ] **Step 1: Server load + entries**

`src/routes/work/[slug]/+page.server.ts`:

```ts
import {
	WORK_NOTION_DB_ID,
	TECH_NOTION_DB_ID,
	PROJECTS_NOTION_DB_ID
} from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Company } from '../../../data/work';
import type { Tech } from '../../../data/tech';
import type { Project } from '../../../data/projects';
import { groupWorkByCompany } from '../../../util/company';
import {
	buildTechIdToName,
	mapProject,
	mapTech,
	mapWork
} from '../../../util/notion-mappers';
import { queryNotion } from '../../../util/notion';

async function loadCompaniesAndTech() {
	const [work, tech] = await Promise.all([
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);
	const techPages = tech.results.filter(
		(p): p is typeof p & { properties: object } => 'properties' in p
	);
	const techIdToName = buildTechIdToName(techPages as any);
	const allTech = techPages.map((p) => mapTech(p as any));
	const roles = work.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));
	return { companies: groupWorkByCompany(roles), allTech, techIdToName, techPages };
}

export async function entries() {
	const { companies } = await loadCompaniesAndTech();
	return companies.map((c) => ({ slug: c.slug }));
}

export async function load({
	params
}): Promise<{ company: Company; allTech: Tech[]; relatedProjects: Project[] }> {
	const { companies, allTech, techIdToName } = await loadCompaniesAndTech();
	const company = companies.find((c) => c.slug === params.slug);
	if (!company) throw error(404, 'Work experience not found');

	const projectsResult = await queryNotion({ database_id: PROJECTS_NOTION_DB_ID as string });
	const companyTagSet = new Set(company.techTags);
	const relatedProjects = projectsResult.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapProject(page as any, techIdToName))
		.filter((p) => (p.techTags ?? []).some((t) => companyTagSet.has(t)))
		.sort((a, b) => {
			if (a.isActive && !b.isActive) return -1;
			if (!a.isActive && b.isActive) return 1;
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		});

	return { company, allTech, relatedProjects };
}
```

- [ ] **Step 2: Detail page UI**

`src/routes/work/[slug]/+page.svelte`:

- Head title: `{company.companyName} - Evans Stepanov`
- `TechHeader rootLabel="Work" rootHref="/work" leaf={company.companyName}`
- `TopicHero tags={company.techTags}`:
  - optional “Visit” external link if `company.url`
  - H1 company name
  - tenure meta (`getFormattedDate` start — Present / end)
  - summary paragraph (`company.summary`)
- **Roles** section: for each `company.roles`, a simple row (title, dates, short description clamp) with a Details control that opens `DetailsModal` with `type="work"` and `item={role}` — do **not** reuse `GridItem` here (avoids self-linking company name)
- **Tech** section: links to `/tech/{encodeURIComponent(name)}` for each `company.techTags` (match how tech index links encode names)
- **Related Projects**: `StickySectionHeader` + `GridItem` grid when `relatedProjects.length > 0`
- Footer: Home + View all Work

Import `DetailsModal` and manage `openRole` state locally (one modal instance, set item on click) — same pattern as `GridItem`’s `detailsOpen`, but lifted for the role list.

- [ ] **Step 3: Dev smoke**

Open `/work/clear` (or a real slug from your Notion data). Confirm 404 for `/work/does-not-exist`. Confirm modal opens for a role. Confirm project grid when tags overlap.

- [ ] **Step 4: Commit**

```bash
git add src/routes/work/[slug]/+page.server.ts src/routes/work/[slug]/+page.svelte
git commit -m "add company work detail pages"
```

---

### Task 8: Home GridItem links to company pages

**Files:**
- Modify: `src/components/GridItem.svelte` (work company name href)
- Verify: `src/routes/+page.svelte` needs no regrouping if `companySlug` is on each work item

**Interfaces:**
- Consumes: `item.companySlug` on work items
- Produces: company name links to `/work/{item.companySlug}` (internal). External company URL remains available via Details modal / detail hero — remove external `target="_blank"` company link from the card’s company name.

- [ ] **Step 1: Update work company link in GridItem**

In the work branch where `companyOrUrl` renders, change the company name control to:

```svelte
<a
	href="/work/{item.companySlug}"
	on:click={() => handleLinkClick('work', titleField)}
	class="not-italic font-medium text-gray-700 dark:text-gray-200 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
	>{companyOrUrl}</a
>
```

Always link when `item.companySlug` is present (it should always be after mapper). Do not open a new tab.

Keep the Details button / modal behavior unchanged.

- [ ] **Step 2: Smoke home**

`npm run dev` → Home Work section → company name navigates to `/work/...`.

- [ ] **Step 3: Commit**

```bash
git add src/components/GridItem.svelte
git commit -m "link home work cards to company pages"
```

---

### Task 9: E2E smoke + final verification

**Files:**
- Modify: `tests/test.ts`

**Interfaces:**
- Consumes: prerendered `/`, `/work`, `/work/[slug]`

- [ ] **Step 1: Add Playwright tests**

Append to `tests/test.ts`:

```ts
test('work index lists companies and links to detail', async ({ page }) => {
	await page.goto('/work');
	const companyLinks = page.locator('a[href^="/work/"]');
	expect(await companyLinks.count()).toBeGreaterThan(0);
	const href = await companyLinks.first().getAttribute('href');
	expect(href).toMatch(/^\/work\/[a-z0-9-]+$/);
	await companyLinks.first().click();
	await expect(page).toHaveURL(href!);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('home work company links to work detail', async ({ page }) => {
	await page.goto('/');
	const workCompany = page.locator('a[href^="/work/"]').first();
	await expect(workCompany).toBeVisible();
	const href = await workCompany.getAttribute('href');
	await workCompany.click();
	await expect(page).toHaveURL(href!);
});
```

- [ ] **Step 2: Run full verification**

```bash
npx vitest run src/util/company.test.ts src/util/notion-mappers.test.ts
npm run check
npm test
```

Expected: all pass. If E2E needs a built site, follow existing Playwright config (usually `npm test` builds/previews per `playwright.config`).

- [ ] **Step 3: Commit**

```bash
git add tests/test.ts
git commit -m "add work experience e2e smoke tests"
```

---

## Self-Review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| `/work` timeline index | Task 6 |
| `/work/[slug]` company detail | Task 7 |
| Company model + merge roles | Task 1 |
| `companySlug` URL-safe | Task 1 |
| Shared Notion mappers | Task 2 |
| Sticky shell (IO, delete tech rAF) | Task 3 |
| Parameterized crumbs | Task 4 |
| Shared hero + TechBackdrop reuse | Task 5 |
| Home cards → company pages | Task 8 |
| Roles + DetailsModal on detail | Task 7 |
| Tech tag links + related projects | Task 7 |
| Static `entries` | Task 7 |
| Unit + E2E tests | Tasks 1–2, 9 |
| No EntityPage / no modal growth / no GridItem company type | Enforced in Tasks 7–8 |

**Placeholder scan:** none intentional.  
**Type consistency:** `Company`, `companySlug`, `groupWorkByCompany`, mapper names used consistently across tasks.
