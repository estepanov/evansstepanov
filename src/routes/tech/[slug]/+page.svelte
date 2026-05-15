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
	<SiteHeader eyebrow={tech.type || 'Tech Stack'} title={tech.name} />
	<main class="w-full space-y-16">
		<section class="space-y-4 max-w-2xl">
			<div class="flex items-center gap-3">
				{#if techIcon}
					<span class="text-slate-700 dark:text-slate-200 inline-flex">
						<TechIcon icon={techIcon} size={28} />
					</span>
				{/if}
				<span
					class="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border bg-transparent {proficiencyStyle}"
				>
					{tech.proficiency}
				</span>
				{#if tech.url}
					<a
						href={tech.url}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group"
					>
						<span class="underline underline-offset-4 decoration-emerald-600/30 group-hover:decoration-emerald-600">
							Learn more
						</span>
						<ArrowUpRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				{/if}
			</div>

			{#if tech.description}
				<p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
					{tech.description}
				</p>
			{/if}
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

