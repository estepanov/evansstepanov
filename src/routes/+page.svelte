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
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
			>
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
			<div
				use:stuckDetect
				class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
			>
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
					{@const techItems = data.tech.filter((tech) => tech.type === techType)}
					{@const meta = categoryMeta[techType]}
					{#if techItems.length > 0}
						<article
							class="card tech-group-card group/card relative overflow-hidden"
							style="--card-delay: {cardIdx * 70}ms;"
						>
							<header
								class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-dashed border-slate-200/70 dark:border-slate-800/70"
							>
								<a
									href="/tech/#{techType.toLowerCase()}"
									class="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400/60 dark:focus-visible:ring-offset-slate-950"
								>
									<span
										class="tech-card-icon inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
									>
										<svelte:component this={meta.icon} size={15} strokeWidth={1.75} />
									</span>
									<span class="text-[11px] font-semibold tracking-[0.18em] uppercase">
										{meta.label}
									</span>
								</a>
							</header>

							<ul class="grid grid-cols-3 sm:grid-cols-4 gap-1 p-3">
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
												class="mt-1 flex gap-[3px]"
												aria-label="Proficiency: {tech.proficiency}"
											>
												{#each [1, 2, 3, 4] as i}
													<span
														class="tech-dot w-[3px] h-[3px] rounded-full {i <= level
															? 'bg-slate-600 dark:bg-slate-300'
															: 'bg-slate-300 dark:bg-slate-700'}"
														style="--dot-i: {i};"
													></span>
												{/each}
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

	/* Proficiency dots — gentle stagger pulse on card hover */
	.tech-group-card:hover .tech-dot {
		animation: dot-pulse 1.2s ease-out;
		animation-delay: calc(var(--dot-i, 0) * 60ms);
	}

	@keyframes dot-pulse {
		0%,
		100% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.6);
		}
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
		.tech-tile:hover .tech-tile-icon,
		.tech-group-card:hover .tech-dot {
			transform: none;
			animation: none;
			transition: none;
		}
	}
</style>
