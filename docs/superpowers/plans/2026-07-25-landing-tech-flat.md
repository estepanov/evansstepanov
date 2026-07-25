# Flat Landing Tech Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing page's nine bordered Tech cards and their proficiency chart/filter machinery with a flat stack of category rows.

**Architecture:** Everything happens in one file, `src/routes/+page.svelte`. The Tech `<section>` markup is swapped for a `.tech-rows` container holding one `.tech-row` per category; the component's proficiency state and the ~480 lines of card/chart CSS are deleted. The now-orphaned `src/components/Select.svelte` is removed. `+page.server.ts` and the `/tech` routes are untouched — the same `data.tech` array feeds the new markup.

**Tech Stack:** SvelteKit 2, Svelte 5 (this file uses the legacy `export let` / `$:` syntax — match it, do not convert to runes), Tailwind 4, Playwright, `svelte-check`.

**Spec:** `docs/superpowers/specs/2026-07-25-landing-tech-flat-design.md`

## Global Constraints

- Branch is already created and checked out: `design/flat-tech-section`. Do not create another.
- **Prerequisite for running tests:** `npm test` runs `npm run build && npm run preview` first, and the build reads Notion. A `.env` with `NOTION_TOKEN`, `LANDING_LINKS_NOTION_DB_ID`, `PROJECTS_NOTION_DB_ID`, `WORK_NOTION_DB_ID`, and `TECH_NOTION_DB_ID` must exist or every Playwright run fails at the build step. If it is missing, stop and tell the user — do not stub the data.
- Do not modify `src/routes/+page.server.ts`, `src/routes/tech/**`, or any component other than the two named in this plan.
- Do not convert the file to Svelte 5 runes. It uses `export let data;` and `$:` reactive statements. Keep that style.
- Hover/focus tint color is `emerald-600` in light mode, `emerald-400` in dark. Category label idle color is `slate-500` / `slate-400`; item idle color is `slate-700` / `slate-300`.
- Dark mode is driven by a `.dark` class on `<html>`, not a media query. In scoped `<style>` blocks this file writes `:global(html.dark) .selector { … }`. Follow that exact pattern.
- Per-row entrance stagger uses the CSS variable `--item-delay`, because the page's existing shared reveal rule already reads `calc(var(--reveal-delay, 0ms) + var(--item-delay, 40ms))`. Do not invent a new `--row-delay` variable or a new keyframe.

## File Structure

| File | Change | Responsibility after the change |
|---|---|---|
| `tests/test.ts` | Modify | Playwright specs: existing h1 check, plus new structural assertions for the flat tech rows and the absence of proficiency controls |
| `src/routes/+page.svelte` | Modify | Landing page. Tech section becomes flat rows; proficiency state and card/chart CSS removed |
| `src/components/Select.svelte` | Delete | — (landing page was its only consumer) |

---

### Task 1: Flat tech rows replace the card grid

**Files:**
- Test: `tests/test.ts`
- Modify: `src/routes/+page.svelte` (script block lines 1–101; Tech section markup lines 282–507)

**Interfaces:**
- Consumes: `data.tech` — an array of `{ name: string; type?: string; proficiency: string; proficiencyWeight: number }` supplied by `+page.server.ts`, already sorted by `proficiencyWeight` descending. Also the existing `techTypes` reactive statement, the `revealOnView` and `stuckDetect` actions, `getTechIcon` from `../util/tech-icons`, and the `TechIcon` component — all already present in the file and all kept.
- Produces: DOM class names that Task 2's CSS and the tests both target: `.tech-rows`, `.tech-row`, `.tech-row__label`, `.tech-row__label-text`, `.tech-row__rule`, `.tech-row__items`, `.tech-item`, `.tech-item__icon`, `.tech-item__fallback`, `.tech-item__name`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/test.ts` (keep the existing `index page has expected h1` test above it):

```ts
test('tech section renders flat category rows', async ({ page }) => {
	await page.goto('/');

	const rows = page.locator('.tech-rows .tech-row');
	expect(await rows.count()).toBeGreaterThan(0);

	// Category label links to its anchor on the full tech page.
	const firstLabel = rows.first().locator('.tech-row__label');
	await expect(firstLabel).toHaveAttribute('href', /^\/tech\/#/);

	// Every item links to its own tech detail page.
	const items = page.locator('.tech-rows .tech-item');
	expect(await items.count()).toBeGreaterThan(0);
	await expect(items.first()).toHaveAttribute('href', /^\/tech\/[^#]/);
});

test('tech section has no card surfaces or proficiency controls', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('.tech-group-card')).toHaveCount(0);
	await expect(page.locator('.tech-tile')).toHaveCount(0);
	await expect(page.locator('.prof-mini__bar')).toHaveCount(0);
	await expect(page.getByRole('button', { name: /proficiency/i })).toHaveCount(0);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx playwright test`

Expected: `index page has expected h1` passes. Both new tests FAIL — the first because `.tech-rows` matches zero elements (`expect(0).toBeGreaterThan(0)`), the second because `.tech-group-card` currently matches 9 elements.

- [ ] **Step 3: Delete the proficiency state from the script block**

In `src/routes/+page.svelte`, remove these from the `<script>` block:

- The `categoryMeta` const (lines 24–34) in full.
- The `proficiencyLevel` const (lines 48–53) in full — it is dead code, referenced nowhere.
- The `proficiencyTone` const (line 55).
- The `proficiencyDisplay` const and the `profCounts` / `profMax` / `profMean` / `profSpread` / `profIsBalanced` reactive statements (lines 75–94).
- `selectedProf`, `toggleProf`, and `showProfChart` (lines 96–101).

Trim the imports accordingly. The Lucide import becomes exactly:

```ts
import { MousePointer, ShoppingCart } from '@lucide/svelte';
```

Delete these two import lines entirely — the proficiency chart was their only consumer:

```ts
import { slide, fade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import Select from '../components/Select.svelte';
```

Keep everything else: `Logo`, `idHash`, `getTechIcon`, `TechIcon`, `SiReact`/`SiTypescript`, `LinksSection`, `GridItem`, `ProfileDiamond`, `PageContainer`, `preferredTechOrder`, `proficiencyOrder`, the `techTypes` reactive statement, `revealOnView`, and `stuckDetect`.

Note: `proficiencyOrder` is retained only if something still reads it. After the deletions above nothing does — remove it too (lines 74).

- [ ] **Step 4: Replace the Tech section markup**

Replace the entire Tech `<section>` — currently lines 282–507, from `<section use:revealOnView class="landing-section reveal-ready">` that contains the `Tech` heading, through the closing `</section>` after the `.tech-grid` div — with:

```svelte
		<section use:revealOnView class="landing-section reveal-ready">
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-center justify-between py-3"
			>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Tech
				</h2>
			</div>
			<div class="tech-rows mt-6">
				{#each techTypes as techType, rowIdx}
					{@const techItems = data.tech
						.filter((tech) => tech.type === techType)
						.slice()
						.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)}
					{#if techItems.length > 0}
						<div class="tech-row" style="--item-delay: {rowIdx * 70}ms;">
							<a href="/tech/#{techType.toLowerCase()}" class="tech-row__label">
								<span class="tech-row__label-text">{techType}</span>
								<span class="tech-row__rule" aria-hidden="true"></span>
							</a>
							<ul class="tech-row__items">
								{#each techItems as tech}
									{@const techIcon = getTechIcon(tech.name)}
									<li>
										<a href="/tech/{tech.name}" class="tech-item" title={tech.name}>
											<span class="tech-item__icon">
												{#if techIcon}
													<TechIcon icon={techIcon} size={18} />
												{:else}
													<span class="tech-item__fallback">{tech.name.charAt(0)}</span>
												{/if}
											</span>
											<span class="tech-item__name">{tech.name}</span>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</section>
```

Two details that matter and are easy to get wrong:

1. The category label's `href` is `/tech/#{techType.toLowerCase()}`. In Svelte, `{...}` inside an attribute is interpolation, so this renders as `/tech/#language` — the `#` is a literal character, not part of the expression. This matches the existing behavior exactly; do not "fix" it to `/tech#language`.
2. `.tech-row` is a `<div>`, not a nested `<section>`. A sectioning element inside the Tech section would add a nameless region to the accessibility tree.

- [ ] **Step 5: Add the row styles**

Add to the `<style>` block of `src/routes/+page.svelte`. Put it where the deleted `.tech-group-card` rules were, so the file's ordering still groups tech styles together:

```css
	/* Flat tech rows. The section signals breadth at a glance — depth lives on
	 * /tech — so there is no card surface, no proficiency label, and no hover
	 * lift. The only texture is the brand icons; hover tints text + icon. */
	.tech-rows {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.tech-row {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.tech-row__label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-slate-500);
		transition: color 200ms ease;
	}

	:global(html.dark) .tech-row__label {
		color: var(--color-slate-400);
	}

	.tech-row__label-text {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* The rule fills whatever the label text leaves, so every row's hairline
	 * ends flush at the right margin regardless of label length. */
	.tech-row__rule {
		flex: 1;
		height: 1px;
		background-color: var(--color-slate-200);
		transition: background-color 200ms ease;
	}

	:global(html.dark) .tech-row__rule {
		background-color: var(--color-slate-800);
	}

	.tech-row__label:hover,
	.tech-row__label:focus-visible {
		color: var(--color-emerald-600);
	}

	:global(html.dark) .tech-row__label:hover,
	:global(html.dark) .tech-row__label:focus-visible {
		color: var(--color-emerald-400);
	}

	.tech-row__items {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1.5rem;
		row-gap: 0.625rem;
	}

	.tech-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-slate-700);
		transition: color 200ms ease;
	}

	:global(html.dark) .tech-item {
		color: var(--color-slate-300);
	}

	.tech-item:hover,
	.tech-item:focus-visible {
		color: var(--color-emerald-600);
	}

	:global(html.dark) .tech-item:hover,
	:global(html.dark) .tech-item:focus-visible {
		color: var(--color-emerald-400);
	}

	/* outline (not a box-shadow ring) so the focus indicator can sit outside the
	 * element without a wrapper — these links have no padding to inset into. */
	.tech-row__label:focus-visible,
	.tech-item:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--color-emerald-500) 60%, transparent);
		outline-offset: 3px;
		border-radius: 0.25rem;
	}

	:global(html.dark) .tech-row__label:focus-visible,
	:global(html.dark) .tech-item:focus-visible {
		outline-color: color-mix(in oklab, var(--color-emerald-400) 60%, transparent);
	}

	.tech-item__icon {
		display: inline-flex;
		flex-shrink: 0;
	}

	.tech-item__name {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.tech-item__fallback {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 0.25rem;
		background-color: var(--color-slate-100);
		color: var(--color-slate-500);
		font-size: 10px;
		font-weight: 600;
		line-height: 1;
	}

	:global(html.dark) .tech-item__fallback {
		background-color: var(--color-slate-800);
		color: var(--color-slate-400);
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-row__label,
		.tech-row__rule,
		.tech-item {
			transition: none;
		}
	}
```

- [ ] **Step 6: Repoint the reveal selectors at the new class names**

Three places in the `<style>` block still name `.tech-grid .tech-group-card`. Each must become `.tech-rows .tech-row`:

1. The pre-reveal hidden state (currently lines 544–547):

```css
	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.tech-rows
		.tech-row,
```

2. The `animation: none` override immediately after it (currently lines 553–558):

```css
	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.tech-rows
		.tech-row {
		animation: none;
	}
```

3. The `.is-visible` reveal rule (currently line 569): change `.tech-grid .tech-group-card` to `.tech-rows .tech-row` in that selector list.

Then in the page-level `@media (prefers-reduced-motion: reduce)` block (currently line 762), change `.tech-grid .tech-group-card` to `.tech-rows .tech-row`.

That is all the wiring the stagger needs — the inline `--item-delay` set in Step 4 feeds the existing `landing-content-in` rule.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx playwright test`

Expected: all three tests PASS.

- [ ] **Step 8: Commit**

```bash
git add tests/test.ts src/routes/+page.svelte
git commit -m "refactor(landing): flatten tech section into category rows"
```

---

### Task 2: Purge the dead card, tile, and proficiency CSS

**Files:**
- Modify: `src/routes/+page.svelte` (`<style>` block)

**Interfaces:**
- Consumes: the class names Task 1 removed from the markup. Nothing in this task adds new selectors.
- Produces: nothing new. This is deletion only.

Task 1 removed the markup but left its stylesheet behind. Every rule below now matches zero elements.

- [ ] **Step 1: Delete the proficiency chart and filter styles**

Remove these rule sets from the `<style>` block in full, including their `@media (prefers-reduced-motion: reduce)` blocks and the comments attached to them:

`.prof-bar`, `.prof-bar--selected`, `.prof-mean-line`, `.prof-hit`, `@keyframes prof-bar-in`, `.prof-controls`, `.prof-toggle` (all variants, including `[aria-expanded='true']` and `.prof-toggle__chevron`), `.prof-mini`, `.prof-mini__bar`, `.prof-mini__seg`, `.prof-mini__seg-fill`, `.prof-mini__seg--selected`, `.prof-mini__seg--dim`, `.prof-mini__tip`, `.prof-mini__tip-count`, and `.tile-dimmed`.

Also delete the two rules that target the removed controls through the sticky state:

```css
	.section-header:global(.is-stuck) .prof-toggle { … }
	.section-header:global(.is-stuck) .prof-mini { … }
```

Keep every other `.section-header` and `.section-title` rule — Work and Projects still use them.

- [ ] **Step 2: Delete the card and tile styles**

Remove in full: `.tech-group-card` (including its `@media (hover: hover)` block and the `:global(html.dark)` variants), `@keyframes tech-card-in`, `.tech-tile`, `.tech-tile-icon`, `.tech-tile-name` (including `::after`), `.tech-card-label` (including `::after`), `.tech-card-link` rules, `.tech-card-icon` (including its `@media (hover: hover)` block), and `.tech-prof-rule`.

In the final page-level `@media (prefers-reduced-motion: reduce)` block, delete the entries for `.tech-group-card`, `.tech-tile-icon`, `.tech-prof-rule`, `.tech-card-label::after`, `.tech-card-icon`, and `.tech-tile-name::after`. Leave the `.tech-rows .tech-row` entry from Task 1 Step 6 and every non-tech entry intact.

- [ ] **Step 3: Verify nothing that is still rendered lost its styles**

Run: `grep -n "prof-\|tech-group\|tech-tile\|tech-card" src/routes/+page.svelte`

Expected: no output. Any hit means either a rule survived or markup was missed.

- [ ] **Step 4: Run the checks**

Run: `npm run check && npm run lint`

Expected: both pass. `svelte-check` reports zero errors — it flags unused imports and undefined references, so a missed deletion in Task 1's script block surfaces here.

- [ ] **Step 5: Run the tests**

Run: `npx playwright test`

Expected: all three tests PASS. Deleting unused CSS must not change behavior; if a test fails, a rule that was still in use was removed.

- [ ] **Step 6: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "refactor(landing): remove dead tech card and proficiency styles"
```

---

### Task 3: Delete the orphaned Select component

**Files:**
- Delete: `src/components/Select.svelte`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

`src/routes/+page.svelte` was this component's only importer, and Task 1 removed that import.

- [ ] **Step 1: Confirm it has no remaining consumers**

Run: `grep -rn "Select" src/ --include="*.svelte" --include="*.ts"`

Expected: no hit that imports or renders `Select.svelte`. Incidental substring matches in unrelated words (for example `getSelection`, `selected`) are fine — read the output, do not just check that it is empty. If a real importer exists, stop and report it rather than deleting the file.

- [ ] **Step 2: Delete the file**

```bash
git rm src/components/Select.svelte
```

- [ ] **Step 3: Verify the build still resolves**

Run: `npm run check`

Expected: passes with zero errors. A dangling import would fail here.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove unused Select component"
```

---

### Task 4: Full verification

**Files:** none modified — this task only runs checks and reports.

**Interfaces:**
- Consumes: the finished state of Tasks 1–3.
- Produces: a pass/fail report for the user.

- [ ] **Step 1: Run the full check suite**

Run: `npm run check && npm run lint && npm run test:unit && npx playwright test`

Expected: all pass. Paste the actual output. If any command fails, report the failure verbatim — do not describe the work as complete.

- [ ] **Step 2: Visual check**

Run `npm run dev` and inspect the landing page's Tech section against the spec:

- Category rows stack vertically, each with a label and a hairline rule running to the right margin.
- Items wrap within a row; no card borders, backgrounds, or shadows anywhere in the section.
- Hovering an item tints the name and its icon emerald with no movement.
- Tab through the section: every category label and every item shows a visible focus outline.
- Toggle dark mode: labels, rules, item text, and hover tint all remain legible.
- Narrow the window to a phone width: rows wrap without horizontal overflow.
- In DevTools, emulate `prefers-reduced-motion: reduce` and reload — rows appear with no animation.

Report anything that does not match. Do not fix visual issues silently; surface them.

- [ ] **Step 3: Report the diff size**

Run: `git diff main --stat`

Report the actual numbers. The spec predicted roughly −480 lines net; a large divergence is worth mentioning, not worth forcing.
