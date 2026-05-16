<script lang="ts">
	import { getTechIcon } from '../../util/tech-icons';
	import TechIcon from '../../components/TechIcon.svelte';
	import { getColorFromWeight } from '../../util/statusColors';
	import ButtonContainer from '../../components/ButtonContainer.svelte';
	import AnchorButton from '../../components/AnchorButton.svelte';
	import { House } from '@lucide/svelte';
	import PageContainer from '../../components/PageContainer.svelte';
	import LogoIcon from '../../components/LogoIcon.svelte';

	export let data;

	const { tech } = data;
	const categories = ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'];
</script>

<svelte:head>
	<title>Tech Stack - Evans Stepanov</title>
	<meta name="description" content="Explore the technologies and tools I work with." />
</svelte:head>

<PageContainer class="space-y-12 mt-10">
	<header class="w-full flex items-center gap-4">
		<a
			href="/"
			aria-label="Evans Stepanov - back to home"
			class="group inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-slate-900 transition-colors hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-slate-100 dark:hover:text-emerald-400"
		>
			<LogoIcon />
		</a>
		<nav
			aria-label="Breadcrumb"
			class="min-w-0 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
		>
			<span class="text-slate-700 dark:text-slate-300">Tech</span>
		</nav>
	</header>
	<main class="w-full space-y-16">
		<header class="space-y-3 max-w-2xl">
			<p
				class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400"
			>
				Tech Stack
			</p>
			<h1
				class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
			>
				Tools and technologies I build with
			</h1>
			<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
				Organized by category. Select any item to see related work and projects.
			</p>
		</header>

		{#each categories as techType}
			{@const techItems = tech.filter((t) => t.type === techType)}
			{#if techItems.length > 0}
				<section id={techType.toLowerCase()} class="scroll-mt-24">
					<div
						class="flex items-baseline justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800"
					>
						<h2
							class="text-sm font-semibold tracking-[0.15em] uppercase text-slate-700 dark:text-slate-300"
						>
							{techType}
						</h2>
						<span class="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
							{techItems.length}
						</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{#each techItems as techItem}
							{@const techIcon = getTechIcon(techItem.name)}
							{@const proficiencyColor = getColorFromWeight(techItem.proficiency)}
							<a
								href="/tech/{techItem.name}"
								class="card card--interactive group relative flex gap-4 p-5"
							>
								{#if techIcon}
									<span
										class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
									>
										<TechIcon icon={techIcon} size={22} />
									</span>
								{/if}
								<div class="flex flex-col min-w-0 flex-1">
									<div class="flex items-center justify-between gap-2 mb-1">
										<h3 class="font-semibold text-slate-900 dark:text-slate-100 truncate">
											{techItem.name}
										</h3>
										<span
											class="flex-shrink-0 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border bg-transparent {proficiencyColor}"
										>
											{techItem.proficiency}
										</span>
									</div>
									{#if techItem.description}
										<p
											class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2"
										>
											{techItem.description}
										</p>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		{/each}

		<ButtonContainer>
			<AnchorButton href="/">
				<House />
				Back to Home
			</AnchorButton>
		</ButtonContainer>
	</main>
</PageContainer>
