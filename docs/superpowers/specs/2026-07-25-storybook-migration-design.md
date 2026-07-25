# Storybook migration & functional grouping

**Date:** 2026-07-25  
**Status:** Accepted  
**Scope:** Reorganize components on disk to mirror Storybook taxonomy, migrate full story coverage, extract presentational shells for analytics-coupled composites.

## Goals

- **Primary:** Living catalog — browse by role (actions, layout, chrome, …) and by domain feature for composites.
- **Secondary:** Enough coverage and isolation that visual QA (Chromatic / Playwright against `build-storybook`) is possible later without another restructuring.
- **Coverage:** Every Svelte component under `src/components` plus `ThemeToggle` gets at least one Default story.
- **Isolation:** Presentational `*View` shells for Fathom-coupled (or prop-heavy) composites so stories never depend on analytics or live Notion.

## Non-goals

- CI visual regression / Chromatic wiring (document the hook only).
- Redesigning component visuals while moving files.
- MDX docs index pages as the main navigation model.
- Keeping a long-lived re-export shim for `ThemeToggle` under `$lib/components` (update the single layout import in place).

## Decisions

| Topic | Choice |
| --- | --- |
| Catalog vs QA | Catalog first; structure enables QA later |
| Sidebar organization | Hybrid: function groups for primitives, `Domain/<feature>` for composites |
| Disk layout | Mirror Storybook taxonomy (Approach 2) |
| Coverage | Full inventory |
| Analytics / data | Extract presentational shells; fixtures in stories |

## Taxonomy & folder layout

Stories stay colocated. `defineMeta({ title })` matches the folder path.

```
src/components/
  actions/          # AnchorButton, SpecialButton, ButtonContainer, Link, Select
  feedback/         # StatusIndicator, SimpleSpinner
  chrome/           # SiteHeader, Logo, LogoIcon, ThemeToggle (from src/lib/components/)
  layout/           # PageContainer, Section, StickySectionHeader
  media/            # LazyLoadImage, MiniImageGallery, TechBackdrop, ProfileDiamond
  icons/            # existing custom tech icons (unchanged location)
  domain/
    tech/           # TechHeader, TechIcon, TopicHero
    work/           # GridItem (+ View), DetailsModal (+ View)
    links/          # LinkItem (+ View), LinksSection (already a folder)
```

**Storybook title examples:** `Actions/Link`, `Chrome/SiteHeader`, `Domain/Work/GridItem` (story binds `GridItemView`), `Icons/AwsIcon`.

**Placement rules**

- Primitives → function folders.
- Feature-specific composites → `domain/<feature>/`.
- Pure icon SVGs stay under `icons/`.
- `TechIcon` stays under `domain/tech/` (resolves registry icons; not a raw SVG wrapper).
- `TopicHero` stays under `domain/tech/` (tech-page composition, not generic layout).
- No separate `brand/` folder — `Logo` / `LogoIcon` live in `chrome/`.

## Presentational shells

| Public export (routes keep this name) | Shell | Shell owns | Container owns |
| --- | --- | --- | --- |
| `domain/work/GridItem.svelte` | `GridItemView.svelte` | Markup, open-state UI, callback props (`onLinkClick`, `onSourceClick`, `onDetailsClick`) | Map `item` / `type`, Fathom, wire callbacks |
| `domain/work/DetailsModal.svelte` | `DetailsModalView.svelte` | Dialog chrome, grouped tech list, close animation | Item → view props (no Fathom today; split is for Storybook props / size) |
| `domain/links/LinkItem.svelte` | `LinkItemView.svelte` | Icon resolve + link row UI | `Fathom.trackEvent` on click |

**Conventions**

- Stories target `*View` components (and already-pure components). Containers do not need their own stories.
- No Fathom imports in any `*View` file.
- Fixtures colocated: e.g. `domain/work/fixtures/sampleWorkItem.ts`, `domain/links/fixtures/sampleLinks.ts`.
- `LinksSection` is not split; it composes `LinkItem` with fixtures in stories.
- Public filenames stay (`GridItem.svelte`, etc.) so consumers only change path for the folder move, not the component name.

## Migration waves

Each wave should stay reviewable (`git mv`, update imports, `npm run check`).

1. **Scaffold** — Create folders; `git mv` the full component inventory into the taxonomy (including unstoried files and `domain/work|links|tech`); retitle existing stories; move `ThemeToggle` → `chrome/` and update `+layout.svelte`; fix all route/util imports. No shell extraction yet.
2. **Fill primitives / layout / media** — Add Default (+ variants where useful) for: `PageContainer`, `StickySectionHeader`, `Logo`, `LogoIcon`, `LazyLoadImage`, `MiniImageGallery`, `TechBackdrop`, `ProfileDiamond`, `TopicHero`.
3. **Icons** — `Icons/Gallery` composition story plus one Default per icon file.
4. **Shells + domain** — Extract views in place under `domain/`; add fixtures; stories for views + `LinksSection` (titles use the public name, e.g. `Domain/Work/GridItem`, with `component: GridItemView`).
5. **QA hook (light)** — Document stable story ID naming and optional future Playwright/Chromatic against `build-storybook`. No CI visual regression required in this project.

## Story standards

- Colocated `*.stories.svelte` via `@storybook/addon-svelte-csf` `defineMeta`.
- `title` mirrors folder taxonomy.
- `tags: ['autodocs']` and a short component description (existing style).
- Minimum one `Default` story; add variants only for real states (empty, long text, open modal, external link).
- Args/controls for primitives; composition snippets for layout/domain.
- Fixtures only — no live Notion in stories.
- Prefer `git mv` to preserve history; update all route / util imports in the same change as each move.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Import churn across routes | Wave-1 moves only; `git mv`; `npm run check` per wave |
| `ThemeToggle` `$lib` path | Single consumer in `+layout.svelte` — update in place |
| Shell split regressions | Containers keep the existing public prop API; spot-check landing, work detail, bookmarks |
| ThemeToggle vs Storybook theme toolbar | Document in story (already); do not “fix” in this project |
| DetailsModal size | File split only; no UI redesign while moving |

## Testing

- `npm run check` after each wave.
- Manual Storybook pass: light/dark on Actions, Chrome, Domain.
- `npm run test:unit` if fixture helpers warrant it.
- Dev spot-check of routes that use moved / split components.
- Optional later: Playwright against `storybook build` — out of scope unless requested.

## Success criteria

1. Sidebar shows hybrid groups matching on-disk folders.
2. Every component under `src/components` (and ThemeToggle) has ≥1 story.
3. No `*View` imports Fathom; containers still track as today.
4. Site routes render correctly with updated imports.

## Inventory (target stories)

**Already storied (retitle + move):** AnchorButton, SpecialButton, ButtonContainer, Link, Select, StatusIndicator, SimpleSpinner, SiteHeader, Section, TechHeader, TechIcon, ThemeToggle.

**New stories:** PageContainer, StickySectionHeader, Logo, LogoIcon, LazyLoadImage, MiniImageGallery, TechBackdrop, ProfileDiamond, TopicHero, AwsIcon, DropwizardIcon, EmotionIcon, OpenCodeIcon, PlaywrightIcon, Icons/Gallery, GridItemView, DetailsModalView, LinkItemView, LinksSection.
