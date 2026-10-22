---
name: Evans Stepanov
description: A personal domain that is itself the proof — instrumented glass over a fixed cool gradient.
colors:
  primary: '#009d75'
  primary-deep: '#006d52'
  primary-bright: '#5cd1a3'
  primary-soft: '#9ae2c2'
  secondary: '#7a61ce'
  secondary-deep: '#6b51bb'
  secondary-bright: '#9f90e6'
  emphasis: '#5c40a7'
  emphasis-bright: '#ab9bf6'
  ink: '#0f172a'
  ink-muted: '#5f6d80'
  ink-inverted: '#f1f5f9'
  hairline: '#e2e8f0'
  hairline-dark: '#1e293b'
  surface-light-start: '#ffffff'
  surface-light-end: '#e2e8f0'
  surface-dark-start: '#1e293b'
  surface-dark-end: '#020617'
typography:
  headline:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '0.18em'
  title:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: 'clamp(1.05rem, 0.95rem + 0.45vw, 1.375rem)'
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: '0.6875rem'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '0.18em'
rounded:
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.75rem'
  xl: '1rem'
  panel: '18px'
  pill: '999px'
spacing:
  sm: '0.875rem'
  md: '1.5rem'
  lg: '2rem'
  xl: '3rem'
  section: '4rem'
components:
  card:
    backgroundColor: 'rgba(255,255,255,0.40)'
    rounded: '{rounded.lg}'
    padding: '1.5rem'
  card-interactive-hover:
    backgroundColor: 'rgba(255,255,255,0.70)'
  button-outline:
    textColor: '#475569'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
  button-outline-hover:
    textColor: '{colors.primary-deep}'
    backgroundColor: 'rgba(236,253,245,0.50)'
  chip:
    textColor: '#334155'
    backgroundColor: 'rgba(15,23,42,0.04)'
    rounded: '{rounded.pill}'
    padding: '0.25rem 0.6rem'
  chip-hover:
    textColor: '#0f172a'
    backgroundColor: 'rgba(15,23,42,0.07)'
  status-label:
    textColor: '{colors.primary-deep}'
    typography: '{typography.label}'
  select-trigger:
    textColor: '#475569'
    rounded: '{rounded.pill}'
    padding: '4px 8px 4px 12px'
    typography: '{typography.label}'
  theme-toggle:
    backgroundColor: 'rgba(255,255,255,0.65)'
    textColor: '#1f2937'
    rounded: '{rounded.pill}'
    size: '2.75rem'
---

# Design System: Evans Stepanov

## Overview

**Creative North Star: "Instrumented Glass"**

The site is a cool, frosted observatory laid over a fixed diagonal gradient. At rest it is calm and near-flat: translucent panels float on hairline borders, wide-tracked uppercase micro-labels read like instrument telemetry, and a slate neutral field keeps everything quiet. Interaction is where it comes alive — a pointer drags an iris glow across a card, a jade bloom wells up from its corner, a specular glare travels the top edge of live items as you scroll, and the theme control morphs from sun to moon with orbiting stars. Depth is never painted on at rest; it is summoned by touch and focus. This is the "instrumented glass" idea: a precise, technical surface with real signal lights underneath.

Personality is cool, precise, and quietly confident, with a deliberate playful streak reserved for the personal moments — a generative diamond that deforms toward the cursor, an emoji "planet" on a 16-second elliptical orbit, twinkling tech icons drifting around the portrait. The two accents are strictly semantic: **Tuned Jade** is the signal — it means current, live, clickable, online — and **Iris** is emphasis and subsurface depth, used for highlighted words and the glows that sit beneath glass. Neither accent is ever decorative filler.

The one confirmed visual rejection, bound by the brand's committed fixed gradient: **the field is always cool.** No warm, cream, or beige palettes, no sepia tones — the background is a fixed white→slate-200 (light) / slate-800→slate-950 (dark) diagonal wash, and every surface is a translucent veil over it rather than an opaque sheet.

**Key Characteristics:**

- Frosted, translucent panels (`white/40` light · `slate-900/30` dark) over a **fixed** diagonal gradient field — cards are veils, not opaque sheets.
- **Flat by default; glass and lift belong to overlays** (modal, select menu, theme toggle, stuck section headers) and to hover/focus states.
- Two semantic accents only: **jade = live/interactive signal**, **iris = emphasis + subsurface glow**. Slate is the neutral field; mist carries muted meta text.
- Instrument-panel typography: uppercase micro-labels with wide tracking (≥0.18em) for eyebrows, section titles, tech rows, status, and controls.
- **Pointer-reveal depth:** iris pointer glow, jade corner bloom, traveling scroll glare, and animated underlines all stay hidden until hover or focus.
- A single typeface, **Albert Sans** (400/500/600), carries the whole system; the logo is a custom SVG, not text.
- Motion is compositor-only (transform + opacity), fully gated behind `prefers-reduced-motion`, with blur reserved for the single hero logo entrance.

## Colors

A cool slate neutral field carries two semantic accents — jade for live signal, iris for emphasis and subsurface glow — plus a fixed diagonal gradient behind everything. Both families are bespoke OKLCH mixes, not stock scale values.

### Primary

- **Tuned Jade** (`#009d75`, jade-500): the light-mode signal color at full strength — status dots and the "Now"/"In progress" orbit sweep, active-card border tint, traveling glare, spinner, and the light logo shine stop. At 3.45:1 on white it clears the 3:1 UI floor without any alpha help. Wherever jade appears it means _live, current, or interactive_ — never static decoration.
- **Tuned Jade — Mid** (`#008664`, jade-600): the light-mode in-between step for decorations and border tints (underlines, hover border mixes) where a slightly deeper signal reads better at small sizes.
- **Tuned Jade — Deep** (`#006d52`, jade-700): light-mode signal text, links, hover, and the solid focus ring (6.35:1 on white).
- **Tuned Jade — Bright** (`#5cd1a3`, jade-400): the dark-mode accent for every signal role — hover text, status, active edges, rings (at `/60`), and the dark logo shine stop.
- **Tuned Jade — Soft** (`#9ae2c2`, jade-300): dark-mode hover text at lower emphasis.
- Supporting steps: `jade-50` (`#e4f9f0`) hover wash, `jade-200` (`#baebd4`) media placeholder tint, `jade-800` (`#005740`) light hover-deeper text, `jade-950` (`#053b2c`) dark wash.

### Secondary

One iris family replaces the old violet/purple split — controls and copy emphasis now share a single hue ladder.

- **Iris** (`#7a61ce`, iris-500): the Select control's light-mode accent (hover/open border, wash, glow) and the pointer-follow glow under glass.
- **Iris — Deep** (`#6b51bb`, iris-600): light-mode control text and the accent icon lattice over card backdrops.
- **Iris — Control Bright** (`#9f90e6`, iris-400): dark-mode control accent, lattice, and the iris stop in the logo shine gradient.
- **Iris — Emphasis** (`#5c40a7`, iris-700): About-copy emphasis for "product focused" / "web applications" / stack names in light mode, the light-mode sparkle-icon color around ProfileDiamond, and the Advanced proficiency tone.
- **Iris — Emphasis Bright** (`#ab9bf6`, iris-300): dark-mode About-copy emphasis and dark sparkle-icon color.
- Supporting steps: `iris-200` (`#d4cefa`) and `iris-800` (`#4b3090`) bookend the proficiency badge ladder (Expert light/dark).

### Neutral

- **Slate Ink** (`#0f172a`, slate-900): default light-mode body text.
- **Slate Ink — Inverted** (`#f1f5f9`, slate-100): default dark-mode body text.
- **Muted** (`#5f6d80`, mist-500): meta text, dates, secondary labels, tech-row labels, crumbs; `#93a1b5` (mist-400) in dark. Both clear 4.5:1 on their worst-case surfaces (4.65:1 on a light card at the gradient end; 6.76:1 on a dark card).
- **Hairline** (`#e2e8f0`, slate-200): card borders and the tech-row rule in light mode (often at `/70` alpha); `#1e293b` (slate-800) in dark.
- **Surface field** — the fixed body gradient: light runs `#ffffff` → `#e2e8f0` (slate-200); dark runs `#1e293b` (slate-800) → `#020617` (slate-950), `bg-fixed bg-cover`, painted once and never scrolled.

One cool neutral family by design: **slate** carries ink, hairlines, borders, structural labels, and the fixed gradient field; **mist** is the single muted-text step in both themes. Don't cross mist into borders or slate-500 into meta text.

### Named Rules

**The Signal-Is-Jade Rule.** Jade is never decorative. If a pixel is jade, it is live, current, clickable, or a focus indicator — status dots, active edges, links, hover, rings. Static ornament stays slate or iris.

**The Two-Accent Ceiling Rule.** Exactly two accents exist: jade (signal) and iris (emphasis/depth). No third hue enters the system. Iris lives _under_ glass as glow and _inside_ copy as emphasis; it never becomes a call-to-action color — that role is jade's.

**The Contrast-Floor Rule.** Light-mode signal UI never drops below full-strength jade-500 (3.45:1 on white); signal text, links, and focus rings use solid jade-700 (6.35:1); muted meta text uses mist-500/mist-400 (≥4.65:1 worst case). Alpha-diluted signal steps are reserved for halos, washes, and dark-mode rings — never for a role that carries a 3:1 or 4.5:1 obligation in light mode.

## Typography

**Display Font:** the logo is a custom SVG mark, not text — there is no display typeface. The hero "displays" the logo.
**Body Font:** Albert Sans (with `sans-serif` fallback), weights 400/500/600, served from `fonts.bunny.net` and preloaded.
**Label/Mono Font:** none — labels reuse Albert Sans at small sizes with heavy tracking instead of a mono face.

**Character:** a single humanist grotesque does everything, and the hierarchy is built from _tracking, case, and weight_ rather than from multiple families. Big structural headings go uppercase and wide-tracked (instrument-panel voice); reading copy stays sentence-case and relaxed; the personal paragraph is the only place weight and color carry playful emphasis.

### Hierarchy

- **Headline** (600, `1.5rem`/24px, line-height 1.2, tracking `0.18em`, uppercase): section titles ("About", "Links", "Work", "Projects", "Tech") and the modal title. In a `StickySectionHeader` it compresses to a visual `0.875rem` when stuck via a compositor-only scale that keeps the `0.18em` track proportional — the header box never reflows beneath the pin.
- **Title** (700, `clamp(1.05rem, 0.95rem + 0.45vw, 1.375rem)`, line-height 1.2): card headings for work and projects; scales fluidly with viewport.
- **Body** (400, `1rem`/16px, line-height 1.625 `leading-relaxed` for About prose, `1.375` `leading-snug` for card descriptions): all reading copy. About prose sits in a comfortable measure; card copy tightens to fit the panel.
- **Label** (500, `0.6875rem`/11px, tracking `0.18em`, uppercase, line-height 1): tech-row labels, breadcrumbs, status labels, the Select trigger, and eyebrows. Eyebrows can drop to `10px` at `0.2em`; modal section labels use `0.75rem` at `0.08em`.

### Named Rules

**The Wide-Track Label Rule.** Any uppercase micro-label (eyebrow, section title, tech row, status, crumb, control trigger) carries at least `0.18em` tracking. The wide track _is_ the instrument-panel voice; don't set these labels tight or in sentence case.

**The One-Face Rule.** Albert Sans is the only typeface. Hierarchy comes from weight (400→700), size, tracking, and case — never from introducing a second family or a monospace. Emphasis in prose is `font-semibold` + accent color, not a font swap.

## Layout

A single centered column with a fixed gradient behind it. `PageContainer` caps content at `max-w-5xl` (64rem / 1024px), centered (`mx-auto`), with a `1.25rem` (`p-5`) gutter and a vertical flex flow.

The landing page stacks full-width sections on a `4rem` rhythm (`space-y-16`, `pb-16`), offset `3rem` (`mt-12`) from the top. Within a section, a header row sits above a content block on `1.5rem` spacing (`space-y-6`, `mt-6`).

Grids are **one column on mobile, two from `md` (768px)**, with gap widening as the viewport grows: `gap-6` (1.5rem) → `md:gap-8` (2rem) → `lg:gap-12` (3rem). Work and Projects share this grid; the work timeline is an ordered list, grids are unordered lists.

The **Tech rows** are a distinct flat layout (no card surface): a column of rows spaced `2rem` apart, each row an uppercase label + a hairline rule that flexes to fill the remaining width (so every rule ends flush at the right margin regardless of label length), then a wrapping flex of icon+name items (`column-gap 1.5rem`, `row-gap 0.625rem`).

Section headers can be **sticky** (`top: -1px`, `z-20`); when stuck they gain a frosted backdrop (`blur(12px)`, `white/0.75` light · `slate-950/0.75` dark) with a hairline bottom border, and the title compresses. Density is generous throughout — this is a spacious, scannable system, not a dense dashboard.

### Named Rules

**The Fixed Field Rule.** The body gradient is `bg-fixed` — it does not scroll. Content moves over a stationary cool wash; this is what makes the translucent cards read as glass floating on one continuous field. Never make the gradient scroll or replace it with a per-section background.

**The Flush Rule Rule.** A tech-row hairline must always terminate flush at the right margin. It's a flex-1 spacer, not a fixed-width line — don't give it a hardcoded length.

## Elevation & Depth

The system is **flat by default and lifts on interaction**; true frosted glass (backdrop-blur) is reserved for things that float _above_ content. Cards sit on hairline borders with translucent fills and no resting shadow. On hover/focus — and only where the device truly hovers (`@media (hover: hover) and (pointer: fine)`) — an interactive card rises `translateY(-2px)` and grows a soft two-layer shadow, with `focus-within` mirroring the lift for keyboard users. Overlays (details modal, select menu, theme toggle, stuck header) use real backdrop-blur because they genuinely sit over other content. Depth is otherwise conveyed tonally: translucent veils over the fixed gradient, subsurface iris/jade glows _beneath_ the glass, and hairline borders.

### Shadow Vocabulary

- **Card lift — light** (`0 1px 0 rgba(15,23,42,0.02), 0 10px 30px -18px rgba(15,23,42,0.18)`): hover/focus on interactive cards. A tight top highlight plus a wide, soft, low-opacity drop.
- **Card lift — dark** (`0 1px 0 rgba(255,255,255,0.02), 0 10px 30px -18px rgba(0,0,0,0.6)`): the same shape with a white top highlight and a deeper black drop.
- **Glass panel** (`inset 0 1px 0 rgba(255,255,255,0.7), 0 20px 50px -20px rgba(15,23,42,0.25)`): the details modal — an inset top edge for the "glass thickness" read plus a large diffuse drop. Pair with `backdrop-filter: blur(24px) saturate(160%)`.
- **Overlay menu** (`0 1px 0 rgba(15,23,42,0.02), 0 12px 28px -12px rgba(15,23,42,0.22), 0 4px 10px -6px rgba(15,23,42,0.12)`): the Select dropdown, with `backdrop-filter: blur(10px)`.
- **Floating control** (`0 1px 2px rgba(0,0,0,0.06), 0 8px 24px -12px rgba(0,0,0,0.18)` at rest; darker + jade-tinted halo on hover in dark mode): the theme toggle.
- **Hero lift** (`0 1px 0 rgba(15,23,42,0.02), 0 24px 48px -28px rgba(15,23,42,0.25)`): the TopicHero panel on hover — a larger, softer version of the card lift.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat and shadowless at rest. A shadow appears _only_ as a response to state — hover, focus, or an overlay floating above content. If a resting card has a drop shadow, it's wrong.

**The Glass-Is-Overlay Rule.** `backdrop-filter: blur()` is reserved for elements that genuinely sit above other content: the modal, the select menu, the theme toggle, and stuck section headers. Inline content cards stay translucent-but-unblurred veils; don't frost them.

**The Hover-Device Gate Rule.** Lift and transform are wrapped in `@media (hover: hover) and (pointer: fine)` with `focus-within` as the keyboard mirror. Touch devices never get a sticky hover-lift. Reduced-motion drops the transform entirely and keeps only color/border transitions.

## Shapes

Rounded but never pillowy, with a small deliberate radius ladder. The form language pairs **translucent fills** with **hairline borders** (1px, slate at reduced alpha), and rounds corners consistently by role:

- **Cards** — gently rounded (`0.75rem` / 12px, `rounded-xl`), translucent veil fill, 1px hairline border, `isolation: isolate` so the internal glows layer correctly.
- **Hero panels** — a step larger (`1rem` / 16px, `rounded-2xl`).
- **Modal glass panel** — the largest structural radius (`18px`), fully frosted.
- **Controls** (outline buttons, logo links) — `0.5rem` (8px); secondary/tag buttons `0.375rem` (6px).
- **Pills** (`999px`) — chips, the Select trigger, the theme toggle (a full circle), and status dots. Pills are the "instrument" shape: small, rounded, self-contained.
- **Media** — image tiles `8px`, hero frames `10px`.
- **Micro** — icon fallbacks `0.25rem` (4px); focus rings round to `0.25rem`.

Borders are structural, not decorative: hairlines define panels against the gradient, and accent-tinted borders (`color-mix` jade at ~18% for active/live edges) signal state. Recurring geometry includes the generative **kite/diamond** silhouette (ProfileDiamond), the rotated `-14deg` icon **lattice** (TechBackdrop), and the **radial glows** (iris pointer-follow, jade corner bloom) clipped to card radius.

### Named Rules

**The Veil Rule.** A card fill is translucent (`white/40` light · `slate-900/30` dark), never opaque, so the fixed gradient shows through. Opaque fills belong only to frosted overlays, which blur what's behind them. If you can't see the field through an inline card, it's too solid.

**The Radius-by-Role Rule.** Radius encodes role: 12px cards, 16px heroes, 18px modal, 6–8px controls, 999px pills/dots. Don't mix them — a pill-shaped card or a 12px button breaks the ladder's meaning.

## Components

Instrument-grade and tactile: every control is quiet and hairline-bordered at rest, then rewards the pointer with a glow, a lift, a spring, or an animated underline. Depth is a _response_, never a default.

### Cards / Containers

- **Character:** the canonical surface — a translucent veil on a hairline border that wakes under the pointer.
- **Corner Style:** `0.75rem` (12px).
- **Background:** `white/40` (light) · `slate-900/30` (dark); border `slate-200/70` · `slate-800/70`.
- **Internal Padding:** `1.5rem` (`p-6`), widening to `1.75rem` (`sm:p-7`).
- **Shadow Strategy:** flat at rest; on hover/focus lifts `translateY(-2px)` with the card-lift shadow (see Elevation). `focus-visible` shows a 2px jade ring (solid `jade-700` light · `jade-400/60` dark) offset 2px.
- **Pointer-reveal layers:** an iris radial glow (`::after`) tracks the cursor via `--grid-glow-x/y`; a jade radial bloom (`::before`) wells from the bottom-left corner with a light `backdrop-blur`, both revealed on hover. Live/active cards add `active-border` (jade tint) and a top-edge **traveling glare** driven by scroll (`animation-timeline: view()`), gated by `html.is-scrolling`.
- **Content texture:** a `TechBackdrop` lattice of the item's tech icons sits behind content at ~7–10% opacity, rotated `-14deg`, masked toward one corner, brightening and scaling `1.025` on hover with scroll parallax.

### Buttons

- **Outline / Anchor button:** slate text (`slate-600` · `slate-300`) on a hairline border, `0.5rem` radius, `0.5rem 1rem` padding, medium weight, centered with a `0.5rem` icon gap. **Hover** shifts to Tuned Jade text (`jade-700`/`jade-300`), a `jade-50/50` wash, and a `jade-700/40` border. 300ms `ease-in-out`.
- **Special / tag button (`.tag-highlighter`):** a slate chip (`slate-100/50`) at `0.375rem` radius. **Hover** scales `1.03`, turns text jade, adds `shadow-lg`, and runs a conic-gradient border spin (3s linear loop) in jade — the most overtly "tactile" control.
- **Details button (on cards):** an uppercase micro-label (`10px`, `0.18em`, semibold) that is hidden until card hover/focus on desktop; on hover it grows a white pill backdrop behind the text and draws a jade underline that scales in from the left.
- **Close button (modal):** a 32px circular hairline button; hover scales `1.06`, rotates its `×` glyph 90°, and tints the border; active scales `0.94` (spring easing).
- **Focus:** all buttons use `focus-visible` rings (jade for card actions, a neutral `0 0 0 3px` slate/white glow inside the modal).

### Chips

- **Style:** pill (`999px`), `slate-700` text on `rgba(15,23,42,0.04)` with a `rgba(15,23,42,0.08)` hairline; `0.25rem 0.6rem` padding, `0.75rem`/500 label.
- **State:** on hover the fill and border deepen, text goes near-black, and a `→` arrow slides in while the label shifts left into place (280ms standard ease). Dark mode inverts to white-alpha fills. Chips link to `/tech/[name]`.

### Inputs / Fields

- **Select (custom listbox):** the trigger is a pill with a hairline slate border, an uppercase `10px` `0.16em` label, tabular numerals, and a chevron. **Hover/open** tints to Iris (border, an `iris-500/6–7%` wash, iris text) and rotates the chevron 180° (spring ease). **Focus** draws a `0 0 0 2px` iris glow. The **menu** is a frosted overlay: `white/0.96` (light) · `slate-900/0.92` (dark), `12px` radius, `backdrop-blur(10px)`, overlay-menu shadow, animating in with a 180ms scale/slide from the top-right. Options highlight in iris; the selected option shows an iris check.

### Navigation

- **Site header:** a home logo button (10×10, slate→jade on hover) beside an optional eyebrow (`10px`, `0.2em`, uppercase, muted) and a truncated `1.125rem` semibold title.
- **Tech breadcrumb:** an 11×11 logo link (rounded-lg, jade focus ring) beside uppercase `11px` `0.18em` crumbs — root link hovers to full-ink, a `/` separator in hairline slate, and a truncated leaf. Crumbs stagger in on load.
- **Sticky section header:** see Layout — a sticky row that frosts and compresses its title when stuck.
- **Link cards (LinksSection):** a 3-column grid row (`[2rem_1fr_auto]`) — a slate icon tile (`bg-slate-50` · `slate-950/40`) that turns jade on hover, a semibold title, and an `ArrowUpRight` reserved for links that open a new tab (mailto keeps only its Mail icon). An iris pointer glow washes the row on hover and the arrow nudges up-right.

### Signature Components

- **ProfileDiamond:** a generative SVG kite whose vertices deform toward the pointer (or scroll on coarse pointers) with a gentle sin/cos "breathing." A grayscale portrait is clipped inside and parallaxes against the morph. An emoji "planet" rides a 16s tilted elliptical orbit (front arc above the diamond, back arc behind, z-swapped at the crossover), and five tech icons (React, TypeScript, Node, pointer, cart) twinkle and drift around it in Iris with a soft drop-shadow. Fully still under reduced-motion.
- **ThemeToggle:** a fixed bottom-right frosted glass circle (2.75rem) that morphs sun↔moon via an SVG mask, swapping rays for stars, with an ambient halo, a click ripple, a system-mode monitor badge, and (dark + visible only) drifting stars / breathing rays. Cycles light→dark→system, persisted to `localStorage`, applied as a `.dark` class on `<html>` by a no-flash inline script. Spring easing on press; everything disabled under reduced-motion.
- **Logo:** a custom SVG monogram (`currentColor`) with an animated jade→white→iris specular "shine" gradient that sweeps across on load (3.6s SMIL, hidden under reduced-motion). The shine stops are theme-aware via CSS on the gradient stops (`jade-500`/`iris-500` light · `jade-400`/`iris-400` dark). The hero logo also plays a blur-to-sharp entrance — the only place `filter: blur()` is animated, kept off the many-element reveals for compositor cost.

### Named Rules

**The Pointer-Reveal Rule.** Glow, lift, glare, and animated underlines are hidden at rest and appear only on hover or focus. A control at rest is a quiet hairline instrument; the delight is earned by interaction (and mirrored for keyboard via `focus-within`/`focus-visible`).

**The Live-Edge Rule.** Only _live/current/active_ items carry the jade `active-border` tint and the traveling top glare. Don't apply the glare or the jade edge to inactive cards — scarcity is what makes "live" legible.

## Do's and Don'ts

### Do:

- **Do** keep the body gradient `bg-fixed` and lay translucent cards over it — the field is one continuous cool wash.
- **Do** use jade _only_ for live/interactive signal (status, links, hover, active edges, focus rings) and iris _only_ for emphasis and subsurface glow.
- **Do** set every uppercase micro-label with ≥`0.18em` tracking — eyebrows, section titles, tech rows, status, crumbs, control triggers.
- **Do** gate lift/transform behind `@media (hover: hover) and (pointer: fine)` with a `focus-within` keyboard mirror, and drop the transform under `prefers-reduced-motion`.
- **Do** keep reveals compositor-only (`transform` + `opacity`); reserve `filter: blur()` for the single hero-logo entrance.
- **Do** give interactive cards a visible `focus-visible` jade ring and a real `aria-label`; the whole card is the link where possible.
- **Do** respect the radius ladder (12px cards · 16px heroes · 18px modal · 6–8px controls · 999px pills) and the hairline-border + translucent-fill pairing.
- **Do** maintain both themes as first-class: every accent, hairline, glow, and shadow has a defined light _and_ dark value.

### Don't:

- **Don't** introduce a third accent hue, or use jade/iris as flat decoration — both are semantic.
- **Don't** dilute the light-mode signal with alpha on any role carrying a 3:1 or 4.5:1 obligation — the floor is full-strength `jade-500` for UI and solid `jade-700` for text and rings (the Contrast-Floor Rule).
- **Don't** add a resting drop shadow to an inline card; depth is a response to state, and frosted `backdrop-blur` is for overlays only.
- **Don't** make card fills opaque — the fixed gradient must show through (the Veil Rule).
- **Don't** warm up the palette: no cream, beige, or sepia. The field stays cool slate/gray.
- **Don't** introduce a second typeface or a monospace; hierarchy comes from weight, size, tracking, and case in Albert Sans.
- **Don't** apply the jade `active-border` or the traveling glare to non-live items.
- **Don't** animate `filter: blur()` across many grid/list elements at once — it forces a per-frame repaint and defeats the LCP-aware reveal choreography.
- **Don't** hardcode a tech-row hairline's width; it flexes to stay flush at the right margin.
