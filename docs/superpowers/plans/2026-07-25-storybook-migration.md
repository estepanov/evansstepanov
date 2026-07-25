# Storybook Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mirror a hybrid Storybook taxonomy on disk, give every component at least one story, and extract presentational shells so domain stories never import Fathom.

**Architecture:** Components move under `src/components/{actions,feedback,chrome,layout,media,icons,domain/*}/`. Story `title` paths match folders. `GridItem`, `DetailsModal`, and `LinkItem` split into `*View` (UI) + thin container (analytics / public API). Fixtures feed Storybook; routes keep importing the public container filenames.

**Tech Stack:** SvelteKit 2, Svelte 5, Storybook 10 (`@storybook/sveltekit`, `@storybook/addon-svelte-csf`), Vitest for any small fixture helpers, TypeScript.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-25-storybook-migration-design.md`
- Prefer `git mv` for every file move
- Stories: colocated `*.stories.svelte`, `defineMeta`, `tags: ['autodocs']`, short docs description
- No Fathom imports in any `*View.svelte`
- No live Notion in stories — fixtures only
- Do not redesign visuals while moving or splitting
- After each task: `npm run check` must pass
- ThemeToggle: update `src/routes/+layout.svelte` import in place (no `$lib` re-export shim)

---

## File structure (target)

```
src/components/
  actions/       AnchorButton, SpecialButton, ButtonContainer, Link, Select (+ stories)
  feedback/      StatusIndicator, SimpleSpinner (+ stories)
  chrome/        SiteHeader, Logo, LogoIcon, ThemeToggle (+ stories)
  layout/        PageContainer, Section, StickySectionHeader (+ stories)
  media/         LazyLoadImage, MiniImageGallery, TechBackdrop, ProfileDiamond (+ stories)
  icons/         AwsIcon, DropwizardIcon, EmotionIcon, OpenCodeIcon, PlaywrightIcon (+ stories, Gallery)
  domain/
    tech/        TechHeader, TechIcon, TopicHero (+ stories)
    work/        GridItem, GridItemView, DetailsModal, DetailsModalView, fixtures/, stories
    links/       LinkItem, LinkItemView, LinksSection, fixtures/, stories
```

**Relative import depth after moves**

| From | To `src/util/*` |
| --- | --- |
| `src/components/<group>/*` | `../../util/...` |
| `src/components/domain/<feature>/*` | `../../../util/...` |
| `src/components/icons/*` | unchanged (`../../util/...` if needed; icons today are self-contained) |

**Cross-component imports after moves**

| File | Import |
| --- | --- |
| `media/TechBackdrop.svelte` | `../domain/tech/TechIcon.svelte` |
| `domain/tech/TopicHero.svelte` | `../../media/TechBackdrop.svelte` |
| `domain/tech/TechHeader.svelte` | `../../chrome/LogoIcon.svelte` |
| `chrome/SiteHeader.svelte` | `./LogoIcon.svelte` |
| `domain/work/GridItem.svelte` | `../../feedback/StatusIndicator.svelte`, `../../media/TechBackdrop.svelte`, `./DetailsModal.svelte` |
| `media/MiniImageGallery.svelte` | `./LazyLoadImage.svelte` |
| `domain/links/LinksSection.svelte` | `./LinkItem.svelte` |
| `util/tech-icons.ts` | paths stay `../components/icons/...` (icons folder does not move) |

---

### Task 1: Scaffold — move inventory + retitle existing stories

**Files:**
- Create dirs: `src/components/{actions,feedback,chrome,layout,media,domain/tech,domain/work,domain/links}/`
- Move (via `git mv`) every component + existing story listed in the File structure section
- Move: `src/lib/components/ThemeToggle.svelte` + `ThemeToggle.stories.svelte` → `src/components/chrome/`
- Modify: all route imports under `src/routes/**`, `src/util/tech-icons.ts` (icons path unchanged — verify only), internal component relative imports, every existing `title: 'Components/...'` → taxonomy title
- Modify: `src/routes/+layout.svelte` ThemeToggle import
- Test: `npm run check`

**Interfaces:**
- Consumes: existing component public APIs (unchanged)
- Produces: on-disk taxonomy matching Storybook titles below

**Title map for existing stories**

| Component | New `title` |
| --- | --- |
| AnchorButton | `Actions/AnchorButton` |
| SpecialButton | `Actions/SpecialButton` |
| ButtonContainer | `Actions/ButtonContainer` |
| Link | `Actions/Link` |
| Select | `Actions/Select` |
| StatusIndicator | `Feedback/StatusIndicator` |
| SimpleSpinner | `Feedback/SimpleSpinner` |
| SiteHeader | `Chrome/SiteHeader` |
| ThemeToggle | `Chrome/ThemeToggle` |
| Section | `Layout/Section` |
| TechHeader | `Domain/Tech/TechHeader` |
| TechIcon | `Domain/Tech/TechIcon` |

- [ ] **Step 1: Create folders**

```bash
mkdir -p \
  src/components/actions \
  src/components/feedback \
  src/components/chrome \
  src/components/layout \
  src/components/media \
  src/components/domain/tech \
  src/components/domain/work \
  src/components/domain/links
```

- [ ] **Step 2: `git mv` actions + feedback + layout + chrome (partial)**

```bash
git mv src/components/AnchorButton.svelte src/components/AnchorButton.stories.svelte src/components/actions/
git mv src/components/SpecialButton.svelte src/components/SpecialButton.stories.svelte src/components/actions/
git mv src/components/ButtonContainer.svelte src/components/ButtonContainer.stories.svelte src/components/actions/
git mv src/components/Link.svelte src/components/Link.stories.svelte src/components/actions/
git mv src/components/Select.svelte src/components/Select.stories.svelte src/components/actions/

git mv src/components/StatusIndicator.svelte src/components/StatusIndicator.stories.svelte src/components/feedback/
git mv src/components/SimpleSpinner.svelte src/components/SimpleSpinner.stories.svelte src/components/feedback/

git mv src/components/Section.svelte src/components/Section.stories.svelte src/components/layout/
git mv src/components/PageContainer.svelte src/components/layout/
git mv src/components/StickySectionHeader.svelte src/components/layout/

git mv src/components/SiteHeader.svelte src/components/SiteHeader.stories.svelte src/components/chrome/
git mv src/components/Logo.svelte src/components/LogoIcon.svelte src/components/chrome/
git mv src/lib/components/ThemeToggle.svelte src/lib/components/ThemeToggle.stories.svelte src/components/chrome/
```

- [ ] **Step 3: `git mv` media + domain**

```bash
git mv src/components/LazyLoadImage.svelte src/components/MiniImageGallery.svelte \
  src/components/TechBackdrop.svelte src/components/ProfileDiamond.svelte src/components/media/

git mv src/components/TechHeader.svelte src/components/TechHeader.stories.svelte \
  src/components/TechIcon.svelte src/components/TechIcon.stories.svelte \
  src/components/TopicHero.svelte src/components/domain/tech/

git mv src/components/GridItem.svelte src/components/DetailsModal.svelte src/components/domain/work/

git mv src/components/links/LinkItem.svelte src/components/links/LinksSection.svelte \
  src/components/domain/links/
rmdir src/components/links 2>/dev/null || true
```

- [ ] **Step 4: Fix relative util + cross-component imports**

Update these files (and any other broken relatives `npm run check` reports):

`src/components/layout/StickySectionHeader.svelte` — util path:

```ts
import { stuckDetect } from '../../util/stuck-detect';
```

`src/components/media/LazyLoadImage.svelte`:

```ts
import { imageCache } from '../../util/image-cache';
```

`src/components/media/TechBackdrop.svelte`:

```ts
import { getTechIcon, type TechIcon as TechIconT } from '../../util/tech-icons';
import { registerParallax } from '../../util/parallax-coordinator';
import TechIcon from '../domain/tech/TechIcon.svelte';
```

`src/components/domain/tech/TopicHero.svelte`:

```ts
import TechBackdrop from '../../media/TechBackdrop.svelte';
```

`src/components/domain/tech/TechHeader.svelte`:

```ts
import LogoIcon from '../../chrome/LogoIcon.svelte';
```

`src/components/domain/tech/TechIcon.svelte` — util path becomes `../../util/tech-icons` (was `../util`).

`src/components/domain/tech/TechIcon.stories.svelte` — same util depth fix.

`src/components/domain/work/GridItem.svelte`:

```ts
import StatusIndicator from '../../feedback/StatusIndicator.svelte';
import TechBackdrop from '../../media/TechBackdrop.svelte';
import DetailsModal from './DetailsModal.svelte';
import { getFormattedDate } from '../../../util/dates';
```

`src/components/domain/work/DetailsModal.svelte`:

```ts
import { getFormattedDate } from '../../../util/dates';
```

`src/components/domain/links/LinkItem.svelte` and `LinksSection.svelte`:

```ts
import type { ExternalLink, ExternalLinkKind } from '../../../util/links';
// LinksSection only needs ExternalLink
```

`src/components/chrome/ThemeToggle.svelte` — keep `$lib/theme.svelte` import (alias still works).

- [ ] **Step 5: Retitle every existing story**

In each moved `*.stories.svelte`, change `title` per the Title map (e.g. `'Components/Link'` → `'Actions/Link'`).

- [ ] **Step 6: Update route imports**

`src/routes/+layout.svelte`:

```ts
import ThemeToggle from '../components/chrome/ThemeToggle.svelte';
```

`src/routes/+page.svelte` (representative — apply same pattern to all routes from the grep list):

```ts
import Logo from '../components/chrome/Logo.svelte';
import TechIcon from '../components/domain/tech/TechIcon.svelte';
import LinksSection from '../components/domain/links/LinksSection.svelte';
import GridItem from '../components/domain/work/GridItem.svelte';
import ProfileDiamond from '../components/media/ProfileDiamond.svelte';
import PageContainer from '../components/layout/PageContainer.svelte';
import StickySectionHeader from '../components/layout/StickySectionHeader.svelte';
```

Also update:

- `src/routes/bookmarks/+page.svelte` → `layout/PageContainer`, `chrome/SiteHeader`
- `src/routes/work/+page.svelte` → `actions/*`, `layout/PageContainer`, `domain/tech/TechHeader`, `feedback/StatusIndicator`
- `src/routes/work/[slug]/+page.svelte` → `domain/work/*`, `actions/*`, `domain/tech/*`, `layout/*`
- `src/routes/tech/+page.svelte` and `src/routes/tech/[slug]/+page.svelte` similarly

- [ ] **Step 7: Verify**

```bash
npm run check
```

Expected: no errors. Then smoke:

```bash
npm run storybook
```

Expected: sidebar groups `Actions`, `Feedback`, `Chrome`, `Layout`, `Domain/Tech` (not a flat `Components` list).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Reorganize components into Storybook taxonomy folders.

Mirror hybrid Actions/Feedback/Chrome/Layout/Media/Domain groups on disk and retitle existing stories.
EOF
)"
```

---

### Task 2: Stories for layout, chrome marks, media, TopicHero

**Files:**
- Create: `src/components/layout/PageContainer.stories.svelte`
- Create: `src/components/layout/StickySectionHeader.stories.svelte`
- Create: `src/components/chrome/Logo.stories.svelte`
- Create: `src/components/chrome/LogoIcon.stories.svelte`
- Create: `src/components/media/LazyLoadImage.stories.svelte`
- Create: `src/components/media/MiniImageGallery.stories.svelte`
- Create: `src/components/media/TechBackdrop.stories.svelte`
- Create: `src/components/media/ProfileDiamond.stories.svelte`
- Create: `src/components/domain/tech/TopicHero.stories.svelte`
- Test: `npm run check`

**Interfaces:**
- Consumes: components as moved in Task 1
- Produces: one Default story (plus listed variants) for each file above

- [ ] **Step 1: Write `PageContainer.stories.svelte`**

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PageContainer from './PageContainer.svelte';

	const { Story } = defineMeta({
		title: 'Layout/PageContainer',
		component: PageContainer,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Centered page shell: `max-w-5xl`, horizontal padding, column flex. Pass extra classes via `class`.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<PageContainer>
			<p>Page content</p>
		</PageContainer>
	{/snippet}
</Story>
```

- [ ] **Step 2: Write `StickySectionHeader.stories.svelte`**

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StickySectionHeader from './StickySectionHeader.svelte';

	const { Story } = defineMeta({
		title: 'Layout/StickySectionHeader',
		component: StickySectionHeader,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Sticky section chrome. Scroll the story canvas to see the stuck styles (`is-stuck`) engage.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="min-height: 120vh;">
			<StickySectionHeader>
				<h2 class="section-title">Projects</h2>
			</StickySectionHeader>
			<p style="margin-top: 2rem; opacity: 0.7;">Scroll to pin the header.</p>
		</div>
	{/snippet}
</Story>
```

- [ ] **Step 3: Write Logo + LogoIcon stories**

`Chrome/Logo` — wrap in a sized box (`width: 12rem; height: 6rem`) so the SVG is visible.

`Chrome/LogoIcon` — wrap in `width: 2.5rem; height: 2.5rem; color: currentColor`.

- [ ] **Step 4: Write media stories**

`LazyLoadImage` — use a public placeholder (e.g. `/favicon.png` or a small file under `static/`), `shouldLoad: true`, and a `Loading` story with `shouldLoad: false`.

`MiniImageGallery` — `isOpen: true` with 2–3 fixture images pointing at static assets; second story `Closed` with `isOpen: false`.

`TechBackdrop` — `tags: ['TypeScript', 'React', 'Svelte']`, optional `Dense` story with higher `rows`/`cols`.

`ProfileDiamond` — Default only (self-contained decorative component).

- [ ] **Step 5: Write `TopicHero.stories.svelte`**

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TopicHero from './TopicHero.svelte';

	const { Story } = defineMeta({
		title: 'Domain/Tech/TopicHero',
		component: TopicHero,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Tech-page hero shell: `TechBackdrop` plus a slotted content area.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ tags: ['TypeScript', 'Svelte', 'Playwright'] }}>
	{#snippet template(args)}
		<TopicHero {...args}>
			<h1 style="font-size: 1.75rem; font-weight: 700;">TypeScript</h1>
			<p style="opacity: 0.75;">Slotted hero copy.</p>
		</TopicHero>
	{/snippet}
</Story>
```

- [ ] **Step 6: Verify + commit**

```bash
npm run check
git add src/components/layout/*.stories.svelte \
  src/components/chrome/Logo.stories.svelte \
  src/components/chrome/LogoIcon.stories.svelte \
  src/components/media/*.stories.svelte \
  src/components/domain/tech/TopicHero.stories.svelte
git commit -m "$(cat <<'EOF'
Add Storybook coverage for layout, chrome, and media.

EOF
)"
```

---

### Task 3: Icon stories + gallery

**Files:**
- Create: `src/components/icons/AwsIcon.stories.svelte`
- Create: `src/components/icons/DropwizardIcon.stories.svelte`
- Create: `src/components/icons/EmotionIcon.stories.svelte`
- Create: `src/components/icons/OpenCodeIcon.stories.svelte`
- Create: `src/components/icons/PlaywrightIcon.stories.svelte`
- Create: `src/components/icons/IconsGallery.stories.svelte`
- Test: `npm run check`

**Interfaces:**
- Consumes: each icon’s `size?: number` prop (default 24)
- Produces: `Icons/<Name>` Default stories + `Icons/Gallery`

- [ ] **Step 1: Per-icon story template** (repeat for all five; change import/title/name)

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AwsIcon from './AwsIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/AwsIcon',
		component: AwsIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom AWS mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
```

- [ ] **Step 2: Gallery story**

```svelte
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AwsIcon from './AwsIcon.svelte';
	import DropwizardIcon from './DropwizardIcon.svelte';
	import EmotionIcon from './EmotionIcon.svelte';
	import OpenCodeIcon from './OpenCodeIcon.svelte';
	import PlaywrightIcon from './PlaywrightIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/Gallery',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'All custom tech icons at a glance.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; color: currentColor;">
			<span title="AWS"><AwsIcon size={40} /></span>
			<span title="Dropwizard"><DropwizardIcon size={40} /></span>
			<span title="Emotion"><EmotionIcon size={40} /></span>
			<span title="OpenCode"><OpenCodeIcon size={40} /></span>
			<span title="Playwright"><PlaywrightIcon size={40} /></span>
		</div>
	{/snippet}
</Story>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run check
git add src/components/icons/*.stories.svelte
git commit -m "$(cat <<'EOF'
Add Storybook stories for custom tech icons.

EOF
)"
```

---

### Task 4: `LinkItemView` shell + fixtures + stories

**Files:**
- Create: `src/components/domain/links/LinkItemView.svelte`
- Create: `src/components/domain/links/fixtures/sampleLinks.ts`
- Create: `src/components/domain/links/LinkItem.stories.svelte`
- Create: `src/components/domain/links/LinksSection.stories.svelte`
- Modify: `src/components/domain/links/LinkItem.svelte` → thin Fathom container
- Test: `npm run check`; `rg "fathom" src/components/domain/links/LinkItemView.svelte` → no matches

**Interfaces:**
- Consumes: `ExternalLink` from `src/util/links.ts`
- Produces:
  - `LinkItemView` props: `link: ExternalLink`, `onClick?: () => void` (default no-op)
  - `LinkItem` public props unchanged: `link: ExternalLink`
  - Fixture: `sampleLinks: ExternalLink[]`

- [ ] **Step 1: Add fixtures**

```ts
// src/components/domain/links/fixtures/sampleLinks.ts
import type { ExternalLink } from '../../../../util/links';

export const sampleLinks: ExternalLink[] = [
	{
		title: 'GitHub',
		url: 'https://github.com/example',
		host: 'github.com',
		kind: 'github'
	},
	{
		title: 'Email',
		url: 'mailto:hello@example.com',
		host: 'Email',
		kind: 'email'
	},
	{
		title: 'Personal site',
		url: 'https://example.com',
		host: 'example.com',
		kind: 'website'
	}
];

export const sampleGithubLink = sampleLinks[0];
```

- [ ] **Step 2: Extract `LinkItemView.svelte`**

Move all markup and icon-resolution logic from current `LinkItem.svelte` into `LinkItemView.svelte`.

Script contract:

```ts
import type { ExternalLink, ExternalLinkKind } from '../../../util/links';
// lucide + simple-icons imports stay in the View

export let link: ExternalLink;
export let onClick: () => void = () => {};
```

Wire the anchor: `on:click={onClick}` (no Fathom import).

- [ ] **Step 3: Rewrite `LinkItem.svelte` as container**

```svelte
<script lang="ts">
	import * as Fathom from 'fathom-client';
	import type { ExternalLink } from '../../../util/links';
	import LinkItemView from './LinkItemView.svelte';

	export let link: ExternalLink;

	const handleClick = () => {
		Fathom.trackEvent(`click_main_link-${link.title}`);
	};
</script>

<LinkItemView {link} onClick={handleClick} />
```

- [ ] **Step 4: Stories**

`LinkItem.stories.svelte` — `title: 'Domain/Links/LinkItem'`, `component: LinkItemView`, stories: Default (github), Email, Website. Use `action: 'click'` via wrapping `onClick` in the story template if useful.

`LinksSection.stories.svelte` — `title: 'Domain/Links/LinksSection'`, `component: LinksSection`, Default with `links={sampleLinks}`. Note: section still uses the container `LinkItem` (Fathom may no-op harmlessly in Storybook); acceptable per spec (only Views must be Fathom-free). Optional follow-up: pass View through a story-only composition — not required.

- [ ] **Step 5: Verify isolation + check**

```bash
rg -i fathom src/components/domain/links/LinkItemView.svelte; echo "exit:$?"
# Expected: no matches (rg exit 1) — View must stay clean
npm run check
```

- [ ] **Step 6: Commit**

```bash
git add src/components/domain/links/
git commit -m "$(cat <<'EOF'
Extract LinkItemView and add domain link stories.

Keep Fathom in the LinkItem container so Storybook can target the presentational shell.
EOF
)"
```

---

### Task 5: `DetailsModalView` shell + fixtures + stories

**Files:**
- Create: `src/components/domain/work/DetailsModalView.svelte`
- Create: `src/components/domain/work/fixtures/sampleWorkItem.ts`
- Create: `src/components/domain/work/fixtures/sampleProjectItem.ts`
- Create: `src/components/domain/work/DetailsModal.stories.svelte`
- Modify: `src/components/domain/work/DetailsModal.svelte` → thin wrapper
- Test: `npm run check`

**Interfaces:**
- Consumes: same public props as today’s `DetailsModal`
- Produces:
  - `DetailsModalView` props identical to current `DetailsModal`: `open`, `item`, `type`, `tech`, `onClose`
  - `DetailsModal.svelte` re-exports by rendering `<DetailsModalView {...} />` (keeps route import path)
  - Fixtures typed loosely to match `Work` / `Project` shapes used at runtime

- [ ] **Step 1: Add fixtures**

```ts
// src/components/domain/work/fixtures/sampleWorkItem.ts
export const sampleWorkItem = {
	title: 'Staff Engineer',
	companyName: 'Example Co',
	companySlug: 'example-co',
	description: 'Built platform APIs and design systems.',
	url: 'https://example.com',
	image: '/favicon.png',
	isCurrent: true,
	startDate: new Date('2022-01-01'),
	endDate: undefined as Date | undefined,
	techTags: ['TypeScript', 'Svelte', 'PostgreSQL']
};

export const sampleTech = [
	{ name: 'TypeScript', type: 'Language', proficiencyWeight: 5 },
	{ name: 'Svelte', type: 'Framework', proficiencyWeight: 4 },
	{ name: 'PostgreSQL', type: 'Database', proficiencyWeight: 3 }
];
```

```ts
// src/components/domain/work/fixtures/sampleProjectItem.ts
export const sampleProjectItem = {
	name: 'Personal site',
	description: 'Static SvelteKit portfolio with Notion-backed links.',
	url: 'https://example.com',
	source: 'https://github.com/example/site',
	isActive: true,
	startDate: new Date('2024-01-01'),
	techTags: ['Svelte', 'TypeScript'],
	media: ['/favicon.png']
};
```

- [ ] **Step 2: Extract view**

```bash
git mv src/components/domain/work/DetailsModal.svelte \
  src/components/domain/work/DetailsModalView.svelte
```

Then recreate `DetailsModal.svelte` as:

```svelte
<script lang="ts">
	import DetailsModalView from './DetailsModalView.svelte';

	export let open = false;
	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let tech: Array<{ name: string; type?: string; proficiencyWeight?: number }> = [];
	export let onClose: () => void = () => {};
</script>

<DetailsModalView {open} {item} {type} {tech} {onClose} />
```

Do not change markup inside `DetailsModalView.svelte` in this task.

- [ ] **Step 3: Stories**

`title: 'Domain/Work/DetailsModal'`, `component: DetailsModalView`.

Stories:

1. **Open Work** — `open: true`, `type: 'work'`, `item: sampleWorkItem`, `tech: sampleTech`
2. **Open Project** — `open: true`, `type: 'project'`, `item: sampleProjectItem`, `tech: sampleTech`
3. **Closed** — `open: false` (documents inert state)

Use a local `let open = true` + `onClose` in snippets if controls need two-way open state.

- [ ] **Step 4: Verify + commit**

```bash
npm run check
# Spot-check: open work detail page still opens the modal via GridItem
git add src/components/domain/work/
git commit -m "$(cat <<'EOF'
Extract DetailsModalView for Storybook-friendly domain coverage.

EOF
)"
```

---

### Task 6: `GridItemView` shell + stories

**Files:**
- Create: `src/components/domain/work/GridItemView.svelte`
- Create: `src/components/domain/work/GridItem.stories.svelte`
- Modify: `src/components/domain/work/GridItem.svelte` → Fathom container wrapping the view
- Test: `npm run check`; confirm no Fathom in `GridItemView.svelte`

**Interfaces:**
- Consumes: `DetailsModal` public API (container or view — prefer importing `DetailsModal` container from GridItemView to avoid double-wiring, OR import `DetailsModalView` and manage `open` locally)
- Produces:
  - `GridItemView` props:
    - `item: any`
    - `type: 'work' | 'project' = 'work'`
    - `idHash?: (name: string) => string`
    - `tech: Array<{ name: string; type?: string }> = []`
    - `onLinkClick?: (linkType: string, itemName: string) => void`
    - `onSourceClick?: (itemName: string) => void`
    - `onDetailsClick?: () => void`
  - View owns `detailsOpen` UI state; calls `onDetailsClick` when the details control is activated, then sets `detailsOpen = true`
  - `GridItem` keeps the same public props as today and supplies Fathom-backed callbacks

- [ ] **Step 1: Move markup into `GridItemView.svelte`**

```bash
# Prefer copy-then-trim over blind mv so GridItem.svelte can become the container
cp src/components/domain/work/GridItem.svelte src/components/domain/work/GridItemView.svelte
```

In `GridItemView.svelte`:

1. Remove `import * as Fathom from 'fathom-client'`.
2. Add callback props with no-op defaults:

```ts
export let onLinkClick: (linkType: string, itemName: string) => void = () => {};
export let onSourceClick: (itemName: string) => void = () => {};
export let onDetailsClick: () => void = () => {};
```

3. Replace Fathom handlers with:

```ts
const handleLinkClick = (linkType: string, itemName: string) => {
	onLinkClick(linkType, itemName);
};

const handleSourceClick = (itemName: string) => {
	onSourceClick(itemName);
};

const handleDetailsClick = () => {
	onDetailsClick();
	detailsOpen = true;
};
```

4. Keep `DetailsModal` usage (import `./DetailsModal.svelte`) so open/close behavior stays identical.

- [ ] **Step 2: Rewrite `GridItem.svelte` container**

```svelte
<script lang="ts">
	import * as Fathom from 'fathom-client';
	import GridItemView from './GridItemView.svelte';

	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	$: titleField = type === 'work' ? item.title : item.name;
	$: detailsEventName =
		type === 'work' ? `click_work_details-${titleField}` : `click_project_details-${titleField}`;

	const handleLinkClick = (_linkType: string, itemName: string) => {
		const eventName =
			type === 'work' ? `click_work_link-${itemName}` : `click_project_link-${itemName}`;
		Fathom.trackEvent(eventName);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		Fathom.trackEvent(detailsEventName);
	};
</script>

<GridItemView
	{item}
	{type}
	{idHash}
	{tech}
	onLinkClick={handleLinkClick}
	onSourceClick={handleSourceClick}
	onDetailsClick={handleDetailsClick}
/>
```

- [ ] **Step 3: Stories**

`title: 'Domain/Work/GridItem'`, `component: GridItemView`.

1. **Work Current** — `sampleWorkItem`, `type: 'work'`, `tech: sampleTech`
2. **Project Active** — `sampleProjectItem`, `type: 'project'`, `tech: sampleTech`
3. Optional: wrap in `<ul>` since the root element is `<li>`

- [ ] **Step 4: Verify isolation + check**

```bash
rg -i fathom src/components/domain/work/GridItemView.svelte; echo "exit:$?"
# Expected: no matches
npm run check
```

Dev spot-check: landing projects/work cards, open details modal, external links still work.

- [ ] **Step 5: Commit**

```bash
git add src/components/domain/work/
git commit -m "$(cat <<'EOF'
Extract GridItemView and add work/project card stories.

EOF
)"
```

---

### Task 7: QA hook documentation

**Files:**
- Modify: `README.md` (Storybook section)
- Modify: `AGENTS.md` (Project Structure bullet for `src/components/` groups)
- Modify: `docs/superpowers/specs/2026-07-25-storybook-migration-design.md` — set Status to `Accepted`

**Interfaces:**
- Consumes: final story titles / IDs from Tasks 1–6
- Produces: documented path to future visual QA

- [ ] **Step 1: Extend README Storybook section**

Append after the existing Storybook blurb:

```markdown
### Story organization

Stories are grouped to match folders under `src/components/`:

- `Actions/` — buttons, links, select
- `Feedback/` — status + spinners
- `Chrome/` — site header, logos, theme toggle
- `Layout/` — page/section scaffolding
- `Media/` — images, backdrops, profile diamond
- `Icons/` — custom tech icons (+ Gallery)
- `Domain/Tech|Work|Links/` — feature composites

Presentational `*View` shells are what Storybook targets for analytics-coupled
composites (`GridItem`, `LinkItem`, `DetailsModal`). Containers keep Fathom calls.

### Future visual QA

Story IDs are stable CSF paths derived from `title` + story `name`
(e.g. `domain-work-griditem--work-current`). Optional later hooks:

- `npm run build-storybook` then browse `storybook-static/`
- Playwright against the static build, or Chromatic on CI

No visual-regression CI is wired yet.
```

- [ ] **Step 2: Update `AGENTS.md` structure bullet**

Replace the `src/components/` line with:

```markdown
- `src/components/` contains reusable UI grouped by Storybook taxonomy (`actions/`, `feedback/`, `chrome/`, `layout/`, `media/`, `icons/`, `domain/*/`); keep names PascalCase and colocate `*.stories.svelte`.
```

- [ ] **Step 3: Mark spec accepted**

In the design spec header: `**Status:** Accepted`

- [ ] **Step 4: Final verification**

```bash
npm run check
npm run build-storybook
```

Expected: build succeeds. Manually confirm sidebar groups and that every component file under `src/components` (except containers that delegate to Views, and fixtures) has a story — containers `GridItem`/`DetailsModal`/`LinkItem` are covered via View stories titled with the public name.

Inventory checklist:

```bash
# Components without a colocated *.stories.svelte (Containers OK if *View has stories)
find src/components -name '*.svelte' ! -name '*View.svelte' ! -name '*.stories.svelte' | sort
```

Ensure each remaining file is either a container covered by a View story, or has its own story.

- [ ] **Step 5: Commit**

```bash
git add README.md AGENTS.md docs/superpowers/specs/2026-07-25-storybook-migration-design.md
git commit -m "$(cat <<'EOF'
Document Storybook taxonomy and future visual QA hooks.

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
| --- | --- |
| Hybrid taxonomy on disk | Task 1 |
| Retitle existing stories | Task 1 |
| ThemeToggle → chrome, no `$lib` shim | Task 1 |
| Full inventory stories (layout/media/chrome/TopicHero) | Task 2 |
| Icons + Gallery | Task 3 |
| LinkItemView + fixtures + LinksSection story | Task 4 |
| DetailsModalView + fixtures | Task 5 |
| GridItemView + stories | Task 6 |
| QA hook docs only (no CI) | Task 7 |
| No Fathom in Views | Tasks 4, 6 (rg gates); DetailsModal has none |
| `npm run check` per wave | Every task |

No TBD/placeholder steps remain. View callback names are consistent across Tasks 4 and 6 (`onClick` for links; `onLinkClick` / `onSourceClick` / `onDetailsClick` for grid).
