<script lang="ts">
	import { getTechIcon } from '../../../util/tech-icons';
	import { getColorFromWeight } from '../../../util/statusColors';
	import Link from '../../../components/Link.svelte';
	import Section from '../../../components/Section.svelte';
	import SpecialBadge from '../../../components/SpecialBadge.svelte';
	import { getFormattedDate } from '../../../util/dates';
	import { GithubIcon } from '@lucide/svelte';

	export let data;

	const { tech, relatedProjects, relatedWork } = data;
	const TechIcon = getTechIcon(tech.name);
	const proficiencyStyle = getColorFromWeight(tech.proficiency);
</script>

<svelte:head>
	<title>{tech.name} - Evans Stepanov</title>
	<meta
		name="description"
		content={tech.description || `Learn about ${tech.name} and my experience with it.`}
	/>
</svelte:head>

<div class="flex justify-center items-center p-5 flex-col space-y-20 max-w-screen-md mx-auto mt-20">
	<main class="w-full space-y-12">
		<Section>
			<svelte:fragment slot="title">
				<div
					class="flex md:flex-row flex-col items-start md:items-center justify-start md:justify-between w-full gap-2 md:gap-0"
				>
					<h2 class="font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase">
						{tech.name}
					</h2>
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
					class="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 flex flex-row"
				>
					{#if TechIcon}
						<div class="text-6xl text-gray-700 dark:text-gray-300 mr-4">
							<svelte:component this={TechIcon} size={80} />
						</div>
					{/if}
					<div class="flex flex-col">
						{#if tech.description}
							<p class="text-gray-600 dark:text-gray-400 leading-relaxed">{tech.description}</p>
						{/if}
						{#if tech.url}
							<a
								href={tech.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex underline hover:no-underline items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors duration-200 ease-in-out"
							>
								Learn more about {tech.name}
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									></path>
								</svg>
							</a>
						{/if}
					</div>
				</div>
			</div>
		</Section>

		<div class="text-center">
			<Link href="/">
				<span
					class="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
				>
					← Back to Home
				</span>
			</Link>
		</div>

		<!-- Related Work Section -->
		{#if relatedWork.length > 0}
			<Section title="Related Work Experience">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
					{#each relatedWork as work}
						<li
							class={`transition-all ease-in p-6 rounded-xl flex flex-col ${
								work.isCurrent
									? `project-active-border`
									: `border border-slate-500/20 dark:border-slate-300/10`
							}`}
						>
							<h3 class="relative mb-4">
								<span class="w-full block font-bold">
									{work.title}
								</span>
								{#if work.url}
									<a
										target="_blank"
										rel="noopener"
										referrerpolicy="no-referrer"
										href={work.url}
										class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in opacity-70"
										>{work.companyName}</a
									>
								{:else}
									<span class="font-normal text-gray-700 dark:text-gray-300 opacity-70"
										>{work.companyName}</span
									>
								{/if}
							</h3>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
							<div class="flex flex-grow"></div>
							<ul
								class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500 items-center"
							>
								{#if work.startDate}
									<li class="opacity-80">
										{getFormattedDate(work.startDate)}
										{#if work.endDate}
											<span class="mx-1">-</span>
											{getFormattedDate(work.endDate)}
										{/if}
									</li>
								{/if}
							</ul>
							{#if work.isCurrent}
								<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full">
									<SpecialBadge className="-ml-2">Current</SpecialBadge>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</Section>
		{/if}

		<!-- Related Projects Section -->
		{#if relatedProjects.length > 0}
			<Section title="Related Projects">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
					{#each relatedProjects as project}
						<li
							class={`relative transition-all ease-in-out p-6 rounded-xl flex flex-col ${
								project.isActive
									? `project-active-border`
									: `border border-slate-500/20 dark:border-slate-300/10`
							}`}
						>
							<div class="flex flex-row items-center mb-4 relative">
								<h3 class="font-bold flex justify-center items-center">
									{#if project.url}
										<a
											target="_blank"
											rel="noopener"
											referrerpolicy="no-referrer"
											href={project.url}
											class="text-gray-700 dark:text-gray-200 line-clamp-1 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
											>{project.name}</a
										>
									{:else}
										<span class="text-gray-700 dark:text-gray-200 line-clamp-1">{project.name}</span
										>
									{/if}
								</h3>
							</div>
							<p class="leading-tight dark:text-gray-200 text-gray-600 line-clamp-4">
								{project.description}
							</p>
							<div class="flex flex-grow"></div>
							<ul
								class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-700 items-center"
							>
								{#if project.startDate}
									<li class="opacity-80">
										{getFormattedDate(project.startDate)}
									</li>
								{/if}
								{#if project.source}
									<li class="special">
										<a
											target="_blank"
											rel="noopener"
											referrerpolicy="no-referrer"
											href={project.source}
											class="hover:underline-offset-4 capitalize flex flex-row justify-center items-center opacity-80 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>
											{#if project.source?.includes('github.com')}
												<GithubIcon class="h-3 w-3 mr-1" />
											{/if}
											{new URL(project.source).hostname.split('.')[0]}
										</a>
									</li>
								{/if}
							</ul>

							{#if project.isActive}
								<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full">
									<SpecialBadge className="-ml-2">Active</SpecialBadge>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</Section>
		{/if}
	</main>
</div>

<style>
	@property --bg-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	@keyframes spinnner {
		to {
			--bg-angle: 360deg;
		}
	}

	.project-active-border {
		position: relative;
		background: transparent;
		z-index: 0;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.project-active-border::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;
		border-radius: inherit;
		border: 1px solid transparent;
		background:
			linear-gradient(
					to bottom,
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9'),
					theme('colors.emerald.500 / 0.1')
				)
				padding-box,
			conic-gradient(
					from var(--bg-angle),
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9')
				)
				border-box;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: spinnner 20s linear infinite;
	}

	@media (prefers-color-scheme: dark) {
		.project-active-border::before {
			background:
				linear-gradient(
						to bottom,
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9'),
						theme('colors.emerald.500 / 0.1')
					)
					padding-box,
				conic-gradient(
						from var(--bg-angle),
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9')
					)
					border-box;
			animation: spinnner 20s linear infinite;
		}
	}
</style>
