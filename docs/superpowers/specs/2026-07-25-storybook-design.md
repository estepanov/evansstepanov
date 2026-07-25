# Storybook 10 for the component library

Date: 2026-07-25
Status: Approved

## Goal

Stand up Storybook 10 against the existing SvelteKit site and add stories for the
presentational components in `src/components/`, so components can be developed and
reviewed in isolation without running the full Notion-backed site.

## Motivation

Every component currently can only be seen by running `npm run dev`, which first
downloads images from Notion and therefore requires `NOTION_TOKEN`,
`LANDING_LINKS_NOTION_DB_ID`, and `PROJECTS_NOTION_DB_ID`. Components that have
nothing to do with Notion — `Select`, `StatusIndicator`, `AnchorButton` — are gated
behind credentials and a network round trip. Storybook removes that coupling.

## Scope

In scope: twelve components that render from props alone.

| Component | Path |
| --- | --- |
| `Select` | `src/components/Select.svelte` |
| `StatusIndicator` | `src/components/StatusIndicator.svelte` |
| `AnchorButton` | `src/components/AnchorButton.svelte` |
| `SpecialButton` | `src/components/SpecialButton.svelte` |
| `ButtonContainer` | `src/components/ButtonContainer.svelte` |
| `Link` | `src/components/Link.svelte` |
| `Section` | `src/components/Section.svelte` |
| `SimpleSpinner` | `src/components/SimpleSpinner.svelte` |
| `SiteHeader` | `src/components/SiteHeader.svelte` |
| `TechHeader` | `src/components/TechHeader.svelte` |
| `TechIcon` | `src/components/TechIcon.svelte` |
| `ThemeToggle` | `src/lib/components/ThemeToggle.svelte` |

Out of scope, deferred to a second pass: components requiring fixture data or
analytics stubs — `GridItem`, `DetailsModal`, `LinkItem`, `LinksSection`,
`TechBackdrop`, `MiniImageGallery`, `LazyLoadImage`, `ProfileDiamond`, `Logo`,
`LogoIcon`, and `src/components/icons/*`.

Also out of scope: `@storybook/addon-vitest`, Chromatic or any CI publishing step,
and any modification to the components themselves. "Move components into stories"
means adding story files beside the components, not relocating or rewriting the
`.svelte` sources.

## Dependencies

Added to `devDependencies`. Versions verified against the installed Vite 6,
`@sveltejs/vite-plugin-svelte` 5, and Svelte 5.

| Package | Version | Purpose |
| --- | --- | --- |
| `storybook` | `^10.5.4` | CLI and core |
| `@storybook/sveltekit` | `^10.5.4` | Framework adapter |
| `@storybook/addon-svelte-csf` | `^5.1.2` | Svelte story format |
| `@storybook/addon-a11y` | `^10.5.4` | Accessibility audit panel |
| `@storybook/addon-themes` | `^10.5.4` | Light/dark toolbar toggle |

`@storybook/addon-svelte-csf@5.1.2` declares a peer range including `^10.0.0-0`,
which admits Storybook 10.5.4. No `--legacy-peer-deps` needed.

Svelte CSF is required rather than optional: five of the twelve components in scope
(`AnchorButton`, `SpecialButton`, `ButtonContainer`, `Link`, `Section`) render
children through `<slot />`. Plain `.stories.ts` would need a throwaway wrapper
component per story to supply slot content.

## Configuration

Three files under `.storybook/`.

### `main.ts`

Framework `@storybook/sveltekit`. Stories glob
`../src/**/*.stories.@(js|ts|svelte)`. Registers the three addons.

### `preview.ts`

Two responsibilities, both load-bearing:

1. `import '../src/app.css'` — supplies Tailwind 4, the `@custom-variant dark`
   declaration, the `--font-sans` theme variable, the `.card` component layer, and
   the `body` gradient. Because `app.css` styles `body` directly, the preview iframe
   inherits the site's real background without extra work.
2. `withThemeByClassName({ themes: { light: '', dark: 'dark' }, defaultTheme: 'light' })`
   — its `parentSelector` defaults to `html`, matching the `:global(html.dark)`
   selectors the components rely on. A decorator that applied the class to `body` or
   to a story wrapper would leave every dark-mode style dead.

Storybook's `backgrounds` addon is disabled so it does not paint over the gradient.

### `preview-head.html`

The Albert Sans `<link rel="preconnect">`, `<link rel="preload">`, and stylesheet
tags copied from `src/app.html`. Without these the iframe resolves `--font-sans` to
a font it never loaded, and every story renders in a fallback face.

## Stories

One `*.stories.svelte` file colocated with each component, matching the repo's
existing convention of colocating `*.test.ts` with source (see `AGENTS.md`).

Format is Svelte CSF: `<script module>` with `defineMeta`, then `<Story>` elements.

Stories show real states rather than a single default render. Representative
variants:

- `Select` — Default, Selected, WithMeta, LongLabels, ManyOptions
- `StatusIndicator` — Emerald, Subtle, CustomLabel
- `AnchorButton` — Internal, ExternalTarget
- `SimpleSpinner` — size and color variations
- `TechIcon` — several real icons resolved through `src/util/tech-icons`
- `SiteHeader` — title only, and title with eyebrow

## Scripts

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

Deliberately not chained to `download-images:dev`. Storybook must start with no
`.env` file and no Notion credentials. This is a design requirement, not an
accident, and it is the reason fixture-dependent components are deferred.

## Hygiene

Add `storybook-static` and `*storybook.log` to `.gitignore` and `.prettierignore`.

## Risks

**Vite config reuse.** `@storybook/sveltekit` consumes the project's
`vite.config.ts`, which carries both the `tailwindcss()` and `sveltekit()` plugins.
The framework is built to handle the Kit plugin, but this is the most likely source
of friction. Mitigation: verify that Tailwind utilities and dark-mode styles
actually render in a single story before writing the remaining eleven.

**`ThemeToggle` positioning.** The component is `position: fixed` and imports
`$app/environment` via `src/lib/theme.svelte.ts`. It will pin to the viewport corner
in its story. Expected behavior, not a defect. `@storybook/sveltekit` mocks
`$app/*`, so the import resolves.

**Legacy component API.** The components use the Svelte 4 authoring API
(`export let`, `createEventDispatcher`, `<slot />`) while Svelte CSF is written in
Svelte 5 idiom (`$props`, snippets). This combination is supported — Svelte 5 runs
legacy components — but story files and component files will not look alike.

## Pre-existing issue, not addressed here

The repo has no `eslint.config.js`, so the `eslint .` half of `npm run lint` already
fails on `main` under ESLint 9, which requires flat config. This work does not fix
that and does not make it worse. Verification will use `npm run check` and Prettier,
not the full `lint` script.

## Verification

Results recorded after implementation.

- All 43 stories across the 12 components render in both light and dark themes:
  86 renders, no console errors, no Storybook error boxes, correct `html.dark`
  state in every case.
- Albert Sans resolves in the preview iframe, and the `body` gradient and Tailwind
  `oklch` theme variables both apply.
- `npm run build-storybook` completes.
- `npm run test:unit` passes.
- Storybook builds with `.env` moved away, confirming no credential dependency.
- axe reports zero violations across all 43 stories.

`npm run check` reports 10 errors and 6 warnings across 6 files. This is
**unchanged from the pre-existing baseline on `main`** — verified by stashing the
Storybook work and re-running. Every error is in `MiniImageGallery.svelte`,
`ProfileDiamond.svelte`, `LazyLoadImage.svelte`, `+layout.svelte`, and the two
`+page.server.ts` files. No story file or `.storybook/` file contributes an error.
Fixing the pre-existing set is out of scope here.

## Implementation note: Tailwind and the build output

Tailwind 4's automatic source detection scans the project directory, which means it
will pick up `storybook-static/` once a build has run and generate CSS referencing
its assets. Tailwind honours `.gitignore`, so the `/storybook-static` entry added
above is what keeps the build output out of the scan. It is load-bearing, not just
tidiness — without it, a `storybook build` followed by `storybook dev` produces
Vite `ENOENT` errors out of `vite:css-analysis` on `src/app.css`.
