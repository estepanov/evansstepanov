# Work Experience Card Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace interactive work `GridItem`s with a dedicated whole-card link component to `/work/{companySlug}` on landing and tech pages, matching existing card visuals with no nested interactives.

**Architecture:** Add `WorkExperienceCard` (Fathom container) + `WorkExperienceCardView` (single `<a>` card). Extract shared grid-card chrome CSS from `GridItemView` into `gridCardChrome.css`. Remove work-only interactive branches from `GridItem` after call sites migrate. Project cards keep today’s modal pattern.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind, Storybook (`@storybook/addon-svelte-csf`), Vitest, Playwright, Fathom (`fathom-client`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-25-work-experience-card-link-design.md`
- Do not redesign visuals — match existing work card chrome
- No nested `<a>` / `<button>` / dialog triggers inside the work experience card
- Never emit `href="/work/undefined"` — missing slug → non-link chrome
- No Fathom imports in any `*View.svelte`
- Site uses `trailingSlash: 'always'` (`src/routes/+layout.ts`) — keep hrefs as `/work/{slug}` (same as today)
- After each task: `npm run check` must pass
- Do not change `/work` index, `/work/[slug]` role modals, or project card behavior

---

## File structure (target)

```
src/util/work-experience-href.ts          # href helper (null if no slug)
src/util/work-experience-href.test.ts

src/components/domain/work/
  gridCardChrome.css                      # shared glow / active border / glare / status-anchor
  WorkExperienceCardView.svelte           # presentation (no Fathom)
  WorkExperienceCard.svelte               # public API + Fathom
  WorkExperienceCard.stories.svelte
  GridItem.svelte                         # projects only (after cleanup)
  GridItemView.svelte                     # projects only (after cleanup)
  GridItem.stories.svelte                 # project stories only
  fixtures/sampleWorkItem.ts              # add past-role fixture for stories
```

**Call sites**

| File | Change |
| --- | --- |
| `src/routes/+page.svelte` | Work loop → `WorkExperienceCard` |
| `src/routes/tech/[slug]/+page.svelte` | Related work → `WorkExperienceCard` |
| `tests/test.ts` | Home work card link + no Details button |

---

### Task 1: `workExperienceHref` helper (TDD)

**Files:**
- Create: `src/util/work-experience-href.ts`
- Create: `src/util/work-experience-href.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `workExperienceHref(companySlug: string | undefined | null): string | null`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { workExperienceHref } from './work-experience-href';

describe('workExperienceHref', () => {
	it('returns /work/{slug} for a non-empty slug', () => {
		expect(workExperienceHref('clear')).toBe('/work/clear');
	});

	it('returns null for missing or empty slug', () => {
		expect(workExperienceHref(undefined)).toBeNull();
		expect(workExperienceHref(null)).toBeNull();
		expect(workExperienceHref('')).toBeNull();
		expect(workExperienceHref('   ')).toBeNull();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/util/work-experience-href.test.ts`

Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
export function workExperienceHref(companySlug: string | undefined | null): string | null {
	if (companySlug == null) return null;
	const slug = companySlug.trim();
	if (!slug) return null;
	return `/work/${slug}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/util/work-experience-href.test.ts`

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/util/work-experience-href.ts src/util/work-experience-href.test.ts
git commit -m "$(cat <<'EOF'
Add workExperienceHref helper for card links.

EOF
)"
```

---

### Task 2: Extract shared `gridCardChrome.css`

**Files:**
- Create: `src/components/domain/work/gridCardChrome.css`
- Modify: `src/components/domain/work/GridItemView.svelte` (import shared CSS; leave component-specific styles in the `<style>` block)

**Interfaces:**
- Consumes: existing class names already used on `GridItemView` (`.grid-card`, `.status-anchor`, `.active-border`, `.active-border--subtle`, `.active-glare`, `.active-glare__spot`)
- Produces: shared stylesheet imported by both card views (no public TS API)

**Move these rules out of `GridItemView.svelte` `<style>` into `gridCardChrome.css` (copy verbatim, including dark-mode / reduced-motion / view-timeline blocks):**

- `.status-anchor`
- `.grid-card` (including `content-visibility` / `contain-intrinsic-size`)
- `.grid-card::after` and `.grid-card::before` (+ dark variants + hover/focus-within + reduced-motion)
- `.grid-card.active-border`
- `.active-border` / `.active-border--subtle` (+ dark)
- `.active-glare` / `.active-glare__spot` (+ scrolling / dark / `@supports (animation-timeline: view())` / `@keyframes glare-travel` / reduced-motion)

**Keep in `GridItemView.svelte` `<style>` (project-card-specific):**

- `.card-heading`, `.card-description`, `.card-meta` text-shadow rules
- `.details-btn-wrap`, `.details-btn`, `.details-btn__label` and related hover/reduced-motion rules

- [ ] **Step 1: Create `gridCardChrome.css` with the shared rules listed above**

Cut from `GridItemView.svelte` and paste into the new file. Do not rename classes.

- [ ] **Step 2: Import shared CSS in `GridItemView.svelte`**

At top of `<script>`:

```ts
import './gridCardChrome.css';
```

Remove the moved rules from the local `<style>` block. Leave project-only rules.

- [ ] **Step 3: Verify types / no regressions**

Run: `npm run check`

Expected: no errors

- [ ] **Step 4: Smoke Storybook work/project stories visually (manual)**

Run: `npm run storybook`

Open `Domain/Work/GridItem` → Work Current + Project Active. Confirm glow, active border, and status chip still match prior look.

- [ ] **Step 5: Commit**

```bash
git add src/components/domain/work/gridCardChrome.css src/components/domain/work/GridItemView.svelte
git commit -m "$(cat <<'EOF'
Extract shared grid card chrome styles.

EOF
)"
```

---

### Task 3: `WorkExperienceCardView` + Storybook

**Files:**
- Create: `src/components/domain/work/WorkExperienceCardView.svelte`
- Create: `src/components/domain/work/WorkExperienceCard.stories.svelte`
- Modify: `src/components/domain/work/fixtures/sampleWorkItem.ts` (add `samplePastWorkItem`)

**Interfaces:**
- Consumes: `workExperienceHref` from `../../../util/work-experience-href`; `./gridCardChrome.css`; `StatusIndicator`, `TechBackdrop`, `getFormattedDate`
- Produces: presentational props:

```ts
export let item: {
	title: string;
	companyName: string;
	companySlug?: string;
	description: string;
	isCurrent?: boolean;
	startDate?: Date;
	endDate?: Date;
	techTags?: string[];
};
export let onCardClick: () => void = () => {};
```

**Controller decision (overrides earlier plan paste):** Use a single shared card-body snippet so the `href` / no-`href` branches do not duplicate markup. Only the outer element (`<a>` vs `<div>`) and its classes/handlers differ.

- [ ] **Step 1: Add past-role fixture**

In `fixtures/sampleWorkItem.ts`, append:

```ts
export const samplePastWorkItem = {
	...sampleWorkItem,
	title: 'Senior Engineer',
	isCurrent: false,
	startDate: new Date('2019-03-01'),
	endDate: new Date('2021-12-15')
};
```

- [ ] **Step 2: Implement `WorkExperienceCardView.svelte`**

```svelte
<script lang="ts">
	import StatusIndicator from '../../feedback/StatusIndicator.svelte';
	import TechBackdrop from '../../media/TechBackdrop.svelte';
	import { getFormattedDate } from '../../../util/dates';
	import { workExperienceHref } from '../../../util/work-experience-href';
	import './gridCardChrome.css';

	export let item: {
		title: string;
		companyName: string;
		companySlug?: string;
		description: string;
		isCurrent?: boolean;
		startDate?: Date;
		endDate?: Date;
		techTags?: string[];
	};
	export let onCardClick: () => void = () => {};

	$: href = workExperienceHref(item.companySlug);
	$: isActive = Boolean(item.isCurrent);
	$: techTags = item.techTags ?? [];

	function handleGlowMove(event: PointerEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		target.style.setProperty('--grid-glow-x', `${x}%`);
		target.style.setProperty('--grid-glow-y', `${y}%`);
	}

	function handleGlowLeave() {
		// Keep last glow position while opacity fades (same as GridItemView).
	}
</script>

{#snippet cardBody()}
	<TechBackdrop tags={techTags} />

	{#if isActive}
		<span class="status-anchor">
			<StatusIndicator label="Now" variant="emerald" />
		</span>
		<span class="active-glare" aria-hidden="true">
			<span class="active-glare__spot"></span>
		</span>
	{/if}

	<div class="relative z-[1] flex flex-col grow">
		<div class="relative mb-7">
			<h3 class="card-heading font-bold {isActive ? 'pr-24' : ''}">{item.title}</h3>
			<p class="mt-2.5 text-sm italic text-gray-500 dark:text-gray-400">
				<span class="mr-1">at</span>
				<span class="not-italic font-medium text-gray-700 dark:text-gray-200">{item.companyName}</span>
			</p>
		</div>

		<p class="card-description leading-snug dark:text-gray-200 text-gray-600">
			{item.description}
		</p>

		<div class="flex grow"></div>

		<ul
			class="card-meta text-xs md:text-[13px] mt-7 flex flex-row flex-wrap gap-x-4 gap-y-2 dark:text-gray-300 items-center text-gray-500"
		>
			{#if item.startDate}
				<li class="opacity-80">
					{getFormattedDate(item.startDate)}
					{#if item.endDate}
						<span class="mx-1">-</span>
						{getFormattedDate(item.endDate)}
					{/if}
				</li>
			{/if}
		</ul>
	</div>
{/snippet}

<li class="list-none">
	{#if href}
		<a
			{href}
			class="card card--interactive grid-card relative p-6 sm:p-7 flex flex-col no-underline text-inherit"
			class:active-border={isActive}
			on:click={onCardClick}
			on:pointerenter={handleGlowMove}
			on:pointermove={handleGlowMove}
			on:pointerleave={handleGlowLeave}
		>
			{@render cardBody()}
		</a>
	{:else}
		<div
			class="card grid-card relative p-6 sm:p-7 flex flex-col"
			class:active-border={isActive}
			on:pointerenter={handleGlowMove}
			on:pointermove={handleGlowMove}
			on:pointerleave={handleGlowLeave}
		>
			{@render cardBody()}
		</div>
	{/if}
</li>

<style>
	.card-heading {
		font-size: clamp(1.05rem, 0.95rem + 0.45vw, 1.375rem);
		line-height: 1.2;
	}

	.card-description,
	.card-meta {
		text-shadow:
			0 0 1px var(--color-white),
			0 1px 1px var(--color-white);
	}

	:global(html.dark) .card-description,
	:global(html.dark) .card-meta {
		text-shadow:
			0 0 1px var(--color-gray-900),
			0 1px 1px var(--color-gray-900);
	}
</style>
```

Notes for implementer:
- Company name is plain text (not a link).
- No Details button / modal.
- Linked card uses `card--interactive`; fallback non-link uses `.card` only.
- Accessible name comes from heading + company text inside the link (no extra `aria-label` unless Storybook a11y flags need it).
- Card body must live in one `{#snippet}` / `{@render}` (or equivalent) — do not duplicate the inner markup across branches.

- [ ] **Step 3: Add stories**

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import WorkExperienceCardView from './WorkExperienceCardView.svelte';
	import { samplePastWorkItem, sampleWorkItem } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/WorkExperienceCard',
		component: WorkExperienceCardView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Whole-card link to a company work page. No nested interactives. ' +
						'Stories target `WorkExperienceCardView`; the public container wires Fathom.'
				}
			}
		}
	});
</script>

<Story name="Current Role" args={{ item: sampleWorkItem }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>

<Story name="Past Role" args={{ item: samplePastWorkItem }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>

<Story
	name="Missing Slug"
	args={{ item: { ...sampleWorkItem, companySlug: undefined } }}
>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>
```

- [ ] **Step 4: Check**

Run: `npm run check`

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add \
  src/components/domain/work/WorkExperienceCardView.svelte \
  src/components/domain/work/WorkExperienceCard.stories.svelte \
  src/components/domain/work/fixtures/sampleWorkItem.ts
git commit -m "$(cat <<'EOF'
Add WorkExperienceCardView with Storybook stories.

EOF
)"
```

---

### Task 4: `WorkExperienceCard` container + wire call sites

**Files:**
- Create: `src/components/domain/work/WorkExperienceCard.svelte`
- Modify: `src/routes/+page.svelte` (import + Work section loop)
- Modify: `src/routes/tech/[slug]/+page.svelte` (import + Related Work loop)

**Interfaces:**
- Consumes: `WorkExperienceCardView`, `fathom-client`
- Produces: public prop `item: any` only (no unused `tech` — controller decision)

- [ ] **Step 1: Create container**

```svelte
<script lang="ts">
	import * as Fathom from 'fathom-client';
	import WorkExperienceCardView from './WorkExperienceCardView.svelte';

	export let item: any;

	const handleCardClick = () => {
		if (!item?.companySlug) return;
		Fathom.trackEvent(`click_work_card-${item.title}`);
	};
</script>

<WorkExperienceCardView {item} onCardClick={handleCardClick} />
```

- [ ] **Step 2: Wire landing page**

In `src/routes/+page.svelte`:

Replace:

```ts
import GridItem from '../components/domain/work/GridItem.svelte';
```

with:

```ts
import GridItem from '../components/domain/work/GridItem.svelte';
import WorkExperienceCard from '../components/domain/work/WorkExperienceCard.svelte';
```

Replace the Work section loop body:

```svelte
{#each data.work as work}
	<WorkExperienceCard item={work} />
{/each}
```

Keep Projects on `GridItem`.

- [ ] **Step 3: Wire tech slug page**

In `src/routes/tech/[slug]/+page.svelte`:

Add import:

```ts
import WorkExperienceCard from '../../../components/domain/work/WorkExperienceCard.svelte';
```

Replace Related Work loop:

```svelte
{#each relatedWork as work}
	<WorkExperienceCard item={work} />
{/each}
```

Keep Related Projects on `GridItem`.

- [ ] **Step 4: Check**

Run: `npm run check`

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add \
  src/components/domain/work/WorkExperienceCard.svelte \
  src/routes/+page.svelte \
  src/routes/tech/[slug]/+page.svelte
git commit -m "$(cat <<'EOF'
Wire WorkExperienceCard on landing and tech pages.

EOF
)"
```

---

### Task 5: Playwright coverage for home work cards

**Files:**
- Modify: `tests/test.ts`

**Interfaces:**
- Consumes: home Work section rendered with `WorkExperienceCard`
- Produces: updated E2E assertions (no new helpers)

- [ ] **Step 1: Replace the home work navigation test**

Find:

```ts
test('home work company links to work detail', async ({ page }) => {
	await page.goto('/');
	const workCompany = page.locator('a[href^="/work/"]').first();
	await expect(workCompany).toBeVisible();
	const href = await workCompany.getAttribute('href');
	await workCompany.click();
	await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
});
```

Replace with:

```ts
test('home work cards link to work detail without nested details controls', async ({ page }) => {
	await page.goto('/');

	const workSection = page.locator('section').filter({
		has: page.getByRole('heading', { name: 'Work', exact: true })
	});
	const workCardLink = workSection.locator('.landing-grid a[href^="/work/"]').first();

	await expect(workCardLink).toBeVisible();
	await expect(workSection.getByRole('button', { name: /details/i })).toHaveCount(0);

	const href = await workCardLink.getAttribute('href');
	expect(href).toMatch(/^\/work\/[a-z0-9-]+\/?$/);

	await workCardLink.click();
	await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

- [ ] **Step 2: Run the updated test**

Run: `npx playwright test tests/test.ts -g "home work cards"`

Expected: PASS (requires local env / preview as this repo’s Playwright setup already does for other home tests)

- [ ] **Step 3: Commit**

```bash
git add tests/test.ts
git commit -m "$(cat <<'EOF'
Cover whole-card work links in Playwright.

EOF
)"
```

---

### Task 6: Strip work interaction from `GridItem` + update stories

**Files:**
- Modify: `src/components/domain/work/GridItemView.svelte` — remove `type === 'work'` branches; keep project UI + modal
- Modify: `src/components/domain/work/GridItem.svelte` — project-only analytics
- Modify: `src/components/domain/work/GridItem.stories.svelte` — remove Work Current story; document project-only

**Interfaces:**
- Consumes: project item shape only
- Produces: `GridItem` / `GridItemView` props after cleanup:

```ts
export let item: any;
export let idHash: ((name: string) => string) | undefined = undefined;
export let tech: Array<{ name: string; type?: string }> = [];
// GridItemView callbacks:
export let onLinkClick: (linkType: string, itemName: string) => void = () => {};
export let onSourceClick: (itemName: string) => void = () => {};
export let onDetailsClick: () => void = () => {};
```

Remove `type` prop entirely. Update remaining call sites that pass `type="project"` to omit it (landing + tech + work slug related projects).

- [ ] **Step 1: Simplify `GridItemView.svelte` to project-only**

Concrete edits:
- Delete `export let type...`
- Set `isActive = Boolean(item.isActive)`, `statusLabel = 'In progress'`, `statusVariant = 'subtle'`, `titleField = item.name`
- Keep `id={idHash ? idHash(item.name) : undefined}`
- Keep `class:active-border--subtle={isActive}` (always subtle for projects)
- Delete the entire `{#if type === 'work'}...{:else}...{/if}` header block; keep only the project header (title link / span)
- Keep project description `line-clamp-4`, source link, Details buttons, `DetailsModal` with `type="project"`
- Delete unused `companyOrUrl` and work date branch (`type === 'work' && item.endDate`)

- [ ] **Step 2: Simplify `GridItem.svelte`**

```svelte
<script lang="ts">
	import * as Fathom from 'fathom-client';
	import GridItemView from './GridItemView.svelte';

	export let item: any;
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	const handleLinkClick = (_linkType: string, itemName: string) => {
		Fathom.trackEvent(`click_project_link-${itemName}`);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		Fathom.trackEvent(`click_project_details-${item.name}`);
	};
</script>

<GridItemView
	{item}
	{idHash}
	{tech}
	onLinkClick={handleLinkClick}
	onSourceClick={handleSourceClick}
	onDetailsClick={handleDetailsClick}
/>
```

- [ ] **Step 3: Update call sites that still pass `type="project"`**

In these files, change `<GridItem ... type="project" ... />` → `<GridItem ... />` (drop `type`):

- `src/routes/+page.svelte`
- `src/routes/tech/[slug]/+page.svelte`
- `src/routes/work/[slug]/+page.svelte`

- [ ] **Step 4: Update `GridItem.stories.svelte`**

Remove the Work Current story and `sampleWorkItem` import. Keep Project Active. Update docs description to say project card only; work cards live under `Domain/Work/WorkExperienceCard`.

- [ ] **Step 5: Check + unit tests**

Run:

```bash
npm run check
npx vitest run src/util/work-experience-href.test.ts
```

Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add \
  src/components/domain/work/GridItem.svelte \
  src/components/domain/work/GridItemView.svelte \
  src/components/domain/work/GridItem.stories.svelte \
  src/routes/+page.svelte \
  src/routes/tech/[slug]/+page.svelte \
  src/routes/work/[slug]/+page.svelte
git commit -m "$(cat <<'EOF'
Make GridItem project-only after work card split.

EOF
)"
```

---

### Task 7: Final verification

**Files:**
- None new — verification only

- [ ] **Step 1: Full static checks**

Run:

```bash
npm run check
npm run lint
npx vitest run src/util/work-experience-href.test.ts
```

Expected: all pass

- [ ] **Step 2: Playwright work-related tests**

Run:

```bash
npx playwright test tests/test.ts -g "work"
```

Expected: work index + home work card tests PASS

- [ ] **Step 3: Manual spot-check**

Run: `npm run dev`

Confirm:
1. Home Work cards: entire card navigates to `/work/{slug}/`
2. No “View details” / Details on work cards
3. Projects still open Details modal
4. Tech page Related Work cards behave like home
5. Company page role Details modal still works

- [ ] **Step 4: Commit only if verification produced fixes; otherwise done**

If fixes were needed, commit them with a focused message. Otherwise no empty commit.

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| New `WorkExperienceCard` + View | 3, 4 |
| Shared chrome CSS | 2 |
| Whole-card link, no nested interactives | 3 |
| Missing slug → non-link | 1, 3 |
| Fathom `click_work_card-{title}` | 4 |
| Landing + tech call sites | 4 |
| Remove dead work UI from GridItem | 6 |
| Playwright home card + no Details | 5 |
| Storybook current + past | 3 |
| Projects / company modals unchanged | 4, 6, 7 |
