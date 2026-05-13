<script lang="ts">
	import { getTechIcon } from '../../util/tech-icons';
	import TechIcon from '../../components/TechIcon.svelte';
	import { getColorFromWeight } from '../../util/statusColors';
	import Section from '../../components/Section.svelte';
	import ButtonContainer from '../../components/ButtonContainer.svelte';
	import AnchorButton from '../../components/AnchorButton.svelte';
	import { House } from '@lucide/svelte';
	import PageContainer from '../../components/PageContainer.svelte';

	export let data;

	const { tech } = data;
</script>

<svelte:head>
	<title>Tech Stack - Evans Stepanov</title>
	<meta name="description" content="Explore the technologies and tools I work with." />
</svelte:head>

<PageContainer class="space-y-20 mt-20">
	<main class="w-full space-y-12">
		<Section title="Tech Stack">
			<p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
				Here are the technologies and tools I work with, organized by category. Choose any item to
				learn more about my experience with it.
			</p>

			{#each ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'] as techType}
				{@const techItems = tech.filter((tech) => tech.type === techType)}
				{#if techItems.length > 0}
					<div id={techType.toLowerCase()} class="space-y-4 mb-8 scroll-mt-24">
						<h3 class="font-bold text-xl opacity-80">{techType}</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each techItems as techItem}
								{@const techIcon = getTechIcon(techItem.name)}
								{@const proficiencyColor = getColorFromWeight(techItem.proficiency)}
								<a href="/tech/{techItem.name}" class="block">
									<div
										class="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
									>
										<div class="flex items-center space-x-3">
											{#if techIcon}
												<div class="text-2xl text-gray-700 dark:text-gray-300">
													<TechIcon icon={techIcon} size={24} />
												</div>
											{/if}
											<div class="flex flex-col items-start">
												<h4 class="font-semibold text-gray-900 dark:text-white leading-tight">{techItem.name}</h4>
												<div class="text-xs font-bold {proficiencyColor}">
													{techItem.proficiency}
												</div>
											</div>
										</div>
										{#if techItem.description}
											<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
												{techItem.description}
											</p>
										{/if}
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</Section>

		<ButtonContainer>
			<AnchorButton href="/">
				<House />
				Back to Home
			</AnchorButton>
		</ButtonContainer>
	</main>
</PageContainer>
