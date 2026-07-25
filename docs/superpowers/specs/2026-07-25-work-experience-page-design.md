# Work Experience Pages — Design Spec

**Date:** 2026-07-25  
**Branch:** `work-page`  
**Status:** Draft for implementation planning

## Summary

Add a Work Experience surface that mirrors the tech stack’s index + detail routing, with a **timeline-first index** and **company-scoped detail pages**. Extract shared infrastructure so work does not clone the tech page. Home Work cards navigate to company detail pages; the existing details modal remains available on those detail pages for role deep-dives.

## Goals

- Ship `/work` (timeline index) and `/work/[slug]` (company detail).
- One page per company; multiple Notion role rows at the same company merge onto that page.
- Reuse tech-page visual language (hero shell, sticky section headers, breadcrumbs, footer CTAs) without copy-pasting route markup.
- Keep the static Notion pipeline: all data loaded in server `load` functions at build/prerender time.
- Pass a thermo-nuclear maintainability bar: company-first model, shared mappers, earned extractions only.

## Non-goals (v1)

- Notion schema changes or new DB properties.
- Company logos beyond existing fields.
- Resume / PDF export.
- Generic “entity page” or shared tech+work IndexLayout framework.
- Growing `DetailsModal` for company-level narrative.
- A third `GridItem` / modal `type` for “company”.
- Unifying tech category grids and the work timeline into one layout abstraction.

## Product shape

### Routes

| Route | Purpose |
|-------|---------|
| `/work` | Timeline of companies, newest → oldest |
| `/work/[slug]` | Single company page (e.g. `/work/clear`) |

### Slug rules

- Slug is derived from **company name** via a deterministic URL-safe helper (`companySlug`), not raw display text.
- Multiple roles at the same company share one slug and one page.
- Unknown slug → SvelteKit `error(404)`.

### Home

- Work cards link to `/work/{companySlug}` (company is the navigation target).
- Details modal is **not** the primary home affordance for work; it remains available on the company detail page for individual roles.

### Company detail content (below hero)

1. **Roles** — chronological list of titles at that company; each can open existing `DetailsModal` (`type: 'work'`).
2. **Tech** — compact tag row linking to `/tech/{name}` (union of role tech tags).
3. **Related Projects** — `GridItem` grid when non-empty (projects sharing any company tech tag). Sticky section title.

Hero summary: use the current role’s summary if any role is current; otherwise the role with the latest `startDate`. Do not concatenate all role summaries in v1.

## Data model

### Existing (Notion atomic shape)

`Work` remains one Notion row ≈ one role:

- `companyName`, `title`, `description`, `url`, `techTags`, `startDate`, `endDate`, `isCurrent`
- After mapping: also `companySlug` (derived) so consumers can link without regrouping.

### New view model

`Company` (or `WorkCompany`) is a pure aggregation over `Work[]`:

- `slug`, display name, optional company `url`
- `roles: Work[]` (sorted)
- tenure (`start` → `end` / Present) derived from role dates
- `techTags: string[]` — union across roles
- `isCurrent` if any role is current

Helpers (pure, unit-tested):

- `companySlug(name: string): string`
- `groupWorkByCompany(work: Work[]): Company[]`

## Architecture & ownership

| Layer | Owns |
|-------|------|
| `src/data/` | `Work`, `Company` types |
| `src/util/` | Notion mappers, tech-id resolution, `companySlug`, `groupWorkByCompany`, shared `stuckDetect` action |
| `src/routes/work/*` | Query + filter + sort + page composition only |
| `src/components/` | UI chrome; **no** company merge logic |
| Home `+page` | Consume mapped work with `companySlug` for hrefs; no regrouping in the view |

### Minimum extraction set (priority order)

1. **Canonical Notion mappers** — `mapTech` / `mapWork` / `mapProject` + `buildTechIdToName` / `resolveTechTags`. Wire home and tech slug loads through them before/with work routes. No third (fourth) hand-rolled property walk.
2. **`Company` model + `groupWorkByCompany` + `companySlug`** — feature invariant in one place; prerender `entries` depend on this.
3. **Attach `companySlug` on each `Work` at map time** — home / `GridItem` link without view-layer regrouping.
4. **One sticky-section primitive** — prefer home’s IntersectionObserver sentinel; delete tech detail’s scroll/rAF duplicate; shared sticky header CSS once.
5. **Parameterized crumb header** — `rootLabel`, `rootHref`, optional leaf (replace hard-coded Tech-only header without a `WorkHeader` clone).
6. **Hero visual shell** — shared class/CSS + backdrop slot; tech proficiency meta and work tenure/roles stay in their routes. Reuse `TechBackdrop` with company tech tags (no `CompanyBackdrop` fork).
7. **`GridItem` link surface only** — company navigation to `/work/[slug]`; no new modal modes; do not grow `DetailsModal` (~751 lines) for company UI.

### Extractions to avoid

- Thin `WorkHeader` = `TechHeader` with two strings swapped (parameterize once instead).
- `EntityDetailPage` / plugin / render-prop mega layout.
- Third `type` on `GridItem` or `DetailsModal` for company.
- Generic Notion ORM / property DSL.
- Feature checks bolted into `TechBackdrop` parallax.

## UI layouts

### `/work` index

- `PageContainer`, crumb header (`Work`), short intro (eyebrow + headline + one supporting line).
- Vertical timeline (not a card grid): company name → detail route, date range, “Now” when current, optional latest role title.
- Footer: Back to Home (parity with `/tech`).

### `/work/[slug]` detail

- Crumbs: Work / {Company}.
- Hero: shared hero shell + `TechBackdrop` (unioned tags); company name as H1; tenure meta; optional external “Visit” link; brief summary from latest/primary role.
- Sections as listed under Product shape.
- Footer CTAs: Home + View all Work.

### Motion / a11y

- Reuse tech-style hero-in / header-in animations.
- Respect `prefers-reduced-motion`.
- Sticky headers use the shared stuckDetect primitive.

## Data flow

1. Notion `WORK` DB → `mapWork` (includes `companySlug`) → `groupWorkByCompany` → `Company[]`.
2. `/work` load: companies sorted by each company’s latest role `startDate` descending (same chronology bias as home work). `isCurrent` is display-only on the timeline, not a separate sort key unless needed later.
3. `/work/[slug]` load: resolve company by slug → 404 if missing; load related projects that share any of the company’s tech tags (parallel queries / in-memory filter consistent with tech slug pattern).
4. Home reuses mapped work with `companySlug` for hrefs.
5. Static adapter: `entries` for `[slug]` from grouped company slugs at build time.

## Error & empty states

- Unknown slug → `error(404)`.
- Empty work DB → empty timeline; no crash; no detail entries to prerender.
- Missing company URL or dates → omit link / show partial range (same gracefulness as today).

## Testing

- **Unit:** `companySlug`, `groupWorkByCompany` (multi-role merge, slug stability, sort).
- **Unit:** Notion mappers as pure functions against fixture pages (no live Notion in CI).
- **E2E smoke:** `/work` renders; navigate to a company detail; home work link lands on detail.

## Success criteria

- Index and company detail prerender cleanly from Notion work data.
- Home Work section navigates to company pages.
- Tech and work routes share mappers, sticky chrome, and crumb header — no duplicated Notion property walks.
- `DetailsModal`, home `+page.svelte`, and `GridItem` do not grow company-page narrative or a new entity type.
- Thermo-nuclear bar: company-first model + shared mappers + one sticky shell + crumb params + thin GridItem link change; no naïve clone of `tech/[slug]/+page.svelte`.

## Implementation note

Next step after spec approval: write an implementation plan via the writing-plans skill (extract mappers/company model first, then routes, then home link wiring, then tests).
