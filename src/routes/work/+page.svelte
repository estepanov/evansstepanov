<script lang="ts">
	import ButtonContainer from '../../components/actions/ButtonContainer.svelte';
	import AnchorButton from '../../components/actions/AnchorButton.svelte';
	import { House } from '@lucide/svelte';
	import PageContainer from '../../components/layout/PageContainer.svelte';
	import TechHeader from '../../components/domain/tech/TechHeader.svelte';
	import StatusIndicator from '../../components/feedback/StatusIndicator.svelte';
	import { formatDateRange } from '../../util/dates';

	export let data;

	const { companies } = data;
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

		<ol class="timeline relative ml-1">
			<span class="timeline-rail" aria-hidden="true"></span>
			{#each companies as company}
				{@const range = formatDateRange(company.startDate, company.endDate, company.isCurrent)}
				{@const latestTitle = company.roles[0]?.title}
				<li class="timeline-item relative pb-12 pl-8 last:pb-0">
					<span
						class="timeline-dot absolute top-[0.55rem] size-2.5 rounded-full ring-4 ring-white dark:ring-slate-950 {company.isCurrent
							? 'bg-emerald-500 dark:bg-emerald-400'
							: 'bg-slate-300 dark:bg-slate-600'}"
						aria-hidden="true"
					></span>

					<div class="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
						<a
							href="/work/{company.slug}"
							class="text-xl font-semibold tracking-tight text-slate-900 transition-colors hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400"
						>
							{company.companyName}
						</a>
						{#if company.isCurrent}
							<StatusIndicator label="Now" variant="emerald" />
						{/if}
					</div>

					{#if range}
						<p class="text-sm tabular-nums tracking-wide text-slate-500 dark:text-slate-400">
							{range}
						</p>
					{/if}

					{#if latestTitle}
						<p class="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
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

<style>
	/* Dot is 0.625rem (size-2.5); rail + dots share the same center axis. */
	.timeline {
		--timeline-axis: 0.3125rem;
	}

	.timeline-rail {
		position: absolute;
		top: 0.55rem;
		bottom: 0.55rem;
		left: var(--timeline-axis);
		width: 1px;
		transform: translateX(-50%);
		background-color: rgb(226 232 240); /* slate-200 */
	}

	:global(html.dark) .timeline-rail {
		background-color: rgb(30 41 59); /* slate-800 */
	}

	.timeline-dot {
		left: var(--timeline-axis);
		transform: translateX(-50%);
	}
</style>
