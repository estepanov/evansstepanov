<script lang="ts">
	import GridItem from '../../../components/GridItem.svelte';
	import ButtonContainer from '../../../components/ButtonContainer.svelte';
	import AnchorButton from '../../../components/AnchorButton.svelte';
	import TopicHero from '../../../components/TopicHero.svelte';
	import TechHeader from '../../../components/TechHeader.svelte';
	import DetailsModal from '../../../components/DetailsModal.svelte';
	import StickySectionHeader from '../../../components/StickySectionHeader.svelte';
	import PageContainer from '../../../components/PageContainer.svelte';
	import { formatDateRange } from '../../../util/dates';
	import type { Work } from '../../../data/work';
	import { House, Table, ArrowUpRight } from '@lucide/svelte';

	export let data;

	const { company, allTech, relatedProjects } = data;

	let openRole: Work | null = null;

	const tenure = formatDateRange(company.startDate, company.endDate, company.isCurrent);
</script>

<svelte:head>
	<title>{company.companyName} - Evans Stepanov</title>
	<meta
		name="description"
		content={company.summary || `Work experience at ${company.companyName}.`}
	/>
</svelte:head>

<PageContainer class="mt-10 space-y-16">
	<TechHeader rootLabel="Work" rootHref="/work" leaf={company.companyName} />

	<main class="w-full">
		<TopicHero tags={company.techTags}>
			<div class="flex items-center justify-between gap-4">
				<span
					class="text-[10px] font-semibold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400"
				>
					Company
				</span>
				{#if company.url}
					<a
						href={company.url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group"
					>
						<span
							class="underline underline-offset-4 decoration-emerald-600/30 group-hover:decoration-emerald-600"
						>
							Visit
						</span>
						<ArrowUpRight
							class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</a>
				{/if}
			</div>

			<div class="min-w-0">
				<h1
					class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.05]"
				>
					{company.companyName}
				</h1>
				{#if tenure}
					<p
						class="mt-4 text-[11px] md:text-xs font-semibold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400 tabular-nums"
					>
						{tenure}
					</p>
				{/if}
			</div>

			{#if company.summary}
				<p
					class="max-w-2xl text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
				>
					{company.summary}
				</p>
			{/if}
		</TopicHero>

		{#if company.roles.length > 0}
			<section class="pb-20">
				<StickySectionHeader>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Roles
					</h2>
				</StickySectionHeader>
				<ul class="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
					{#each company.roles as role}
						{@const range = formatDateRange(role.startDate, role.endDate, role.isCurrent)}
						<li class="py-6 first:pt-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
							<div class="min-w-0 flex-1 space-y-2">
								<h3
									class="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
								>
									{role.title}
								</h3>
								{#if range}
									<p
										class="text-sm text-slate-500 dark:text-slate-400 tabular-nums tracking-wide"
									>
										{range}
									</p>
								{/if}
								{#if role.description}
									<p
										class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2"
									>
										{role.description}
									</p>
								{/if}
							</div>
							<button
								type="button"
								on:click={() => (openRole = role)}
								aria-haspopup="dialog"
								aria-expanded={openRole === role}
								class="shrink-0 self-start text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline-offset-2 transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-xs"
							>
								Details
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if company.techTags.length > 0}
			<section class="pb-20">
				<StickySectionHeader>
					<h2
						class="section-title text-2xl font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-300"
					>
						Tech
					</h2>
				</StickySectionHeader>
				<ul class="mt-6 flex flex-wrap gap-2">
					{#each company.techTags as tag}
						<li>
							<a
								href="/tech/{tag}"
								class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-lg hover:border-emerald-500/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
							>
								{tag}
							</a>
						</li>
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
			<AnchorButton href="/work">
				<Table />
				View all Work
			</AnchorButton>
		</ButtonContainer>
	</div>
</PageContainer>

<DetailsModal
	open={openRole !== null}
	item={openRole}
	type="work"
	tech={allTech}
	onClose={() => (openRole = null)}
/>
