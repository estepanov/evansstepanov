<script lang="ts">
	import ButtonContainer from '../../components/ButtonContainer.svelte';
	import AnchorButton from '../../components/AnchorButton.svelte';
	import { House } from '@lucide/svelte';
	import PageContainer from '../../components/PageContainer.svelte';
	import TechHeader from '../../components/TechHeader.svelte';
	import StatusIndicator from '../../components/StatusIndicator.svelte';
	import { getFormattedDate } from '../../util/dates';

	export let data;

	const { companies } = data;

	function formatRange(startDate?: Date, endDate?: Date, isCurrent?: boolean): string | null {
		if (!startDate) return null;
		const start = getFormattedDate(new Date(startDate));
		if (isCurrent) return `${start} — Present`;
		if (endDate) return `${start} — ${getFormattedDate(new Date(endDate))}`;
		return start;
	}
</script>

<PageContainer class="space-y-12 mt-10">
	<TechHeader rootLabel="Work" rootHref="/work" />
	<main class="w-full space-y-16">
		<header class="space-y-3 max-w-2xl">
			<p
				class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400"
			>
				Experience
			</p>
			<h1
				class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
			>
				Where I’ve built and led
			</h1>
			<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
				Roles and companies, newest first. Open any entry for the full story.
			</p>
		</header>

		<ol class="relative border-l border-slate-200 dark:border-slate-800 ml-2 pl-8">
			{#each companies as company}
				{@const range = formatRange(company.startDate, company.endDate, company.isCurrent)}
				{@const latestTitle = company.roles[0]?.title}
				<li class="relative pb-12 last:pb-0">
					<span
						class="absolute -left-[2.125rem] top-1.5 flex h-2.5 w-2.5 items-center justify-center"
						aria-hidden="true"
					>
						<span
							class="h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-950 {company.isCurrent
								? 'bg-emerald-500 dark:bg-emerald-400'
								: 'bg-slate-300 dark:bg-slate-600'}"
						></span>
					</span>

					<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-1.5">
						<a
							href="/work/{company.slug}"
							class="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
						>
							{company.companyName}
						</a>
						{#if company.isCurrent}
							<StatusIndicator label="Now" variant="emerald" />
						{/if}
					</div>

					{#if range}
						<p class="text-sm text-slate-500 dark:text-slate-400 tabular-nums tracking-wide">
							{range}
						</p>
					{/if}

					{#if latestTitle}
						<p class="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
							{latestTitle}
						</p>
					{/if}
				</li>
			{/each}
		</ol>

		<ButtonContainer>
			<AnchorButton href="/">
				<House />
				Back to Home
			</AnchorButton>
		</ButtonContainer>
	</main>
</PageContainer>
