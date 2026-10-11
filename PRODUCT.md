# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — hiring managers and recruiters.** Arriving from a resume link, LinkedIn, or a referral, on desktop or phone, with minutes rather than hours. Their job: decide whether Evans operates at the level the role needs, and what he has actually shipped. Confirmed priority is hiring first.

**Secondary — engineers and peers.** Arriving via search, OSS, or a shared link. Their job: judge whether the technical record is credible enough to respect or reference. The site must hold up under their scrutiny without being optimized for them at the hiring visitor's expense.

## Product Purpose

A personal domain that answers the evaluation question faster and more convincingly than a resume or a LinkedIn profile can, using content Evans maintains himself.

Success means:

- A hiring visitor understands level, scope, and current focus from the first viewport, and leaves with a reason to reach out.
- A peer finds the depth intact — real proficiency levels, real projects, real company history — not trimmed for the pitch.
- Evans can update any of it in Notion without touching code.

## Positioning

The user confirmed all four pillars without ranking them. They are recorded as one position, with the ordering below as **synthesis, not a user ranking**:

1. **The site is the artifact** _(leading — the mechanism)_. Performance-tuned LCP, accessibility, a real component system under Storybook, and a Notion pipeline that publishes without code deploys. This is the only pillar that is a mechanism rather than a claim, and it is what makes the other three demonstrable instead of asserted. A neighboring portfolio can claim product focus or scale; it cannot copy a site that is itself the proof.
2. **Product-focused engineer.** Frontend and full-stack depth paired with product judgment — shipped outcomes at CLEAR and Amazon Web Services, not a list of frameworks.
3. **Honest depth + breadth map.** The stack is mapped with proficiency levels and cross-linked to the work and projects that prove each entry.
4. **Shipped at scale.** Legacy modernization, accessible frontends at scale, cloud infrastructure.

## Operating Context

- **Authoring.** Content lives in Notion databases — Links, Projects, Work, Tech, Bookmarks — and is read at build/dev time by server `load` functions. Publishing means rebuilding.
- **Asset pipeline.** `scripts/download-build-images.ts` runs before `dev` and `build`, pulling every file from the Projects DB `Media` property into `static/_dld/static/` under hashed filenames (`src/util/file-names.ts#hashFileName`).
- **Surfaces.** `/` (About, Links, Work, Projects, Tech sections), `/work` and `/work/[slug]`, `/tech` and `/tech/[slug]`, `/bookmarks` (deliberately unindexed).
- **Analytics.** Fathom via `PUBLIC_FATHOM_SITE_ID`, loaded in `src/routes/+layout.svelte`. Analytics calls stay in container components; presentational `*View` shells keep stories free of them.
- **Component workshop.** Storybook on `:6006` (`npm run storybook`), stories colocated as `*.stories.svelte`, needs no Notion credentials and skips the image prefetch. Grouped `Actions/ Feedback/ Chrome/ Layout/ Media/ Icons/ Domain/<feature>`.
- **Theming.** Light/dark with a system default, persisted in `localStorage`, applied as a `dark` class on `<html>` by an inline no-flash script in `src/app.html`.
- **Local development requires `.env`:** `NOTION_TOKEN`, `LANDING_LINKS_NOTION_DB_ID`, `PROJECTS_NOTION_DB_ID`, `WORK_NOTION_DB_ID`, `TECH_NOTION_DB_ID`, `BOOKMARKS_NOTION_DB_ID`, `PUBLIC_FATHOM_SITE_ID`.
- **AI crawler policy as shipped:** `static/robots.txt` disallows `ChatGPT-User` sitewide.

## Capabilities and Constraints

**Stack (answered by the codebase).** SvelteKit 2 + Svelte 5 + TypeScript + Tailwind v4, prerendered to a fully static site by `@sveltejs/adapter-static` into `build/`. `prerender = true`, `trailingSlash = 'always'`. Node `>=24 <25` pinned in `.nvmrc`.

**Binding constraints:**

- **Static, no runtime server.** No server-side runtime and no client-side Notion calls. Any new Notion-backed data must be fetched in a server `load` and be serializable.
- **Notion is content truth.** `src/data/*.ts` hold interfaces and enums only. Work, project, tech, and link content must not be hardcoded or duplicated in code. _(Note: `CLAUDE.md` still claims `src/data/` holds static content — that is stale against the current routes.)_
- **Real history only.** Employment and project claims stay true. Nothing is invented to fill a layout.
- **Existing brand assets are commitments,** not open questions (see Brand Commitments).
- **Accessibility is required** (see Accessibility & Inclusion).
- **`/bookmarks` stays private.** `noindex, nofollow, noarchive`, and out of the public pitch.

**Terminology:**

- `Work` — a single role. `Company` — roles grouped by company; **one card per company**, newest role first, so a promotion never adds a card (`companyHighlights` in `src/util/company.ts`).
- `Tech` — a stack entry with `proficiency` (`Beginner | Intermediate | Advanced | Expert`, weighted 0–3) and a `TechType` category (`Runtime, Language, Framework, Library, Database, Data, Cloud, DevOps, AI`).
- `Project` — carries `isActive`, `startDate`/`endDate`, `url`, `source`, `media`. Sorting is active-first, then newest.

**Open product decisions (recorded, not invented):**

- The primary action for a hiring visitor is undecided. The landing page currently has no contact path — it ends on an Edison quote. Email, calendar, or form: not established.
- Deployment host is not recorded in the repo (origin is `github.com/estepanov/evansstepanov`); the public domain is not asserted here.
- No accessibility conformance level (e.g. WCAG 2.2 AA) was named.

## Brand Commitments

- **Name:** Evans Stepanov.
- **Logo:** `static/logo/` — `logo.svg`, `full-logo.svg`, `e.svg`, `s.svg`; rendered by `src/components/chrome/Logo.svelte` and `LogoIcon.svelte`. The landing hero animates the logo in with a blur-to-sharp entrance.
- **Typeface:** Albert Sans, weights 400/500/600, served from `fonts.bunny.net` and preloaded in `src/app.html`. Registered as `--font-sans` in the Tailwind theme.
- **Accent system:** emerald for links, hover, and "current" status; purple for emphasis inside About copy; slate neutrals throughout. Body carries a fixed diagonal gradient (white → gray-200 light, gray-800 → gray-950 dark).
- **Signature component:** `ProfileDiamond` — a generative SVG kite that deforms toward the pointer (scroll on mobile), used inline in the About opening paragraph.
- **Custom icon set:** hand-built icons for AWS, Azure, Codex, Cursor, Devin, Dropwizard, Emotion, OpenCode, and Playwright, alongside `simple-icons` brand glyphs via `getTechIcon`.
- **Voice as shipped:** first-person, plain, technically specific. Confident without superlatives. The personal paragraph permits humor and emoji; the page closes on the Edison quote about 10,000 ways that won't work.

## Evidence on Hand

**Real and available:**

- Employment history at CLEAR and Amazon Web Services, referenced in shipped copy. Roles, dates, and descriptions live in the `WORK` Notion DB — not in the repo.
- Real projects with media, in the `PROJECTS` Notion DB; images prefetched to `static/_dld/static/`.
- A real tech inventory with self-assessed proficiency levels, in the `TECH` Notion DB.
- Real links and bookmarks in the `LANDING_LINKS` / `BOOKMARKS` Notion DBs.
- Engineering evidence visible in the repo itself: LCP-aware reveal choreography, compositor-only animations, reduced-motion fallbacks, focus-visible indicators, colocated unit tests, and Storybook coverage with `addon-a11y`.

**Absent — future work must not fabricate:**

- Testimonials, references, or endorsements.
- Client or employer names beyond the real history above.
- Traffic, adoption, revenue, or performance-benchmark numbers.
- Level, salary, or seniority claims from third parties.
- Press mentions, awards, pricing, or licensing terms.
- Committed visual-regression goldens: no visual-regression CI is wired yet, and `storybook-static/` is a local build artifact.

## Product Principles

1. **The site must be the proof.** No claim about craft, performance, or accessibility that the site itself does not demonstrate in the same moment.
2. **Real or absent.** Notion is the source. Nothing invented to fill a layout, nothing duplicated into code.
3. **Answer the hiring question first, keep the depth one link away.** The landing page resolves level and scope; `/work`, `/tech`, and `/projects` carry the detail peers want, undiluted.
4. **Structure must not inflate the record.** One card per company, one honest proficiency per technology, active projects first — never let layout imply more than happened.
5. **Accessibility and reduced-motion support are requirements,** not final-pass polish.

## Accessibility & Inclusion

Binding, as established by the user and demonstrated in the shipped code:

- `prefers-reduced-motion: reduce` honored on every animation — hero entrance, scroll reveals, card lift, and hover transitions.
- Visible focus indicators throughout: `focus-visible` rings on interactive cards, outlines offset outside padding-less tech links.
- Both themes maintained as first-class, with a no-flash inline theme script and `color-scheme` set on the root.
- Semantic structure: `header` / `main` / `footer` landmarks, `ol` for the work timeline, `ul` for grids, decorative elements marked `aria-hidden`.
- LCP text reveals with transform only (no opacity fade) so above-the-fold copy is painted and readable immediately.
- Hover-lift effects gated behind `@media (hover: hover) and (pointer: fine)`, with `focus-within` mirroring for keyboard users.

No certification target was set. If a formal standard (WCAG 2.2 AA) becomes a requirement, record it here.
