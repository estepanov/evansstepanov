<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import TechIcon from '../components/TechIcon.svelte';
	import {
		MousePointer,
		ShoppingCart,
		Cpu,
		Code2,
		Boxes,
		Library,
		Database,
		Wrench,
		Sparkles,
		Cloud,
		BarChart3,
		Tag,
		ChevronDown
	} from '@lucide/svelte';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const categoryMeta: Record<string, { icon: any; label: string }> = {
		Runtime: { icon: Cpu, label: 'Runtime' },
		Language: { icon: Code2, label: 'Language' },
		Framework: { icon: Boxes, label: 'Framework' },
		Library: { icon: Library, label: 'Library' },
		Database: { icon: Database, label: 'Database' },
		DevOps: { icon: Wrench, label: 'DevOps' },
		AI: { icon: Sparkles, label: 'AI' },
		Cloud: { icon: Cloud, label: 'Cloud' },
		Data: { icon: BarChart3, label: 'Data' }
	};

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

	const proficiencyLevel: Record<string, number> = {
		Beginner: 1,
		Intermediate: 2,
		Advanced: 3,
		Expert: 4
	};

	const proficiencyTone = 'text-violet-600 dark:text-violet-400';
	import { SiReact, SiTypescript } from '@icons-pack/svelte-simple-icons';
	import LinksSection from '../components/links/LinksSection.svelte';
	import GridItem from '../components/GridItem.svelte';
	import ProfileDiamond from '../components/ProfileDiamond.svelte';
	import PageContainer from '../components/PageContainer.svelte';
	import Select from '../components/Select.svelte';

	export let data;

	$: techTypes = (() => {
		const present = new Set<string>(
			data.tech.map((t: { type?: string }) => t.type).filter((t): t is string => Boolean(t))
		);
		const ordered = preferredTechOrder.filter((t) => present.has(t));
		const extras = [...present].filter((t) => !preferredTechOrder.includes(t)).sort();
		return [...ordered, ...extras];
	})();

	const proficiencyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
	const proficiencyDisplay: Record<string, string> = {
		Beginner: 'Novice',
		Intermediate: 'Intermediate',
		Advanced: 'Advanced',
		Expert: 'Expert'
	};
	$: profCounts = proficiencyOrder
		.map((level) => ({
			level,
			count: data.tech.filter((t: { proficiency: string }) => t.proficiency === level).length
		}))
		.filter((p) => p.count > 0);
	$: profMax = Math.max(1, ...profCounts.map((p) => p.count));
	$: profMean =
		profCounts.length === 0 ? 0 : profCounts.reduce((s, p) => s + p.count, 0) / profCounts.length;
	$: profSpread =
		profCounts.length === 0 || profMax === 0
			? 0
			: (profMax - Math.min(...profCounts.map((p) => p.count))) / profMax;
	$: profIsBalanced = profSpread <= 0.34;

	let selectedProf: string | null = null;
	function toggleProf(level: string) {
		selectedProf = selectedProf === level ? null : level;
	}

	let showProfChart = false;

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
		use:revealOnView={{ delay: 40, rootMargin: '0px', threshold: 0.01 }}
		class="landing-hero reveal-ready space-y-5 text-slate-900 dark:text-slate-100 flex justify-center items-center flex-col"
	>
		<div class="landing-logo w-56 md:w-64">
			<Logo />
		</div>
		<!-- <p class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
			Product-focused software engineer
		</p> -->
	</header>
	<main class="w-full">
		<section use:revealOnView={{ delay: 100 }} class="landing-section reveal-ready space-y-6 pb-16">
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

		<section use:revealOnView={{ delay: 130 }} class="landing-section reveal-ready space-y-6 pb-16">
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
				<div class="prof-controls inline-flex items-center">
					<button
						type="button"
						on:click={() => (showProfChart = !showProfChart)}
						aria-expanded={showProfChart}
						aria-controls="prof-chart-region"
						class="prof-toggle group/prof inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500/50 transition-colors duration-200"
					>
						<span>Proficiency</span>
						<ChevronDown
							size={13}
							strokeWidth={2.25}
							class="prof-toggle__chevron"
							aria-hidden="true"
						/>
					</button>
					<div class="prof-mini inline-flex items-center gap-2.5">
						<div class="prof-mini__bar" role="group" aria-label="Filter by proficiency">
							{#each profCounts as { level, count }}
								{@const isSelected = selectedProf === level}
								<button
									type="button"
									on:click={() => toggleProf(level)}
									aria-pressed={isSelected}
									aria-label="{isSelected ? 'Clear filter for' : 'Filter by'} {proficiencyDisplay[
										level
									]} ({count} skills)"
									class="prof-mini__seg"
									class:prof-mini__seg--selected={isSelected}
									class:prof-mini__seg--dim={selectedProf !== null && !isSelected}
									style="flex: {count};"
								>
									<span class="prof-mini__seg-fill" aria-hidden="true"></span>
									<span class="prof-mini__tip" role="tooltip">
										<span class="prof-mini__tip-label">{proficiencyDisplay[level]}</span>
										<span class="prof-mini__tip-count">{count}</span>
									</span>
								</button>
							{/each}
						</div>
						<Select
							bind:value={selectedProf}
							ariaLabel="Filter by proficiency"
							placeholder="All"
							options={[
								{ value: null, label: 'All', meta: String(data.tech.length) },
								...profCounts.map(({ level, count }) => ({
									value: level,
									label: proficiencyDisplay[level],
									meta: String(count)
								}))
							]}
						/>
					</div>
				</div>
			</div>
			{#if showProfChart}
				<div
					id="prof-chart-region"
					transition:slide={{ duration: 380, easing: cubicOut }}
					class="mt-6"
				>
					<figure
						in:fade={{ duration: 280, delay: 120, easing: cubicOut }}
						out:fade={{ duration: 140, easing: cubicOut }}
						class="prof-chart flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 px-1 py-2"
					>
						<div
							class="prof-grid flex-1 relative grid gap-x-2 sm:gap-x-3 gap-y-1.5"
							style="grid-template-columns: repeat({profCounts.length}, minmax(0, 1fr));"
						>
							{#each profCounts as { level, count }, i}
								{@const isSelected = selectedProf === level}
								{@const isDimmed = selectedProf !== null && !isSelected}
								<span
									class="prof-num text-[10px] font-medium tabular-nums text-slate-500 dark:text-slate-400 text-center transition-opacity duration-200"
									class:opacity-30={isDimmed}
									style="grid-column: {i + 1}; grid-row: 1;"
								>
									{count}
								</span>
								<span
									class="prof-track relative h-10 sm:h-12 flex justify-center items-end transition-opacity duration-200"
									class:opacity-30={isDimmed}
									style="--bar-delay: {i * 80}ms; --bar-fill: {(count / profMax) *
										100}%; grid-column: {i + 1}; grid-row: 2;"
								>
									<span class="prof-bar w-4 sm:w-6 rounded-xs" class:prof-bar--selected={isSelected}
									></span>
								</span>
								<span
									class="prof-label text-[10.5px] sm:text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 text-center truncate transition-opacity duration-200"
									class:opacity-30={isDimmed}
									style="grid-column: {i + 1}; grid-row: 3;"
								>
									{proficiencyDisplay[level]}
								</span>
								<button
									type="button"
									on:click={() => toggleProf(level)}
									aria-pressed={isSelected}
									aria-label="{isSelected ? 'Clear filter for' : 'Filter by'} {proficiencyDisplay[
										level
									]} ({count} skills)"
									class="prof-hit rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:focus-visible:ring-violet-400/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors duration-200"
									style="grid-column: {i + 1}; grid-row: 1 / 4;"
								></button>
							{/each}
							<span
								class="prof-mean pointer-events-none relative self-stretch"
								style="grid-column: 1 / -1; grid-row: 2;"
								aria-hidden="true"
							>
								<span
									class="prof-mean-line absolute inset-x-0"
									style="bottom: {(profMean / profMax) * 100}%;"
								></span>
							</span>
						</div>
						<figcaption
							class="prof-caption shrink-0 text-center sm:text-right text-[9.5px] sm:text-[10px] font-medium tracking-[0.18em] uppercase {profIsBalanced
								? 'text-violet-600 dark:text-violet-400'
								: 'text-slate-500 dark:text-slate-400'}"
						>
							<span class="sm:block">{profIsBalanced ? 'Balanced' : 'Skewed'}</span>
							<span
								class="text-slate-400 dark:text-slate-500 normal-case tracking-normal sm:block sm:mt-0.5"
							>
								<span class="sm:hidden"> · </span>across {data.tech.length} skills
							</span>
						</figcaption>
					</figure>
				</div>
			{/if}
			<div class="tech-grid mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each techTypes as techType, cardIdx}
					{@const techItems = data.tech
						.filter((tech) => tech.type === techType)
						.slice()
						.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)}
					{@const meta = categoryMeta[techType] ?? { icon: Tag, label: techType }}
					{#if techItems.length > 0}
						<article
							class="card tech-group-card group/card relative overflow-hidden flex flex-col p-5"
							style="--card-delay: {cardIdx * 70}ms;"
						>
							<header
								class="mb-3 pb-3 border-b border-dashed border-slate-200/70 dark:border-slate-800/70"
							>
								<a
									href="/tech/#{techType.toLowerCase()}"
									class="tech-card-link flex items-center text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-hidden focus-visible:text-emerald-700 dark:focus-visible:text-emerald-300 transition-colors duration-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400/60 dark:focus-visible:ring-offset-slate-950"
								>
									<span class="inline-flex items-center gap-2.5 min-w-0">
										<span
											class="tech-card-icon inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
										>
											<svelte:component this={meta.icon} size={15} strokeWidth={1.75} />
										</span>
										<span
											class="tech-card-label text-[11px] font-semibold tracking-[0.18em] uppercase"
										>
											{meta.label}
										</span>
									</span>
								</a>
							</header>

							<ul class="grid grid-cols-1 sm:grid-cols-2 gap-1 -mx-2 -mb-2">
								{#each techItems as tech, i}
									{@const techIcon = getTechIcon(tech.name)}
									{@const tileDimmed = selectedProf !== null && tech.proficiency !== selectedProf}
									<li class="contents">
										<a
											href="/tech/{tech.name}"
											title="{tech.name} · {tech.proficiency}"
											class="tech-tile group relative flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:focus-visible:ring-emerald-400/60"
											class:tile-dimmed={tileDimmed}
											style="--tile-delay: {i * 25}ms;"
										>
											<div class="tech-tile-icon shrink-0 text-slate-800 dark:text-slate-100">
												{#if techIcon}
													<TechIcon icon={techIcon} size={22} />
												{:else}
													<div
														class="w-[22px] h-[22px] rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-semibold text-slate-500 dark:text-slate-400"
													>
														{tech.name.charAt(0)}
													</div>
												{/if}
											</div>
											<div class="min-w-0 flex-1 flex flex-col leading-tight">
												<span
													class="tech-tile-name text-[13.5px] sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate"
												>
													{tech.name}
												</span>
												<span
													class="tech-prof mt-0.5 inline-flex items-center gap-1.5 leading-none {proficiencyTone}"
													aria-label="Proficiency: {tech.proficiency}"
												>
													<span class="tech-prof-rule" aria-hidden="true"></span>
													<span class="text-[10px] font-medium italic lowercase">
														{proficiencyDisplay[tech.proficiency] ?? tech.proficiency}
													</span>
												</span>
											</div>
										</a>
									</li>
								{/each}
							</ul>
						</article>
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

	:global(html.js) .landing-hero:global(.reveal-ready):not(:global(.is-visible)) .landing-logo {
		opacity: 0;
		filter: blur(8px);
		transform: translateY(10px) scale(0.97);
	}

	.landing-hero:global(.is-visible) .landing-logo {
		animation: landing-logo-in 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: var(--reveal-delay, 0ms);
	}

	:global(html.js) .landing-section:global(.reveal-ready):not(:global(.is-visible)) > :first-child,
	:global(html.js) .landing-section:global(.reveal-ready):not(:global(.is-visible)) .about-copy > p,
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
		.tech-grid
		.tech-group-card,
	:global(html.js) .landing-footer:global(.reveal-ready):not(:global(.is-visible)) > * {
		opacity: 0;
		filter: blur(6px);
		transform: translateY(14px);
	}

	:global(html.js)
		.landing-section:global(.reveal-ready):not(:global(.is-visible))
		.tech-grid
		.tech-group-card {
		animation: none;
	}

	.landing-section:global(.is-visible) > :first-child {
		animation: landing-heading-in 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--reveal-delay, 0ms);
	}

	.landing-section:global(.is-visible) .about-copy > p,
	.landing-section:global(.is-visible) .link-list-motion :global(li),
	.landing-section:global(.is-visible) .landing-grid > :global(.grid-card),
	.landing-section:global(.is-visible) .tech-grid .tech-group-card,
	.landing-footer:global(.is-visible) > * {
		animation: landing-content-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
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

	@keyframes landing-heading-in {
		0% {
			opacity: 0;
			filter: blur(5px);
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}

	@keyframes landing-content-in {
		0% {
			opacity: 0;
			filter: blur(6px);
			transform: translateY(14px);
		}
		100% {
			opacity: 1;
			filter: blur(0);
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
		.tech-grid .tech-group-card,
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
