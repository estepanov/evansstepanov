# About Node.js Headline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the home About second paragraph so it names TypeScript, Node.js backends, and React frontends, with icons from `getTechIcon` / `TechIcon`.

**Architecture:** Single markup + import cleanup in `src/routes/+page.svelte`. Icons resolve through the existing shared map (`'TypeScript'`, `'Node.js'`, `'React'`); no new components or map entries.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind, existing `TechIcon` + `getTechIcon`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-25-about-nodejs-headline-design.md`
- Exact copy: “I primarily work in TypeScript, building Node.js backends and React frontends, with modern JavaScript tooling.”
- Purple semibold on tech **names** only; “backends” / “frontends” plain
- Display label `Node.js` (not `NodeJS`); lookup key `'Node.js'`
- Icons via `<TechIcon icon={getTechIcon('…')} size={16} />` inside `<span class="inline-block">`
- Do not edit `src/util/tech-icons.ts`
- No new automated tests (copy/markup only)
- Touch only `src/routes/+page.svelte` for the feature

---

## File structure

| File                                         | Role                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `src/routes/+page.svelte`                    | Home page; About second paragraph + remove unused Simple Icons imports |
| `src/components/domain/tech/TechIcon.svelte` | Unchanged consumer of icon descriptors                                 |
| `src/util/tech-icons.ts`                     | Unchanged; already maps TypeScript, Node.js, React                     |

---

### Task 1: Update About copy and wire TechIcon

**Files:**

- Modify: `src/routes/+page.svelte` (script imports ~line 20; About second `<p>` ~lines 118–126)
- Test: manual on `/`; `npm run check`

**Interfaces:**

- Consumes: `getTechIcon(techName: string): TechIcon | null`; `TechIcon` props `{ icon: TechIcon | null; size?: number }` (default size 24)
- Produces: updated About markup; no new exports

- [ ] **Step 1: Remove unused Simple Icons import**

In `src/routes/+page.svelte`, delete this line:

```ts
import { SiReact, SiTypescript } from '@icons-pack/svelte-simple-icons';
```

Keep the existing imports (already present near the top of the script):

```ts
import { getTechIcon } from '../util/tech-icons';
import TechIcon from '../components/domain/tech/TechIcon.svelte';
```

- [ ] **Step 2: Replace the About second-paragraph stack sentence**

Replace the current block:

```svelte
<p class="leading-relaxed">
	I primarily work in <span class="font-semibold text-purple-700 dark:text-purple-400">
		TypeScript <span class="inline-block"><SiTypescript size={16} /></span>
	</span>
	and specialize in
	<span class="font-semibold text-purple-700 dark:text-purple-400">
		React <span class="inline-block"><SiReact size={16} /></span>
	</span> with modern JavaScript tooling. I thrive on solving complex technical challenges with elegant,
	user-focused solutions.
</p>
```

with:

```svelte
<p class="leading-relaxed">
	I primarily work in
	<span class="font-semibold text-purple-700 dark:text-purple-400">
		TypeScript
		<span class="inline-block"><TechIcon icon={getTechIcon('TypeScript')} size={16} /></span>
	</span>, building
	<span class="font-semibold text-purple-700 dark:text-purple-400">
		Node.js
		<span class="inline-block"><TechIcon icon={getTechIcon('Node.js')} size={16} /></span>
	</span>
	backends and
	<span class="font-semibold text-purple-700 dark:text-purple-400">
		React
		<span class="inline-block"><TechIcon icon={getTechIcon('React')} size={16} /></span>
	</span>
	frontends, with modern JavaScript tooling. I thrive on solving complex technical challenges with elegant,
	user-focused solutions.
</p>
```

Do not change the first About paragraph or the hobbies paragraph.

- [ ] **Step 3: Typecheck**

Run: `npm run check`

Expected: no errors related to `+page.svelte` or unused `Si*` imports. Exit code 0 (or only pre-existing unrelated diagnostics, if any).

- [ ] **Step 4: Manual verify**

Run: `npm run dev` (requires `.env` with Notion vars per `CLAUDE.md`).

Open `/` and confirm:

1. Sentence reads: “I primarily work in TypeScript, building Node.js backends and React frontends, with modern JavaScript tooling.”
2. Three inline icons appear after TypeScript, Node.js, and React (size ~16, aligned like other About callouts).
3. “backends” / “frontends” are not purple-semibold.
4. “I thrive…” sentence is unchanged.
5. Spot-check light and dark theme.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "$(cat <<'EOF'
Update About headline for Node.js backends and React frontends.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement                               | Task                                  |
| ---------------------------------------------- | ------------------------------------- |
| New wording + tooling clause + thrive sentence | Task 1 Step 2                         |
| Purple on names only                           | Task 1 Step 2 markup                  |
| `Node.js` label + `'Node.js'` key              | Task 1 Step 2                         |
| `TechIcon` / `getTechIcon` at size 16          | Task 1 Step 2                         |
| Remove direct Simple Icons imports             | Task 1 Step 1                         |
| Do not edit `tech-icons.ts`                    | Global constraint; no task touches it |
| Manual verify; no automated tests              | Task 1 Steps 3–4                      |
