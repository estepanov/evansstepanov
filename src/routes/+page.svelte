<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import TechIcon from '../components/TechIcon.svelte';
	import {
		MousePointer,
		ShoppingCart,
		ArrowUpRight,
		Cpu,
		Code2,
		Boxes,
		Library,
		Database,
		Wrench
	} from '@lucide/svelte';

	const categoryMeta: Record<string, { icon: any; label: string }> = {
		Runtime: { icon: Cpu, label: 'Runtime' },
		Language: { icon: Code2, label: 'Language' },
		Framework: { icon: Boxes, label: 'Framework' },
		Library: { icon: Library, label: 'Library' },
		Database: { icon: Database, label: 'Database' },
		DevOps: { icon: Wrench, label: 'DevOps' }
	};

	const techOrder = ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'];

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

	export let data;

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

	function stuckDetect(node: HTMLElement) {
		let raf = 0;
		const update = () => {
			raf = 0;
			node.classList.toggle('is-stuck', node.getBoundingClientRect().top <= 0);
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		update();
		return {
			destroy: () => {
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onScroll);
				if (raf) cancelAnimationFrame(raf);
			}
		};
	}
</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<PageContainer class="space-y-16 mt-12">
	<header
		class="space-y-5 text-slate-900 dark:text-slate-100 flex justify-center items-center flex-col"
	>
		<div class="w-56 md:w-64">
			<Logo />
		</div>
		<!-- <p class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
			Product-focused software engineer
		</p> -->
	</header>
	<main class="w-full space-y-16">
		<section class="space-y-6">
			<div class="flex items-baseline justify-between py-3">
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					About
				</h2>
			</div>
			<div class="space-y-4 text-slate-700 dark:text-slate-300">
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

		<section class="space-y-6">
			<div class="flex items-baseline justify-between py-3">
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Links
				</h2>
			</div>
			<LinksSection links={data.links} />
		</section>

		<section class="space-y-6">
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
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.work as work}
					<GridItem item={work} type="work" tech={data.tech} />
				{/each}
			</ul>
		</section>

		<section class="space-y-6">
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
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.projects as project}
					<GridItem item={project} type="project" {idHash} tech={data.tech} />
				{/each}
			</ul>
		</section>

		<section class="space-y-6">
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
			>
				<h2
					class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
				>
					Tech
				</h2>
			</div>
			<figure class="prof-chart flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 px-1 py-2">
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
							style="--bar-delay: {i * 80}ms; --bar-fill: {(count / profMax) * 100}%; grid-column: {i + 1}; grid-row: 2;"
						>
							<span
								class="prof-bar w-4 sm:w-6 rounded-sm"
								class:prof-bar--selected={isSelected}
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
							class="prof-hit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:focus-visible:ring-violet-400/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors duration-200"
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
			<div class="tech-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
				{#each techOrder as techType, cardIdx}
					{@const techItems = data.tech
						.filter((tech) => tech.type === techType)
						.slice()
						.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)}
					{@const meta = categoryMeta[techType]}
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
									class="tech-card-link flex items-center justify-between gap-3 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:text-emerald-700 dark:focus-visible:text-emerald-300 transition-colors duration-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400/60 dark:focus-visible:ring-offset-slate-950"
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
									<ArrowUpRight
										class="tech-card-arrow text-slate-400 dark:text-slate-500"
										size={12}
										strokeWidth={2.25}
										aria-hidden="true"
									/>
								</a>
							</header>

							<ul class="grid grid-cols-1 sm:grid-cols-2 gap-1 -mx-2 -mb-2">
								{#each techItems as tech, i}
									{@const techIcon = getTechIcon(tech.name)}
									{@const tileDimmed =
										selectedProf !== null && tech.proficiency !== selectedProf}
									<li class="contents">
										<a
											href="/tech/{tech.name}"
											title="{tech.name} · {tech.proficiency}"
											class="tech-tile group relative flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:focus-visible:ring-emerald-400/60"
											class:tile-dimmed={tileDimmed}
											style="--tile-delay: {i * 25}ms;"
										>
											<div
												class="tech-tile-icon shrink-0 text-slate-800 dark:text-slate-100"
											>
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
											<ArrowUpRight
												class="tech-tile-arrow shrink-0 text-slate-400 dark:text-slate-500"
												size={12}
												strokeWidth={2}
												aria-hidden="true"
											/>
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
	<footer class="mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ―
			Thomas A. Edison
		</div>
	</footer>
</PageContainer>

<style>
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
		.section-header::before,
		.section-title {
			transition: none;
		}
	}

	.prof-bar {
		display: block;
		height: var(--bar-fill, 0%);
		min-height: 2px;
		background-color: theme('colors.slate.300');
		transform-origin: center bottom;
		animation: prof-bar-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: var(--bar-delay, 0ms);
		transform: scaleY(0);
		transition: background-color 220ms ease;
	}

	:global(html.dark) .prof-bar {
		background-color: theme('colors.slate.700');
	}

	.prof-chart:hover .prof-bar,
	.prof-chart:focus-within .prof-bar {
		background-color: theme('colors.violet.500');
	}

	:global(html.dark) .prof-chart:hover .prof-bar,
	:global(html.dark) .prof-chart:focus-within .prof-bar {
		background-color: theme('colors.violet.400');
	}

	.prof-mean-line {
		height: 0;
		border-top: 1px dashed theme('colors.slate.300');
		opacity: 0.9;
	}

	:global(html.dark) .prof-mean-line {
		border-top-color: theme('colors.slate.700');
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
		background-color: theme('colors.violet.500') !important;
	}

	:global(html.dark) .prof-bar--selected {
		background-color: theme('colors.violet.400') !important;
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
			border-color: theme('colors.slate.300');
			background-color: rgb(255 255 255 / 0.7);
			box-shadow:
				0 1px 0 rgba(15, 23, 42, 0.02),
				0 10px 30px -18px rgba(15, 23, 42, 0.18);
		}

		:global(html.dark) .tech-group-card:hover,
		:global(html.dark) .tech-group-card:focus-within {
			border-color: theme('colors.slate.700');
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

	.tech-tile :global(.tech-tile-arrow) {
		opacity: 0;
		transform: translate(-2px, 2px);
		transition:
			opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
			color 200ms ease;
	}

	.tech-tile:hover :global(.tech-tile-arrow),
	.tech-tile:focus-visible :global(.tech-tile-arrow) {
		opacity: 1;
		transform: translate(0, 0);
	}

	/* Header link micro-interactions mirror GridItem's `details-btn`
	 * (underline-from-left + arrow translate) so tech cards read as
	 * the same family as work / project cards. */
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

	.tech-card-link :global(.tech-card-arrow) {
		transition:
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
			color 200ms ease;
	}

	.tech-card-link:hover :global(.tech-card-arrow),
	.tech-card-link:focus-visible :global(.tech-card-arrow) {
		transform: translate(2px, -2px);
	}

	.tech-card-icon {
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.tech-group-card:hover .tech-card-icon,
		.tech-group-card:focus-within .tech-card-icon {
			background-color: theme('colors.emerald.50');
			color: theme('colors.emerald.600');
		}

		:global(html.dark) .tech-group-card:hover .tech-card-icon,
		:global(html.dark) .tech-group-card:focus-within .tech-card-icon {
			background-color: rgb(16 185 129 / 0.1);
			color: theme('colors.emerald.400');
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
		.tech-card-link :global(.tech-card-arrow),
		.tech-card-icon,
		.tech-tile-name::after,
		.tech-tile :global(.tech-tile-arrow) {
			transition: none;
		}
		.tech-card-link:hover :global(.tech-card-arrow),
		.tech-card-link:focus-visible :global(.tech-card-arrow) {
			transform: none;
		}
		.tech-tile :global(.tech-tile-arrow) {
			opacity: 1;
			transform: none;
		}
	}
</style>
