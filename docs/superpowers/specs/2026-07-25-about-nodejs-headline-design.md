# About headline: Node.js backends + React frontends

**Date:** 2026-07-25  
**Status:** Approved design  
**Scope:** Update the home About second paragraph to name Node.js backends and React frontends, rendering tech icons via the shared `TechIcon` / `getTechIcon` path.

## Goals

- Reflect the stack split: TypeScript as primary language, Node.js for backends, React for frontends.
- Keep the existing “with modern JavaScript tooling” clause and the “I thrive…” sentence.
- Use the shared icon map so About prose does not depend on direct Simple Icons imports.

## Non-goals

- Changing the first About paragraph or other pages.
- Adding or remapping icons in `tech-icons.ts` (Node.js already exists).
- New components, CSS, Storybook stories, or automated tests for this copy change.

## Decisions

| Topic            | Choice                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Wording          | “I primarily work in TypeScript, building Node.js backends and React frontends, with modern JavaScript tooling.” |
| Emphasis         | Purple semibold on tech **names** only (TypeScript, Node.js, React); “backends” / “frontends” stay plain         |
| Display label    | `Node.js` (not `NodeJS`)                                                                                         |
| Icon lookup keys | `'TypeScript'`, `'Node.js'`, `'React'` via `getTechIcon`                                                         |
| Icon rendering   | `<TechIcon icon={…} size={16} />` in an `inline-block` span, matching current About callouts                     |
| Approach         | Shared `TechIcon` path (not direct `@icons-pack/svelte-simple-icons` on the page)                                |

## Copy

Final second paragraph:

> I primarily work in TypeScript [icon], building Node.js [icon] backends and React [icon] frontends, with modern JavaScript tooling. I thrive on solving complex technical challenges with elegant, user-focused solutions.

## Implementation

**File:** `src/routes/+page.svelte` only.

1. In the About second `<p>`, replace the current TypeScript / React specialization sentence with the copy above.
2. For each of TypeScript, Node.js, and React: wrap the name in the existing purple emphasis classes; place `<TechIcon icon={getTechIcon('…')} size={16} />` immediately after the name inside `<span class="inline-block">`.
3. Remove unused `SiTypescript` / `SiReact` imports from `@icons-pack/svelte-simple-icons` (`getTechIcon` and `TechIcon` are already imported on this page).
4. Do not edit `src/util/tech-icons.ts`.

## Error handling

If `getTechIcon` returns `null`, `TechIcon` renders nothing and the text name still shows. Not expected for these three keys; no extra fallback UI.

## Verification

- Manual: load `/` and confirm wording, three inline icons, and alignment in light and dark themes.
- Automated: none required (copy/markup only).
