<script lang="ts">
	import Logo from '../components/chrome/Logo.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import TechIcon from '../components/domain/tech/TechIcon.svelte';
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
	import LinksSection from '../components/domain/links/LinksSection.svelte';
	import GridItem from '../components/domain/work/GridItem.svelte';
	import WorkExperienceCard from '../components/domain/work/WorkExperienceCard.svelte';
	import ProfileDiamond from '../components/media/ProfileDiamond.svelte';
	import PageContainer from '../components/layout/PageContainer.svelte';
	import StickySectionHeader from '../components/layout/StickySectionHeader.svelte';

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
			<StickySectionHeader>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Work
				</h2>
			</StickySectionHeader>
			<ul class="landing-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.work as work}
					<WorkExperienceCard item={work} />
				{/each}
			</ul>
		</section>

		<section use:revealOnView class="landing-section reveal-ready pb-16">
			<StickySectionHeader>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Projects
				</h2>
			</StickySectionHeader>
			<ul class="landing-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.projects as project}
					<GridItem item={project} {idHash} tech={data.tech} />
				{/each}
			</ul>
		</section>

		<section use:revealOnView class="landing-section reveal-ready">
			<StickySectionHeader>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Tech
				</h2>
			</StickySectionHeader>
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
</style>
