<script lang="ts">
	import { getTechIcon } from '../../util/tech-icons';
	import { getColorFromWeight } from '../../util/statusColors';
	import Link from '../../components/Link.svelte';
	import Section from '../../components/Section.svelte';

	export let data;

	const { tech } = data;
</script>

<svelte:head>
	<title>Tech Stack - Evans Stepanov</title>
	<meta name="description" content="Explore the technologies and tools I work with." />
</svelte:head>

<div class="flex justify-center items-center p-5 flex-col space-y-20 max-w-screen-md mx-auto mt-20">
	<main class="w-full space-y-12">
		<Section title="Tech Stack">
			<p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
				Here are the technologies and tools I work with, organized by category. Choose any item to learn more about my experience with it.
			</p>
			
			{#each ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'] as techType}
				{@const techItems = tech.filter(tech => tech.type === techType)}
				{#if techItems.length > 0}
					<div class="space-y-4 mb-8">
						<h3 class="font-bold text-xl opacity-80">{techType}</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each techItems as techItem}
								{@const TechIcon = getTechIcon(techItem.name)}
								{@const proficiencyColor = getColorFromWeight(techItem.proficiency)}
								<a href="/tech/{techItem.name}" class="block">
									<div class="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200">
										<div class="flex items-center space-x-3 mb-2">
											{#if TechIcon}
												<div class="text-2xl text-gray-700 dark:text-gray-300">
													<svelte:component this={TechIcon} size={24} />
												</div>
											{/if}
											<h4 class="font-semibold text-gray-900 dark:text-white">{techItem.name}</h4>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-sm text-gray-600 dark:text-gray-400">Proficiency:</span>
											<div class="px-2 py-1 text-xs font-bold rounded-full {proficiencyColor}">
												{techItem.proficiency}
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

		<div class="text-center">
			<Link href="/">
				<span class="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
					← Back to Home
				</span>
			</Link>
		</div>
	</main>
</div>
