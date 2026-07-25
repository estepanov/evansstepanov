<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import TechIcon from '../components/TechIcon.svelte';
	import { MousePointer, ShoppingCart } from '@lucide/svelte';

	const preferredTechOrder = [
		'Runtime',
		'Language',
		'Framework',
		'Library',
		'Database',
		'Data',
		'Cloud',
		'DevOps',
		'AI'
	];

	import { SiReact, SiTypescript } from '@icons-pack/svelte-simple-icons';
	import LinksSection from '../components/links/LinksSection.svelte';
	import GridItem from '../components/GridItem.svelte';
	import ProfileDiamond from '../components/ProfileDiamond.svelte';
	import PageContainer from '../components/PageContainer.svelte';

	export let data;

	$: techTypes = (() => {
		const present = new Set<string>(
			data.tech.map((t: { type?: string }) => t.type).filter((t): t is string => Boolean(t))
		);
		const ordered = preferredTechOrder.filter((t) => present.has(t));
		const extras = [...present].filter((t) => !preferredTechOrder.includes(t)).sort();
		return [...ordered, ...extras];
	})();

	function revealOnView(
		node: HTMLElement,
		options: { delay?: number; rootMargin?: string; threshold?: number } = {}
	) {
		const { delay = 0, rootMargin = '0px 0px 24% 0px', threshold = 0.01 } = options;
		node.style.setProperty('--reveal-delay', `${delay}ms`);
		node.classList.add('reveal-ready');

		const show = () => {
			node.classList.add('is-visible');
		};

		if (
			!('IntersectionObserver' in window) ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			show();
			return {};
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					show();
					observer.disconnect();
				}
			},
			{ rootMargin, threshold }
		);

		observer.observe(node);

		return {
			destroy: () => observer.disconnect()
		};
	}

	function stuckDetect(node: HTMLElement) {
		// Sentinel pattern: a 1px invisible marker inserted just above the
		// sticky header. The header is stuck when the sentinel has scrolled
		// ABOVE the viewport (not just "not visible"; below-viewport means
		// the section hasn't been reached yet). We check
		// boundingClientRect.top < 0 to distinguish above vs below.
		const sentinel = document.createElement('div');
		sentinel.setAttribute('aria-hidden', 'true');
		sentinel.style.cssText = 'width:1px;height:1px;pointer-events:none;';
		node.parentElement?.insertBefore(sentinel, node);

		const io = new IntersectionObserver(
			([entry]) => {
				const stuck = !entry.isIntersecting && entry.boundingClientRect.top < 0;
				node.classList.toggle('is-stuck', stuck);
			},
			{ threshold: 0 }
		);
		io.observe(sentinel);
		return {
			destroy: () => {
				io.disconnect();
				sentinel.remove();
			}
		};
	}
</script>

<svelte:head>
	<title>Evans Stepanov</title>
	<script>
		document.documentElement.classList.add('js');
	</script>
</svelte:head>

<PageContainer class="landing-page space-y-16 mt-12">
	<header
		class="landing-hero reveal-on-load space-y-5 text-slate-900 dark:text-slate-100 flex justify-center items-center flex-col"
	>
		<div class="landing-logo w-56 md:w-64">
			<Logo />
		</div>
		<!-- <p class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
			Product-focused software engineer
		</p> -->
	</header>
	<main class="w-full">
		<section class="landing-section reveal-on-load space-y-6 pb-16">
			<div class="flex items-baseline justify-between py-3">
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					About
				</h2>
			</div>
			<div class="about-copy space-y-4 text-slate-700 dark:text-slate-300">
				<p class="leading-relaxed">
					<ProfileDiamond />
					I'm a
					<span class="font-semibold text-purple-700 dark:text-purple-400"
						>product focused <span class="inline-block"><ShoppingCart size={16} /></span></span
					>
					software engineer with a passion for building scalable, high-performance
					<span class="font-semibold text-purple-700 dark:text-purple-400"
						>web applications <span class="inline-block"><MousePointer size={16} /></span></span
					>. With experience at CLEAR, Amazon Web Services, and beyond, I've led major frontend and
					full-stack initiatives, from architecting frontend applications and optimizing legacy
					systems to enhancing accessibility and streamlining cloud infrastructure.
				</p>
				<p class="leading-relaxed">
					I primarily work in <span class="font-semibold text-purple-700 dark:text-purple-400">
						TypeScript <span class="inline-block"><SiTypescript size={16} /></span>
					</span>
					and specialize in
					<span class="font-semibold text-purple-700 dark:text-purple-400">
						React <span class="inline-block"><SiReact size={16} /></span>
					</span> with modern JavaScript tooling. I thrive on solving complex technical challenges with
					elegant, user-focused solutions.
				</p>
				<p class="leading-relaxed">
					When I'm not <code>coding</code>, you can find me
					<span class="font-semibold text-emerald-700 dark:text-emerald-400">dading</span>
					🍼,
					<span class="font-semibold text-emerald-700 dark:text-emerald-400">reading</span>
					📚,
					<span class="font-semibold text-emerald-700 dark:text-emerald-400">skiing</span>
					⛷️, playing <span class="font-semibold text-emerald-700 dark:text-emerald-400">Halo</span>
					🎮, or
					<span class="font-semibold text-emerald-700 dark:text-emerald-400">sleeping</span> 🛌.
				</p>
			</div>
		</section>

		<section class="landing-section reveal-on-load space-y-6 pb-16">
			<div class="flex items-baseline justify-between py-3">
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Links
				</h2>
			</div>
			<div class="link-list-motion">
				<LinksSection links={data.links} />
			</div>
		</section>

		<section use:revealOnView class="landing-section reveal-ready pb-16">
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
			>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Work
				</h2>
			</div>
			<ul class="landing-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.work as work}
					<GridItem item={work} type="work" tech={data.tech} />
				{/each}
			</ul>
		</section>

		<section use:revealOnView class="landing-section reveal-ready pb-16">
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
			>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Projects
				</h2>
			</div>
			<ul class="landing-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.projects as project}
					<GridItem item={project} type="project" {idHash} tech={data.tech} />
				{/each}
			</ul>
		</section>

		<section use:revealOnView class="landing-section reveal-ready">
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-center justify-between py-3"
			>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Tech
				</h2>
			</div>
			<div class="tech-rows mt-6">
				{#each techTypes as techType, rowIdx}
					{@const techItems = data.tech
						.filter((tech) => tech.type === techType)
						.slice()
						.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)}
					{#if techItems.length > 0}
						<div class="tech-row" style="--item-delay: {rowIdx * 70}ms;">
							<a href="/tech/#{techType.toLowerCase()}" class="tech-row__label">
								<span class="tech-row__label-text">{techType}</span>
								<span class="tech-row__rule" aria-hidden="true"></span>
							</a>
							<ul class="tech-row__items">
								{#each techItems as tech}
									{@const techIcon = getTechIcon(tech.name)}
									<li>
										<a href="/tech/{tech.name}" class="tech-item" title={tech.name}>
											<span class="tech-item__icon">
												{#if techIcon}
													<TechIcon icon={techIcon} size={18} />
												{:else}
													<span class="tech-item__fallback">{tech.name.charAt(0)}</span>
												{/if}
											</span>
											<span class="tech-item__name">{tech.name}</span>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</section>
	</main>
	<footer use:revealOnView class="landing-footer reveal-ready mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ―
			Thomas A. Edison
		</div>
	</footer>
</PageContainer>

<style>
	.landing-logo {
		position: relative;
		overflow: hidden;
		border-radius: 0.125rem;
		transform-origin: 50% 58%;
	}

	/* Hero is above the fold, so it plays its entrance on load via pure CSS
	 * rather than waiting for JS hydration + an IntersectionObserver. The `both`
	 * fill-mode applies the 0% keyframe (hidden/blurred) during the delay, so no
	 * separate hidden-state rule is needed. This lets the LCP element paint as
	 * soon as the render-blocking CSS arrives instead of after the JS bundle. */
	:global(html.js) .landing-hero:global(.reveal-on-load) .landing-logo {
		animation: landing-logo-in 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 40ms;
	}

	:global(html.js) .landing-section:global(.reveal-ready):not(:global(.is-visible)) > :first-child,
	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.link-list-motion
		:global(li),
	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.landing-grid
		> :global(.grid-card),
	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.tech-rows
		.tech-row,
	:global(html.js) .landing-footer:global(.reveal-ready):not(:global(.is-visible)) > * {
		opacity: 0;
		transform: translateY(14px);
	}

	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.tech-rows
		.tech-row {
		animation: none;
	}

	/* Below-the-fold sections reveal on scroll (JS adds .is-visible): fade + slide. */
	.landing-section:global(.is-visible) > :first-child {
		animation: landing-heading-in 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--reveal-delay, 0ms);
	}

	.landing-section:global(.is-visible) .about-copy > p,
	.landing-section:global(.is-visible) .link-list-motion :global(li),
	.landing-section:global(.is-visible) .landing-grid > :global(.grid-card),
	.landing-section:global(.is-visible) .tech-rows .tech-row,
	.landing-footer:global(.is-visible) > * {
		animation: landing-content-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: calc(var(--reveal-delay, 0ms) + var(--item-delay, 40ms));
	}

	/* Above-the-fold (hero heading + About copy) reveals on load. This text holds
	 * the LCP element, so it slides only and stays at opacity 1 — the element is
	 * paintable at first paint, keeping LCP ≈ FCP instead of waiting out a fade
	 * that also races hydration. Below-the-fold keeps the richer fade above. */
	.landing-section:global(.reveal-on-load) > :first-child {
		animation: landing-heading-slide 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--reveal-delay, 0ms);
	}

	.landing-section:global(.reveal-on-load) .about-copy > p,
	.landing-section:global(.reveal-on-load) .link-list-motion :global(li) {
		animation: landing-content-slide 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: calc(var(--reveal-delay, 0ms) + var(--item-delay, 40ms));
	}

	.about-copy > p:nth-child(1),
	.link-list-motion :global(li:nth-child(1)),
	.landing-grid > :global(.grid-card:nth-child(1)) {
		--item-delay: 40ms;
	}

	.about-copy > p:nth-child(2),
	.link-list-motion :global(li:nth-child(2)),
	.landing-grid > :global(.grid-card:nth-child(2)) {
		--item-delay: 80ms;
	}

	.about-copy > p:nth-child(3),
	.link-list-motion :global(li:nth-child(3)),
	.landing-grid > :global(.grid-card:nth-child(3)) {
		--item-delay: 120ms;
	}

	.link-list-motion :global(li:nth-child(4)),
	.landing-grid > :global(.grid-card:nth-child(4)) {
		--item-delay: 160ms;
	}

	.link-list-motion :global(li:nth-child(5)),
	.landing-grid > :global(.grid-card:nth-child(5)) {
		--item-delay: 200ms;
	}

	.link-list-motion :global(li:nth-child(6)),
	.landing-grid > :global(.grid-card:nth-child(6)) {
		--item-delay: 240ms;
	}

	.landing-grid > :global(.grid-card:nth-child(7)) {
		--item-delay: 280ms;
	}

	.landing-grid > :global(.grid-card:nth-child(8)) {
		--item-delay: 320ms;
	}

	.landing-grid > :global(.grid-card:nth-child(9)) {
		--item-delay: 360ms;
	}

	.landing-grid > :global(.grid-card:nth-child(10)) {
		--item-delay: 400ms;
	}

	.landing-grid > :global(.grid-card:nth-child(11)) {
		--item-delay: 440ms;
	}

	.landing-grid > :global(.grid-card:nth-child(12)) {
		--item-delay: 480ms;
	}

	@keyframes landing-logo-in {
		0% {
			opacity: 0;
			filter: blur(8px);
			transform: translateY(10px) scale(0.97);
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0) scale(1);
		}
	}

	/* Heading/content reveals run on many elements at once (up to a dozen grid
	 * cards + list items staggering together). Animating filter:blur() there
	 * forces a full repaint per frame per element; opacity + transform stay on
	 * the compositor. The blur-in look is kept only on the single hero logo. */
	@keyframes landing-heading-in {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes landing-content-in {
		0% {
			opacity: 0;
			transform: translateY(14px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Slide-only variants for above-the-fold reveals (opacity stays 1 so the LCP
	 * text is painted immediately). */
	@keyframes landing-heading-slide {
		0% {
			transform: translateY(10px);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes landing-content-slide {
		0% {
			transform: translateY(14px);
		}
		100% {
			transform: translateY(0);
		}
	}

	.section-header {
		isolation: isolate;
		width: 100%;
	}

	.section-title {
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: 0.18em;
		transition:
			font-size 0.3s ease,
			letter-spacing 0.3s ease;
	}

	.section-header:global(.is-stuck) .section-title {
		font-size: 0.875rem;
		letter-spacing: 0.15em;
	}

	.section-header::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - 50vw);
		width: 100vw;
		z-index: -1;
		background-color: transparent;
		border-bottom: 1px solid transparent;
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			backdrop-filter 0.25s ease;
	}

	.section-header:global(.is-stuck)::before {
		background-color: rgb(255 255 255 / 0.75);
		border-bottom-color: rgb(226 232 240 / 0.8);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	:global(.dark) .section-header:global(.is-stuck)::before {
		background-color: rgb(2 6 23 / 0.75);
		border-bottom-color: rgb(30 41 59 / 0.8);
	}

	@media (prefers-reduced-motion: reduce) {
		.landing-logo,
		.landing-section > :first-child,
		.about-copy > p,
		.link-list-motion :global(li),
		.landing-grid > :global(.grid-card),
		.tech-rows .tech-row,
		.landing-footer > * {
			animation: none !important;
			filter: none !important;
			opacity: 1 !important;
			transform: none !important;
		}

		.section-header::before,
		.section-title {
			transition: none;
		}
	}

	.prof-bar {
		display: block;
		height: var(--bar-fill, 0%);
		min-height: 2px;
		background-color: var(--color-slate-300);
		transform-origin: center bottom;
		animation: prof-bar-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: var(--bar-delay, 0ms);
		transform: scaleY(0);
		transition: background-color 220ms ease;
	}

	:global(html.dark) .prof-bar {
		background-color: var(--color-slate-700);
	}

	.prof-chart:hover .prof-bar,
	.prof-chart:focus-within .prof-bar {
		background-color: var(--color-violet-500);
	}

	:global(html.dark) .prof-chart:hover .prof-bar,
	:global(html.dark) .prof-chart:focus-within .prof-bar {
		background-color: var(--color-violet-400);
	}

	.prof-mean-line {
		height: 0;
		border-top: 1px dashed var(--color-slate-300);
		opacity: 0.9;
	}

	:global(html.dark) .prof-mean-line {
		border-top-color: var(--color-slate-700);
	}

	.prof-hit {
		z-index: 2;
		background: transparent;
		border: 0;
		cursor: pointer;
	}

	.tile-dimmed {
		opacity: 0.25;
	}

	.tile-dimmed:hover,
	.tile-dimmed:focus-visible {
		opacity: 1;
	}

	.prof-bar--selected {
		background-color: var(--color-violet-500) !important;
	}

	:global(html.dark) .prof-bar--selected {
		background-color: var(--color-violet-400) !important;
	}

	@keyframes prof-bar-in {
		to {
			transform: scaleY(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.prof-bar {
			animation: none;
			transform: scaleY(1);
		}
	}

	.prof-controls {
		position: relative;
		height: 1.75rem;
	}

	.prof-toggle {
		position: relative;
		background: transparent;
		border: 1px solid transparent;
		transition:
			color 200ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Both controls overlap inside .prof-controls; visibility is driven by the
	 * sticky-stuck state on the section header, so swapping doesn't move layout. */
	.prof-mini {
		position: absolute;
		inset: 0;
		justify-content: flex-end;
		padding-right: 0.25rem;
		opacity: 0;
		pointer-events: none;
		transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Lock the select trigger to a stable width so swapping options
	 * (All ↔ Intermediate ↔ Expert …) doesn't reflow the bar next to it. */
	.prof-mini :global(.select__trigger) {
		min-width: 8.5rem;
		justify-content: space-between;
	}

	.section-header:global(.is-stuck) .prof-toggle {
		opacity: 0;
		pointer-events: none;
	}

	.section-header:global(.is-stuck) .prof-mini {
		opacity: 1;
		pointer-events: auto;
	}

	.prof-mini__bar {
		position: relative;
		display: inline-flex;
		flex: 0 0 auto;
		width: clamp(88px, 18vw, 144px);
		height: 12px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--color-slate-300) 60%, transparent);
		gap: 3px;
		padding: 3px;
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--color-slate-300) 40%, transparent);
	}

	:global(html.dark) .prof-mini__bar {
		background: color-mix(in oklab, var(--color-slate-700) 50%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--color-slate-700) 60%, transparent);
	}

	/* Button is the unscaled hit area + positioning context for the tooltip.
	 * The visible bar is the inner __seg-fill, which carries the scale on
	 * hover/selected — keeping the tooltip outside the transformed element
	 * so it doesn't inherit the vertical stretch. */
	.prof-mini__seg {
		position: relative;
		display: block;
		flex-shrink: 1;
		min-width: 6px;
		height: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.prof-mini__seg:focus-visible {
		outline: none;
	}

	.prof-mini__seg:focus-visible .prof-mini__seg-fill {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-violet-500) 50%, transparent);
	}

	.prof-mini__seg-fill {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 999px;
		background: var(--color-slate-400);
		transform-origin: center;
		transition:
			background-color 200ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 200ms cubic-bezier(0.34, 1.4, 0.5, 1);
	}

	:global(html.dark) .prof-mini__seg-fill {
		background: var(--color-slate-500);
	}

	.prof-mini__seg:hover .prof-mini__seg-fill {
		background: var(--color-violet-500);
		transform: scaleY(1.4);
	}

	:global(html.dark) .prof-mini__seg:hover .prof-mini__seg-fill {
		background: var(--color-violet-400);
	}

	.prof-mini__seg--selected .prof-mini__seg-fill,
	.prof-mini__seg--selected:hover .prof-mini__seg-fill {
		background: var(--color-violet-600);
		transform: scaleY(1.25);
	}

	:global(html.dark) .prof-mini__seg--selected .prof-mini__seg-fill,
	:global(html.dark) .prof-mini__seg--selected:hover .prof-mini__seg-fill {
		background: var(--color-violet-400);
	}

	.prof-mini__seg--dim .prof-mini__seg-fill {
		opacity: 0.4;
	}

	.prof-mini__seg--dim:hover .prof-mini__seg-fill {
		opacity: 1;
	}

	/* Tooltip — matches the theme-toggle's mode-label aesthetic: glassy pill
	 * with backdrop blur, uppercase tracked text, surface tone matches page
	 * (light on light, dark on dark — not inverted). */
	.prof-mini__tip {
		position: absolute;
		top: calc(100% + 8px);
		left: 50%;
		transform: translate(-50%, -4px);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.32rem 0.7rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.78);
		-webkit-backdrop-filter: blur(12px) saturate(160%);
		backdrop-filter: blur(12px) saturate(160%);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: #1f2937;
		font-family: 'Albert Sans', sans-serif;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.05),
			0 8px 22px -14px rgba(0, 0, 0, 0.25);
		transition:
			opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 30;
	}

	:global(html.dark) .prof-mini__tip {
		background: rgba(17, 17, 17, 0.72);
		border-color: rgba(255, 255, 255, 0.08);
		color: #f3f4f6;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.4),
			0 10px 26px -14px rgba(0, 0, 0, 0.7);
	}

	.prof-mini__tip-count {
		opacity: 0.55;
		letter-spacing: 0.08em;
	}

	.prof-mini__seg:hover .prof-mini__tip,
	.prof-mini__seg:focus-visible .prof-mini__tip {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.prof-mini,
		.prof-mini__seg-fill,
		.prof-mini__tip {
			transition: none;
		}
		.prof-mini__seg:hover .prof-mini__seg-fill,
		.prof-mini__seg--selected .prof-mini__seg-fill {
			transform: none;
		}
	}

	.prof-toggle:hover,
	.prof-toggle[aria-expanded='true'] {
		background-color: color-mix(in oklab, var(--color-violet-500) 8%, transparent);
		border-color: color-mix(in oklab, var(--color-violet-500) 18%, transparent);
	}

	:global(html.dark) .prof-toggle:hover,
	:global(html.dark) .prof-toggle[aria-expanded='true'] {
		background-color: color-mix(in oklab, var(--color-violet-400) 10%, transparent);
		border-color: color-mix(in oklab, var(--color-violet-400) 22%, transparent);
	}

	.prof-toggle[aria-expanded='true'] {
		color: var(--color-violet-600);
	}

	:global(html.dark) .prof-toggle[aria-expanded='true'] {
		color: var(--color-violet-300);
	}

	.prof-toggle :global(.prof-toggle__chevron) {
		transition: transform 320ms cubic-bezier(0.34, 1.4, 0.5, 1);
	}

	.prof-toggle[aria-expanded='true'] :global(.prof-toggle__chevron) {
		transform: rotate(180deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.prof-toggle,
		.prof-toggle :global(.prof-toggle__chevron) {
			transition: none;
		}
	}

	/* Flat tech rows. The section signals breadth at a glance — depth lives on
	 * /tech — so there is no card surface, no proficiency label, and no hover
	 * lift. The only texture is the brand icons; hover tints text + icon. */
	.tech-rows {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.tech-row {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.tech-row__label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-slate-500);
		transition: color 200ms ease;
	}

	:global(html.dark) .tech-row__label {
		color: var(--color-slate-400);
	}

	.tech-row__label-text {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* The rule fills whatever the label text leaves, so every row's hairline
	 * ends flush at the right margin regardless of label length. */
	.tech-row__rule {
		flex: 1;
		height: 1px;
		background-color: var(--color-slate-200);
		transition: background-color 200ms ease;
	}

	:global(html.dark) .tech-row__rule {
		background-color: var(--color-slate-800);
	}

	.tech-row__label:hover,
	.tech-row__label:focus-visible {
		color: var(--color-emerald-600);
	}

	:global(html.dark) .tech-row__label:hover,
	:global(html.dark) .tech-row__label:focus-visible {
		color: var(--color-emerald-400);
	}

	.tech-row__items {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1.5rem;
		row-gap: 0.625rem;
	}

	.tech-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-slate-700);
		transition: color 200ms ease;
	}

	:global(html.dark) .tech-item {
		color: var(--color-slate-300);
	}

	.tech-item:hover,
	.tech-item:focus-visible {
		color: var(--color-emerald-600);
	}

	:global(html.dark) .tech-item:hover,
	:global(html.dark) .tech-item:focus-visible {
		color: var(--color-emerald-400);
	}

	/* outline (not a box-shadow ring) so the focus indicator can sit outside the
	 * element without a wrapper — these links have no padding to inset into. */
	.tech-row__label:focus-visible,
	.tech-item:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--color-emerald-500) 60%, transparent);
		outline-offset: 3px;
		border-radius: 0.25rem;
	}

	:global(html.dark) .tech-row__label:focus-visible,
	:global(html.dark) .tech-item:focus-visible {
		outline-color: color-mix(in oklab, var(--color-emerald-400) 60%, transparent);
	}

	.tech-item__icon {
		display: inline-flex;
		flex-shrink: 0;
	}

	.tech-item__name {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.tech-item__fallback {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 0.25rem;
		background-color: var(--color-slate-100);
		color: var(--color-slate-500);
		font-size: 10px;
		font-weight: 600;
		line-height: 1;
	}

	:global(html.dark) .tech-item__fallback {
		background-color: var(--color-slate-800);
		color: var(--color-slate-400);
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-row__label,
		.tech-row__rule,
		.tech-item {
			transition: none;
		}
	}
	/* Tech category cards — visual surface comes from the shared .card class.
	 * Local rules cover entrance stagger, the lift, and tile micro-interactions. */
	.tech-group-card {
		opacity: 0;
		transform: translateY(8px);
		animation: tech-card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: var(--card-delay, 0ms);
		transition:
			color 200ms ease,
			background-color 200ms ease,
			border-color 200ms ease,
			transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	@media (hover: hover) and (pointer: fine) {
		.tech-group-card:hover,
		.tech-group-card:focus-within {
			transform: translateY(-2px);
			border-color: var(--color-slate-300);
			background-color: rgb(255 255 255 / 0.7);
			box-shadow:
				0 1px 0 rgba(15, 23, 42, 0.02),
				0 10px 30px -18px rgba(15, 23, 42, 0.18);
		}

		:global(html.dark) .tech-group-card:hover,
		:global(html.dark) .tech-group-card:focus-within {
			border-color: var(--color-slate-700);
			background-color: rgb(15 23 42 / 0.6);
			box-shadow:
				0 1px 0 rgba(255, 255, 255, 0.02),
				0 10px 30px -18px rgba(0, 0, 0, 0.6);
		}
	}

	@keyframes tech-card-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.tech-tile {
		isolation: isolate;
	}

	.tech-tile-icon {
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tech-tile:hover .tech-tile-icon {
		transform: scale(1.08);
	}

	.tech-tile-name {
		position: relative;
		display: inline-block;
		max-width: 100%;
	}

	.tech-tile-name::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tech-tile:hover .tech-tile-name::after,
	.tech-tile:focus-visible .tech-tile-name::after {
		transform: scaleX(1);
	}

	/* Header link micro-interactions mirror GridItem's `details-btn`
	 * (underline-from-left) so tech cards read as the same family as
	 * work / project cards. The ↗ mark is reserved for links that leave
	 * the site, so these internal links carry no icon. */
	.tech-card-label {
		position: relative;
	}

	.tech-card-label::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -3px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tech-card-link:hover .tech-card-label::after,
	.tech-card-link:focus-visible .tech-card-label::after {
		transform: scaleX(1);
	}

	.tech-card-icon {
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.tech-group-card:hover .tech-card-icon,
		.tech-group-card:focus-within .tech-card-icon {
			background-color: var(--color-emerald-50);
			color: var(--color-emerald-600);
		}

		:global(html.dark) .tech-group-card:hover .tech-card-icon,
		:global(html.dark) .tech-group-card:focus-within .tech-card-icon {
			background-color: rgb(16 185 129 / 0.1);
			color: var(--color-emerald-400);
		}
	}

	/* Proficiency mark — a hairline rule that extends on hover, echoing
	 * the dashed header border above. Color is inherited from the tone class. */
	.tech-prof-rule {
		display: inline-block;
		width: 7px;
		height: 1px;
		background-color: currentColor;
		opacity: 0.55;
		transition:
			width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.25s ease;
	}

	.tech-tile:hover .tech-prof-rule,
	.tech-tile:focus-visible .tech-prof-rule {
		width: 14px;
		opacity: 0.9;
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-group-card {
			opacity: 1;
			transform: none;
			animation: none;
			transition-property: color, background-color, border-color;
		}
		.tech-group-card:hover,
		.tech-group-card:focus-within {
			transform: none;
		}
		.tech-tile-icon,
		.tech-tile:hover .tech-tile-icon {
			transform: none;
			animation: none;
			transition: none;
		}
		.tech-prof-rule,
		.tech-tile:hover .tech-prof-rule,
		.tech-tile:focus-visible .tech-prof-rule {
			transition: none;
			width: 9px;
		}
		.tech-card-label::after,
		.tech-card-icon,
		.tech-tile-name::after {
			transition: none;
		}
	}
</style>
