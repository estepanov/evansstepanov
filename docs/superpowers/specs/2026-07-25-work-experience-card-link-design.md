# Work Experience Card Link Design

Date: 2026-07-25

## Goal

Replace interactive work experience cards with a dedicated whole-card link to `/work/{companySlug}` everywhere work cards appear. The new card looks like the existing work card but has no interactive children, so the full surface can be the link (accessible and valid HTML).

## Background

- Company detail pages already exist at `/work/[slug]`.
- Today’s `GridItem` (work) mixes a company-name link to that page with a “View details” control that opens `DetailsModal`.
- Nested interactives and competing CTAs are weaker for keyboard and assistive tech than a single card link with no children controls.

## Decision

**Approach:** New `WorkExperienceCard` + shared presentational chrome (not a mode flag on `GridItem`, not a full CSS fork).

| Surface | Card |
| --- | --- |
| Landing Work section | `WorkExperienceCard` |
| Tech tag pages (work list) | `WorkExperienceCard` |
| Project cards (all surfaces) | Existing `GridItem` (unchanged interaction model) |
| Company page role list | Unchanged (inline list + role `DetailsModal`) |

## Architecture

- **Public container:** `src/components/domain/work/WorkExperienceCard.svelte` — accepts `item` and `tech`; wires Fathom on click.
- **Presentation:** `src/components/domain/work/WorkExperienceCardView.svelte` — single link filling the card; text-only content inside.
- **Shared chrome:** Move pointer-glow, active border/glare, and base card surface rules into a shared presentational module (e.g. `gridCardChrome.css` imported by both views, or a thin non-interactive shell component). Project `GridItemView` and `WorkExperienceCardView` both consume it so visuals stay matched without copying the large style block.
- **Call sites:** `src/routes/+page.svelte` and `src/routes/tech/[slug]/+page.svelte` use `WorkExperienceCard` for work items.
- **Cleanup:** Remove dead work-only interactive UI from `GridItem` / `GridItemView` (company link, details modal path for `type === 'work'`) once call sites migrate. Prefer one work card implementation.

## Components & markup

### Structure

- Parent remains a `<ul>` of cards; each card root stays `<li>`.
- Inside the list item: one `<a href="/work/{companySlug}">` that provides the card chrome and hit target.
- Inside the link (non-interactive only):
  - Role title (heading)
  - “at {companyName}” as plain text
  - Description
  - Date range
  - Existing visual affordances: `TechBackdrop`, current-role status chip when `isCurrent`

### Accessibility

- Exactly one focusable control per card (the link).
- Accessible name comes from visible title + company text; use `aria-label` only if the composed name would be unclear.
- Native link activation (Enter; Space where the browser supports it for links).
- No nested `<a>` / `<button>` / dialog triggers on this card.

### Edge cases

- Missing `companySlug`: render the same visual chrome **without** a link (not clickable, no analytics). Never emit `href="/work/undefined"`.
- Unknown slug after navigation: existing `/work/[slug]` 404 handling.
- `prefers-reduced-motion`: preserve shared chrome rules already used by grid cards.

## Analytics

- On card click (when linked): `click_work_card-{title}` via Fathom in the container.
- Replaces per-card `click_work_link-*` / `click_work_details-*` for these surfaces.

## Data

- No new Notion fields, env vars, or routes.
- Uses existing `Work` shape (`companySlug`, `title`, `companyName`, `description`, dates, `techTags`, `isCurrent`).

## Testing

- Update Playwright home work navigation test: work-section card link to `/work/...` still navigates; no longer assumes a nested company-name-only link.
- Assert work cards on home expose no “View details” / Details button.
- Storybook: `WorkExperienceCardView` stories (e.g. current + past).
- Unit tests: only if a small href/slug helper is extracted; otherwise rely on existing `companySlug` coverage.

## Out of scope

- Redesigning `/work` index or `/work/[slug]` content.
- Changing project card behavior or project modal.
- Changing role-detail modals on the company page.
- New visual language beyond matching the existing work card.

## Success criteria

1. Every work card on landing and tech pages is a single link to the company work page (when slug exists).
2. No interactive children inside that card.
3. Visual match with the prior work card chrome.
4. Project cards and company-page role modals unchanged.
5. Tests and Storybook cover the new card.
