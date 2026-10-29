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
- Evans can update any of it in EmDash without touching code. Publishing is live.

## Positioning

The user confirmed all four pillars without ranking them. They are recorded as one position, with the ordering below as **synthesis, not a user ranking**:

1. **The site is the artifact** _(leading — the mechanism)_. Performance-tuned LCP, accessibility, a real component system under Storybook, and EmDash as content truth so a publish updates the live site without a code deploy. This is the only pillar that is a mechanism rather than a claim, and it is what makes the other three demonstrable instead of asserted. A neighboring portfolio can claim product focus or scale; it cannot copy a site that is itself the proof.
2. **Product-focused engineer.** Frontend and full-stack depth paired with product judgment — shipped outcomes at CLEAR and Amazon Web Services, not a list of frameworks.
3. **Honest depth + breadth map.** The stack is mapped with proficiency levels and cross-linked to the work and projects that prove each entry.
4. **Shipped at scale.** Legacy modernization, accessible frontends at scale, cloud infrastructure.

## Operating Context

- **Authoring.** EmDash is content truth. Collections: `pages` (home About), `companies`, `roles`, `projects`, `tech`, `links`, `bookmarks`, `quotes`. Publishing an entry updates the live site — no rebuild.
- **Slugs.** Public `/work/{slug}/` and `/tech/{slug}/` use kebab-case `entry.slug` (`toUrlSlug`), never the display name. Valid: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- **Quotes.** Home footer only. Seed includes Edison; SSR serves that (or the first published) quote, and a Svelte island shuffles among published quotes on the client. `/work` and `/tech` do not load quotes.
- **Surfaces.** `/` (About, Links, Work, Projects, Tech, footer quote), `/work/` and `/work/[slug]/`, `/tech/` and `/tech/[slug]/`, `/bookmarks/` (deliberately unindexed). Canonical health is `/api/health/` 200. Admin is `/_emdash/admin/`.
- **Analytics.** Fathom via `PUBLIC_FATHOM_SITE_ID`, loaded in `src/layouts/Base.astro` when the site id is set. Analytics calls stay out of presentational `*View` shells so stories stay free of them.
- **Component workshop.** Storybook on `:6006` (`npm run storybook`), stories colocated as `*.stories.svelte`, needs no CMS (no EmDash, no Notion). Grouped `Actions/ Feedback/ Chrome/ Layout/ Media/ Icons/ Domain/<feature>`.
- **Theming.** Light/dark with a system default, persisted in `localStorage`, applied as a `dark` class on `<html>` by an inline no-flash script in `src/layouts/Base.astro`.
- **Local development requires `.env`:** `EMDASH_ENCRYPTION_KEY`. Optional: `PUBLIC_FATHOM_SITE_ID`. Notion credentials are only for a live `scripts/import-notion.ts` run.
- **AI crawler policy as shipped:** `static/robots.txt` disallows `ChatGPT-User` sitewide.

## Capabilities and Constraints

**Stack (answered by the codebase).** Astro `output: "server"` + EmDash + Svelte 5 + TypeScript + Tailwind v4. Local: `@astrojs/node` + SQLite + local media. `trailingSlash: 'always'`. React hydrates `/_emdash/admin` only. Node `>=24 <25` pinned in `.nvmrc`.

**Binding constraints:**

- **EmDash is content truth.** `src/data/*.ts` hold types, enums, and view models only. Work, project, tech, link, about, and quote copy must not be hardcoded or duplicated in templates. Publishing is live.
- **Server-rendered public pages.** No React islands on public routes. Hydrate only ProfileDiamond, ThemeToggle, DetailsModal/galleries, and FooterQuote.
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
- Deployment host is not recorded in the repo (origin is `github.com/estepanov/evansstepanov`); the public domain is not asserted here. Cloudflare Workers + D1 + R2 is the planned production adapter and is not wired in this checkout.
- No accessibility conformance level (e.g. WCAG 2.2 AA) was named.

## Brand Commitments

- **Name:** Evans Stepanov.
- **Logo:** `static/logo/` — `logo.svg`, `full-logo.svg`, `e.svg`, `s.svg`; rendered by `src/components/chrome/Logo.svelte` and `LogoIcon.svelte`. The landing hero animates the logo in with a blur-to-sharp entrance.
- **Typeface:** Albert Sans, weights 400/500/600, served from `fonts.bunny.net` and preloaded in `src/layouts/Base.astro`. Registered as `--font-sans` in the Tailwind theme.
- **Accent system:** emerald for links, hover, and "current" status; purple for emphasis inside About copy; slate neutrals throughout. Body carries a fixed diagonal gradient (white → gray-200 light, gray-800 → gray-950 dark).
- **Signature component:** `ProfileDiamond` — a generative SVG kite that deforms toward the pointer (scroll on mobile), used inline in the About opening paragraph.
- **Custom icon set:** hand-built icons for AWS, Azure, Codex, Cursor, Devin, Dropwizard, Emotion, OpenCode, and Playwright, alongside `simple-icons` brand glyphs via `getTechIcon`.
- **Voice as shipped:** first-person, plain, technically specific. Confident without superlatives. The personal paragraph permits humor and emoji; the home footer closes on a published quote (seed: Edison on 10,000 ways that won't work).

## Evidence on Hand

**Real and available:**

- Employment history at CLEAR and Amazon Web Services, referenced in shipped copy. Roles, dates, and descriptions live in EmDash `companies` / `roles` — not as content rows in the repo.
- Real projects with media, in EmDash `projects`.
- A real tech inventory with self-assessed proficiency levels, in EmDash `tech`.
- Real links and bookmarks in EmDash `links` / `bookmarks`. Home About is `pages/home` portable text.
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
2. **Real or absent.** EmDash is the source. Nothing invented to fill a layout, nothing duplicated into code.
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
