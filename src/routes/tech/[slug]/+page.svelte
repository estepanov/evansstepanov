<script lang="ts">
	import { getTechIcon } from '../../../util/tech-icons';
	import ProjectCard from '../../../components/domain/work/ProjectCard.svelte';
	import WorkExperienceCard from '../../../components/domain/work/WorkExperienceCard.svelte';
	import ButtonContainer from '../../../components/actions/ButtonContainer.svelte';
	import AnchorButton from '../../../components/actions/AnchorButton.svelte';
	import TechIcon from '../../../components/domain/tech/TechIcon.svelte';
	import TopicHero from '../../../components/domain/tech/TopicHero.svelte';
	import TechHeader from '../../../components/domain/tech/TechHeader.svelte';
	import { House, Table, ArrowUpRight } from '@lucide/svelte';
	import PageContainer from '../../../components/layout/PageContainer.svelte';
	import StickySectionHeader from '../../../components/layout/StickySectionHeader.svelte';

	export let data;

	const { tech, allTech, relatedProjects, relatedWork } = data;
	const techIcon = getTechIcon(tech.name);

	const proficiencyTone: Record<string, string> = {
		Beginner: 'text-slate-500 dark:text-slate-400',
		Intermediate: 'text-purple-600 dark:text-purple-400',
		Advanced: 'text-purple-700 dark:text-purple-300',
		Expert: 'text-purple-800 dark:text-purple-200'
	};
</script>

<svelte:head>
	<title>{tech.name} - Evans Stepanov</title>
	<meta
		name="description"
		content={tech.description || `Learn about ${tech.name} and my experience with it.`}
	/>
</svelte:head>

<PageContainer class="mt-10 space-y-16">
	<TechHeader leaf={tech.name} />

	<main class="w-full">
		<TopicHero tags={[tech.name]}>
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
						class="hero-icon shrink-0 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 shadow-xs backdrop-blur-sm"
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
							class="text-[10px] font-semibold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400"
						>
							Proficiency
						</span>
						<span class="inline-block h-3 w-px bg-slate-300 dark:bg-slate-700" aria-hidden="true"
						></span>
						<span
							class="text-[11px] md:text-xs font-semibold tracking-[0.22em] uppercase {proficiencyTone[
								tech.proficiency
							]}"
							aria-label="Proficiency: {tech.proficiency}"
						>
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
		</TopicHero>

		{#if relatedWork.length > 0}
			<section class={relatedProjects.length > 0 ? 'pb-20' : ''}>
				<StickySectionHeader>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Related Work
					</h2>
				</StickySectionHeader>
				<ul class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedWork as work}
						<WorkExperienceCard item={work} />
					{/each}
				</ul>
			</section>
		{/if}

		{#if relatedProjects.length > 0}
			<section>
				<StickySectionHeader>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Related Projects
					</h2>
				</StickySectionHeader>
				<ul class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedProjects as project}
						<ProjectCard item={project} tech={allTech} />
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
