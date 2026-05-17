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

	const proficiencyAbbrev: Record<string, string> = {
		Beginner: 'Beg',
		Intermediate: 'Int',
		Advanced: 'Adv',
		Expert: 'Exp'
	};

	const proficiencyTone: Record<string, string> = {
		Beginner: 'text-slate-400 dark:text-slate-500',
		Intermediate: 'text-purple-600 dark:text-purple-400',
		Advanced: 'text-purple-700 dark:text-purple-300',
		Expert: 'text-purple-800 dark:text-purple-200'
	};
	import { SiReact, SiTypescript } from '@icons-pack/svelte-simple-icons';
	import LinksSection from '../components/links/LinksSection.svelte';
	import GridItem from '../components/GridItem.svelte';
	import ProfileDiamond from '../components/ProfileDiamond.svelte';
	import PageContainer from '../components/PageContainer.svelte';

	export let data;

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

							<ul class="grid grid-cols-3 sm:grid-cols-4 gap-1 -mx-2 -mb-2">
								{#each techItems as tech, i}
									{@const techIcon = getTechIcon(tech.name)}
									{@const level = proficiencyLevel[tech.proficiency] ?? 0}
									<li class="contents">
										<a
											href="/tech/{tech.name}"
											title="{tech.name} · {tech.proficiency}"
											class="tech-tile group relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:focus-visible:ring-emerald-400/60"
											style="--tile-delay: {i * 25}ms;"
										>
											<span
												class="absolute top-1.5 right-1.5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
											>
												<ArrowUpRight size={11} strokeWidth={2} />
											</span>
											<div class="tech-tile-icon text-slate-800 dark:text-slate-100">
												{#if techIcon}
													<TechIcon icon={techIcon} size={30} />
												{:else}
													<div
														class="w-[30px] h-[30px] rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400"
													>
														{tech.name.charAt(0)}
													</div>
												{/if}
											</div>
											<span
												class="mt-1.5 text-[10.5px] font-medium text-slate-600 dark:text-slate-400 text-center line-clamp-1 w-full leading-tight"
											>
												{tech.name}
											</span>
											<span
												class="tech-prof mt-1 inline-flex items-center gap-1.5 leading-none {proficiencyTone[tech.proficiency]}"
												aria-label="Proficiency: {tech.proficiency}"
											>
												<span class="tech-prof-rule" aria-hidden="true"></span>
												<span class="text-[8.5px] font-bold tracking-[0.2em] uppercase">
													{proficiencyAbbrev[tech.proficiency]}
												</span>
											</span>
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
		transform: translateY(-2px) scale(1.06);
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
		.tech-card-icon {
			transition: none;
		}
		.tech-card-link:hover :global(.tech-card-arrow),
		.tech-card-link:focus-visible :global(.tech-card-arrow) {
			transform: none;
		}
	}
</style>
