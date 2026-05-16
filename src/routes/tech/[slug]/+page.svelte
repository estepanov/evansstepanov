<script lang="ts">
	import { getTechIcon } from '../../../util/tech-icons';
	import GridItem from '../../../components/GridItem.svelte';
	import ButtonContainer from '../../../components/ButtonContainer.svelte';
	import AnchorButton from '../../../components/AnchorButton.svelte';
	import TechIcon from '../../../components/TechIcon.svelte';
	import TechBackdrop from '../../../components/TechBackdrop.svelte';
	import LogoIcon from '../../../components/LogoIcon.svelte';
	import { House, Table, ArrowUpRight } from '@lucide/svelte';
	import PageContainer from '../../../components/PageContainer.svelte';

	export let data;

	const { tech, allTech, relatedProjects, relatedWork } = data;
	const techIcon = getTechIcon(tech.name);

	const proficiencyLevel: Record<string, number> = {
		Beginner: 1,
		Intermediate: 2,
		Advanced: 3,
		Expert: 4
	};
	const level = proficiencyLevel[tech.proficiency] ?? 0;

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
	<title>{tech.name} - Evans Stepanov</title>
	<meta
		name="description"
		content={tech.description || `Learn about ${tech.name} and my experience with it.`}
	/>
</svelte:head>

<PageContainer class="mt-12 space-y-16">
	<header class="w-full flex items-center gap-4">
		<a
			href="/"
			aria-label="Evans Stepanov — back to home"
			class="group inline-flex items-center justify-center h-10 w-10 flex-shrink-0 text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
		>
			<LogoIcon />
		</a>
		<nav
			class="text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2 min-w-0"
		>
			<a href="/tech" class="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
				>Tech</a
			>
			<span class="text-slate-300 dark:text-slate-700">/</span>
			<span class="truncate text-slate-700 dark:text-slate-300">{tech.name}</span>
		</nav>
	</header>

	<main class="w-full space-y-20">
		<section
			class="tech-hero relative w-full rounded-2xl border border-slate-500/20 dark:border-slate-800/80 overflow-hidden"
		>
			<TechBackdrop tags={[tech.name]} rows={6} cols={8} size={48} />
			<div class="relative z-10 px-6 md:px-10 py-10 md:py-14 flex flex-col gap-8">
				<div class="flex items-center justify-between gap-4">
					{#if tech.type}
						<span
							class="text-[10px] font-semibold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400"
						>
							{tech.type}
						</span>
					{/if}
					{#if tech.url}
						<a
							href={tech.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group"
						>
							<span
								class="underline underline-offset-4 decoration-emerald-600/30 group-hover:decoration-emerald-600"
							>
								Learn more
							</span>
							<ArrowUpRight
								class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</a>
					{/if}
				</div>

				<div class="flex items-start gap-5 md:gap-7">
					{#if techIcon}
						<span
							class="hero-icon flex-shrink-0 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-sm"
						>
							<TechIcon icon={techIcon} size={44} />
						</span>
					{/if}
					<div class="min-w-0 flex-1">
						<h1
							class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.05]"
						>
							{tech.name}
						</h1>
						<div class="mt-4 flex items-center gap-3 flex-wrap">
							<span
								class="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400"
							>
								Proficiency
							</span>
							<span class="flex items-center gap-1.5" aria-label="Proficiency: {tech.proficiency}">
								{#each [1, 2, 3, 4] as i}
									<span
										class="w-1.5 h-1.5 rounded-full {i <= level
											? 'bg-purple-700 dark:bg-purple-400'
											: 'bg-slate-300 dark:bg-slate-700'}"
									></span>
								{/each}
							</span>
							<span class="text-xs font-medium text-slate-700 dark:text-slate-300">
								{tech.proficiency}
							</span>
						</div>
					</div>
				</div>

				{#if tech.description}
					<p
						class="max-w-2xl text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
					>
						{tech.description}
					</p>
				{/if}
			</div>
		</section>

		{#if relatedWork.length > 0}
			<section class="space-y-6">
				<div
					use:stuckDetect
					class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
				>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Related Work
					</h2>
				</div>
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedWork as work}
						<GridItem item={work} type="work" tech={allTech} />
					{/each}
				</ul>
			</section>
		{/if}

		{#if relatedProjects.length > 0}
			<section class="space-y-6">
				<div
					use:stuckDetect
					class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
				>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Related Projects
					</h2>
				</div>
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedProjects as project}
						<GridItem item={project} type="project" tech={allTech} />
					{/each}
				</ul>
			</section>
		{/if}
	</main>

	<div class="w-full mt-10 mb-20">
		<ButtonContainer>
			<AnchorButton href="/">
				<House />
				Back to Home
			</AnchorButton>
			<AnchorButton href="/tech">
				<Table />
				View all Tech
			</AnchorButton>
		</ButtonContainer>
	</div>
</PageContainer>

<style>
	.tech-hero {
		isolation: isolate;
		background:
			radial-gradient(120% 80% at 100% 0%, rgba(168, 85, 247, 0.06) 0%, transparent 55%),
			radial-gradient(90% 70% at 0% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 60%);
		opacity: 0;
		transform: translateY(8px);
		animation: hero-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		transition:
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .tech-hero {
		background:
			radial-gradient(120% 80% at 100% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 55%),
			radial-gradient(90% 70% at 0% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 60%);
	}

	.tech-hero:hover {
		transform: translateY(-2px);
		box-shadow:
			0 1px 0 rgba(15, 23, 42, 0.02),
			0 24px 48px -28px rgba(15, 23, 42, 0.25);
	}

	:global(html.dark) .tech-hero:hover {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.02),
			0 24px 48px -28px rgba(0, 0, 0, 0.7);
	}

	.hero-icon {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.tech-hero:hover .hero-icon {
		transform: translateY(-2px) rotate(-3deg);
	}

	@keyframes hero-in {
		to {
			opacity: 1;
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
		.tech-hero,
		.hero-icon,
		.section-header::before,
		.section-title {
			transition: none;
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
