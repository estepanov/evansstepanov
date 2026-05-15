<script lang="ts">
	import { getTechIcon } from '../../../util/tech-icons';
	import { getColorFromWeight } from '../../../util/statusColors';
	import Section from '../../../components/Section.svelte';
	import GridItem from '../../../components/GridItem.svelte';
	import ButtonContainer from '../../../components/ButtonContainer.svelte';
	import AnchorButton from '../../../components/AnchorButton.svelte';
	import TechIcon from '../../../components/TechIcon.svelte';
	import TechBackdrop from '../../../components/TechBackdrop.svelte';
	import { House, Table } from '@lucide/svelte';
	import PageContainer from '../../../components/PageContainer.svelte';

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

<PageContainer>
	<main class="w-full space-y-12">
		<Section>
			<svelte:fragment slot="title">
				<div
					class="flex md:flex-row flex-col items-start md:items-center justify-start md:justify-between w-full gap-2 md:gap-0"
				>
					<h1 class="font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase">
						{tech.name}
					</h1>
					<div class="flex flex-row items-center gap-x-2">
						<span
							class="px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full border {proficiencyStyle}"
						>
							{tech.proficiency}
						</span>
						Proficiency
					</div>
				</div>
			</svelte:fragment>
			<div class="flex flex-col space-y-6">
				<div
					class="tech-hero relative isolate p-6 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-700/50 flex flex-row"
				>
					<TechBackdrop tags={[tech.name]} size={48} rows={5} cols={14} />
					{#if techIcon}
						<div class="relative z-[1] text-6xl text-gray-700 dark:text-gray-300 mr-4">
							<TechIcon icon={techIcon} size={60} />
						</div>
					{/if}
					<div class="relative z-[1]">
						{#if tech.description}
							<p class="text-gray-600 dark:text-gray-400 leading-relaxed">{tech.description}</p>
						{/if}
						{#if tech.url}
							<div>
								<a
									href={tech.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-block underline hover:no-underline text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors duration-200 ease-in-out"
								>
									Learn more about {tech.name}
									<svg
										class="inline-block ml-1 w-4 h-4 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										></path>
									</svg>
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</Section>

		{#if relatedWork.length > 0}
			<Section title="Related Work Experience">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedWork as work}
						<GridItem item={work} type="work" />
					{/each}
				</ul>
			</Section>
		{/if}

		{#if relatedProjects.length > 0}
			<Section title="Related Projects">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 relative">
					{#each relatedProjects as project}
						<GridItem item={project} type="project" />
					{/each}
				</ul>
			</Section>
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
		--tech-shift: 0px;
		transition: background-color 300ms ease;
	}
	.tech-hero:hover,
	.tech-hero:focus-within {
		--tech-shift: 22px;
	}
	@media (prefers-reduced-motion: reduce) {
		.tech-hero:hover,
		.tech-hero:focus-within {
			--tech-shift: 0px;
		}
	}
</style>
