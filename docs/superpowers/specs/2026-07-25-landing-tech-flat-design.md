# Landing page Tech section — flat rows

Date: 2026-07-25
Branch: `design/flat-tech-section`

## Problem

The Tech section on the landing page carries more machinery than its job requires. It renders nine bordered category cards, each with a hover lift, a dashed header rule, an icon tile, and a two-column tile grid. Above the grid sits a proficiency system: a collapsible bar chart with a mean line, a segmented mini-bar filter that swaps in when the sticky header sticks, a custom `Select` dropdown, and tile dimming driven by the selected level.

That is roughly 480 of the page's 1250 lines. It also duplicates `/tech`, which already offers the full browsing surface — categories, descriptions, explicit proficiency levels, and per-tech detail pages.

## Goal

The landing section signals breadth at a glance. Nothing on it needs to be operated. Depth stays on `/tech`.

## Design

### Layout

Nine cards become a stack of category rows. Each row is a small tracked uppercase label with a hairline rule running from the label to the right margin, followed by a wrapping field of icon+name links.

```
TECH                                          ← sticky, shrinks (unchanged)

RUNTIME ──────────────────────────────────────
  ⬢ Node.js    ⬢ Deno    ⬢ Bun

LANGUAGE ─────────────────────────────────────
  ⬢ TypeScript    ⬢ JavaScript    ⬢ Python    ⬢ Go

FRAMEWORK ────────────────────────────────────
  ⬢ React    ⬢ SvelteKit    ⬢ Next.js    ⬢ Express
```

No card surface, border, shadow, or hover lift. No category icon — the label is text.

### Items

Brand icon at 18px (via the existing `getTechIcon` / `TechIcon` pair) next to the name. No pill, background, or border. Items with no matching icon keep the current fallback: a rounded square holding the name's first character.

Items sort strongest-first within each row by `proficiencyWeight` descending — already how `+page.server.ts` sorts `data.tech`. No proficiency label, badge, or opacity ramp is drawn. The ordering carries the signal implicitly; `/tech` states levels explicitly.

Category order follows the existing `preferredTechOrder`, with any unlisted types appended alphabetically. Rows with zero items are not rendered.

### Links

Information architecture is unchanged — this cleanup is purely visual.

- Category label links to `/tech/#<category-lowercased>`
- Each item links to `/tech/<name>`

### Interaction and motion

- Hover and focus tint the item's name and icon emerald (`emerald-600` light, `emerald-400` dark), matching the tone the current tech cards use. Nothing scales, lifts, or underlines.
- Focus-visible ring is preserved on every link (`emerald-500/60`, `emerald-400/60` dark).
- Entrance is one fade-slide per row via `--item-delay: {i * 70}ms`, reusing the existing `revealOnView` action and the `landing-content-in` keyframe that Work and Projects already use. The variable is `--item-delay` rather than a new `--row-delay` because the page's shared reveal rule already reads `calc(var(--reveal-delay, 0ms) + var(--item-delay, 40ms))`.
- The `prefers-reduced-motion` block covers `.tech-row` in place of `.tech-group-card`.
- The sticky shrinking section header stays, so Tech continues to match Work and Projects.

## Removals

All in `src/routes/+page.svelte` unless noted.

| Removed | Current lines |
|---|---|
| Proficiency chart — bars, mean line, caption, `slide`/`fade` transitions | ~348–425 |
| Sticky-swap mini segmented filter, `Select` dropdown, `prof-toggle` | ~292–346 |
| State: `showProfChart`, `selectedProf`, `toggleProf`, `profCounts`, `profMax`, `profMean`, `profSpread`, `profIsBalanced`, `proficiencyDisplay`, `proficiencyTone` | 48–101 |
| `proficiencyLevel` — dead code, referenced nowhere | 48–53 |
| `categoryMeta` and its Lucide imports: `Cpu`, `Code2`, `Boxes`, `Library`, `Database`, `Wrench`, `Sparkles`, `Cloud`, `BarChart3`, `Tag`, `ChevronDown` | 8–34 |
| CSS: all `.prof-*`, `.tech-group-card`, `.tech-tile-*`, `.tech-card-*`, `.tile-dimmed`, `@keyframes prof-bar-in`, `@keyframes tech-card-in` | ~776–1257 |
| `src/components/Select.svelte` — the landing page is its only consumer | whole file |

`MousePointer` and `ShoppingCart` imports stay; the About section uses them. `cubicOut`, `slide`, and `fade` imports go — the proficiency chart was their only consumer.

Net: about −480 lines, replaced by roughly 60 lines of markup and 50 of CSS.

## Out of scope

`/tech` and `/tech/[slug]` are untouched. They remain where proficiency levels, descriptions, and category anchors live.

`src/routes/+page.server.ts` is untouched. The same `data.tech` shape feeds the new markup.

No unrelated refactoring of the About, Links, Work, or Projects sections.

## Verification

- `npm run check` passes (svelte-check catches any now-unused import or binding).
- `npm run lint` passes.
- `npm test` (Playwright) passes. A grep of `tests/` for `prof`, `Proficiency`, `tech-tile`, and `tech-group` returned no matches, so no test is expected to need updating — but this is confirmed by running the suite, not assumed.
- Visual check in `npm run dev` at mobile and desktop widths, in both light and dark themes, and with `prefers-reduced-motion: reduce` forced.
