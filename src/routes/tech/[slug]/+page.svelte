<script lang="ts">
	import { getTechIcon } from '../../../util/tech-icons';
	import { getColorFromWeight } from '../../../util/statusColors';
	import GridItem from '../../../components/GridItem.svelte';
	import ButtonContainer from '../../../components/ButtonContainer.svelte';
	import AnchorButton from '../../../components/AnchorButton.svelte';
	import TechIcon from '../../../components/TechIcon.svelte';
	import { House, Table, ArrowUpRight } from '@lucide/svelte';
	import PageContainer from '../../../components/PageContainer.svelte';
	import SiteHeader from '../../../components/SiteHeader.svelte';

	export let data;

	const { tech, relatedProjects, relatedWork } = data;
	const techIcon = getTechIcon(tech.name);
	const proficiencyStyle = getColorFromWeight(tech.proficiency);
</script>

<svelte:head>
	<title>{tech.name} - Evans Stepanov</title>
	<meta
		name="description"
		content={tech.description || `Learn about ${tech.name} and my experience with it.`}
	/>
</svelte:head>

<PageContainer class="mt-12">
	<SiteHeader eyebrow="Tech Stack" title={tech.name} />
	<main class="w-full space-y-16">
		<section class="tech-hero relative isolate overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/40 dark:bg-slate-900/30 px-6 py-10 md:px-10 md:py-14">
			{#if techIcon}
				<div class="watermark" aria-hidden="true">
					<TechIcon icon={techIcon} size={320} />
				</div>
			{/if}

			<div class="relative z-[1] space-y-6 max-w-2xl">
				{#if tech.type}
					<p class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
						{tech.type}
					</p>
				{/if}

				<h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
					{tech.name}
				</h1>

				<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
					<span
						class="text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border bg-transparent {proficiencyStyle}"
					>
						{tech.proficiency}
					</span>
					<span class="tracking-wide">proficiency</span>
				</div>

				{#if tech.description}
					<p class="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
						{tech.description}
					</p>
				{/if}

				{#if tech.url}
					<div>
						<a
							href={tech.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group"
						>
							<span class="underline underline-offset-4 decoration-emerald-600/30 group-hover:decoration-emerald-600">
								Learn more about {tech.name}
							</span>
							<ArrowUpRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</a>
					</div>
				{/if}
			</div>
		</section>

		{#if relatedWork.length > 0}
			<section class="space-y-6">
				<div class="flex items-baseline justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
					<h2 class="text-sm font-semibold tracking-[0.15em] uppercase text-slate-700 dark:text-slate-300">
						Related Work
					</h2>
					<span class="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
						{relatedWork.length}
					</span>
				</div>
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedWork as work}
						<GridItem item={work} type="work" />
					{/each}
				</ul>
			</section>
		{/if}

		{#if relatedProjects.length > 0}
			<section class="space-y-6">
				<div class="flex items-baseline justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
					<h2 class="text-sm font-semibold tracking-[0.15em] uppercase text-slate-700 dark:text-slate-300">
						Related Projects
					</h2>
					<span class="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
						{relatedProjects.length}
					</span>
				</div>
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedProjects as project}
						<GridItem item={project} type="project" />
					{/each}
				</ul>
			</section>
		{/if}
	</main>

	<div class="w-full my-20">
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
		transition:
			background-color 300ms ease,
			border-color 300ms ease;
	}

	.watermark {
		position: absolute;
		top: 50%;
		right: -2rem;
		transform: translateY(-50%);
		z-index: 0;
		pointer-events: none;
		color: theme('colors.slate.900');
		opacity: 0.06;
		transition: opacity 400ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(html.dark) .watermark {
		color: theme('colors.slate.100');
		opacity: 0.08;
	}
	.tech-hero:hover .watermark {
		opacity: 0.1;
		transform: translateY(-50%) scale(1.03);
	}
	:global(html.dark) .tech-hero:hover .watermark {
		opacity: 0.12;
	}

	@media (max-width: 640px) {
		.watermark :global(svg) {
			width: 200px;
			height: 200px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.watermark {
			transition: none;
		}
		.tech-hero:hover .watermark {
			transform: translateY(-50%);
		}
	}
</style>
