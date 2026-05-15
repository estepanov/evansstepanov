<script lang="ts">
	import SpecialBadge from './SpecialBadge.svelte';
	import TechBackdrop from './TechBackdrop.svelte';
	import { getFormattedDate } from '../util/dates';
	import { GithubIcon } from '@lucide/svelte';
	import * as Fathom from 'fathom-client';

	const MAX_VISIBLE_TAGS = 4;

	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let idHash: ((name: string) => string) | undefined = undefined;

	$: isActive = type === 'work' ? item.isCurrent : item.isActive;
	$: badgeText = type === 'work' ? 'Current' : 'Active';
	$: titleField = type === 'work' ? item.title : item.name;
	$: companyOrUrl = type === 'work' ? item.companyName : undefined;
	$: techTags = (item.techTags as string[] | undefined) ?? [];
	$: visibleTags = techTags.slice(0, MAX_VISIBLE_TAGS);
	$: hiddenTagCount = Math.max(0, techTags.length - MAX_VISIBLE_TAGS);

	const handleLinkClick = (_linkType: string, itemName: string) => {
		const eventName =
			type === 'work' ? `click_work_link-${itemName}` : `click_project_link-${itemName}`;
		Fathom.trackEvent(eventName);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};
</script>

<li
	id={type === 'project' && idHash ? idHash(item.name) : undefined}
	class="tech-card relative p-6 rounded-xl flex flex-col transition-colors duration-300"
	class:active-border={isActive}
	class:active-border--subtle={isActive && type === 'project'}
	class:idle-border={!isActive}
>
	<TechBackdrop tags={techTags} />

	<div class="relative z-[1] flex flex-col flex-grow">
		{#if type === 'work'}
			<div class="relative mb-4">
				<h3 class="card-heading font-bold">
					{titleField}
				</h3>
				{#if companyOrUrl}
					<p class="mt-0.5 text-sm italic text-gray-500 dark:text-gray-400">
						at
						{#if item.url}
							<a
								target="_blank"
								rel="noopener"
								referrerpolicy="no-referrer"
								on:click={() => handleLinkClick('work', titleField)}
								href={item.url}
								class="not-italic font-medium text-gray-700 dark:text-gray-200 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
								>{companyOrUrl}</a
							>
						{:else}
							<span class="not-italic font-medium text-gray-700 dark:text-gray-200"
								>{companyOrUrl}</span
							>
						{/if}
					</p>
				{/if}
			</div>
		{:else}
			<div class="flex flex-row items-center mb-4 relative">
				<h3 class="card-heading font-bold flex justify-center items-center">
					{#if item.url}
						<a
							target="_blank"
							rel="noopener"
							referrerpolicy="no-referrer"
							on:click={() => handleLinkClick('project', titleField)}
							href={item.url}
							class="text-gray-700 dark:text-gray-200 line-clamp-1 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ease-in"
							>{titleField}</a
						>
					{:else}
						<span class="text-gray-700 dark:text-gray-200 line-clamp-1">{titleField}</span>
					{/if}
				</h3>
			</div>
		{/if}

		<p
			class="leading-tight dark:text-gray-200 text-gray-600{type === 'project'
				? ' line-clamp-4'
				: ''}"
		>
			{item.description}
		</p>

		{#if visibleTags.length > 0}
			<ul class="mt-4 flex flex-wrap items-center gap-1.5 max-w-[85%]" aria-label="Tech stack">
				{#each visibleTags as tag (tag)}
					<li>
						<a
							href="/tech/{tag}"
							title={tag}
							class="tech-tag group/tag inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/5 dark:hover:bg-emerald-400/10 transition-colors duration-200"
						>
							{tag}
						</a>
					</li>
				{/each}
				{#if hiddenTagCount > 0}
					<li
						class="inline-flex items-center px-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400"
						aria-label="{hiddenTagCount} more"
					>
						+{hiddenTagCount}
					</li>
				{/if}
			</ul>
		{/if}

		<div class="flex flex-grow"></div>

		<ul
			class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 items-center {type === 'work'
				? 'text-gray-500'
				: 'text-gray-700'}"
		>
			{#if item.startDate}
				<li class="opacity-80{type === 'project' ? ' special' : ''}">
					{getFormattedDate(item.startDate)}
					{#if type === 'work' && item.endDate}
						<span class="mx-1">-</span>
						{getFormattedDate(item.endDate)}
					{/if}
				</li>
			{/if}
			{#if type === 'project' && item.source}
				<li class="special">
					<a
						target="_blank"
						rel="noopener"
						referrerpolicy="no-referrer"
						on:click={() => handleSourceClick(item.name)}
						href={item.source}
						class="capitalize flex flex-row justify-center items-center opacity-80 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ease-in"
					>
						{#if item.source?.includes('github.com')}
							<GithubIcon class="h-3 w-3 mr-1" />
						{/if}
						{new URL(item.source).hostname.split('.')[0]}
					</a>
				</li>
			{/if}
		</ul>
	</div>

	{#if isActive}
		<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full z-[2]">
			<SpecialBadge className="-ml-2" variant={type === 'project' ? 'subtle' : 'emerald'}
				>{badgeText}</SpecialBadge
			>
		</span>
	{/if}
</li>

<style>
	@property --bg-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	@keyframes spin-border {
		to {
			--bg-angle: 360deg;
		}
	}

	.card-heading {
		font-size: clamp(1rem, 0.95rem + 0.2vw, 1.175rem);
		line-height: 1.2;
	}

	.tech-card {
		isolation: isolate;
		transition:
			color 300ms ease,
			background-color 300ms ease;
	}

	.tech-card:hover .tech-tag,
	.tech-card:focus-within .tech-tag {
		background-color: theme('colors.white');
	}
	:global(html.dark) .tech-card:hover .tech-tag,
	:global(html.dark) .tech-card:focus-within .tech-tag {
		background-color: theme('colors.slate.900');
	}

	.idle-border {
		border: 1px solid theme('colors.slate.500 / 0.2');
	}
	:global(html.dark) .idle-border {
		border-color: theme('colors.slate.800 / 0.8');
	}

	.active-border {
		--ab-edge: theme('colors.emerald.500 / 0.1');
		--ab-mid: theme('colors.emerald.500 / 0.9');
		--ab-duration: 20s;
		position: relative;
	}

	.active-border--subtle {
		--ab-edge: theme('colors.slate.400 / 0.05');
		--ab-mid: theme('colors.slate.400 / 0.35');
		--ab-duration: 30s;
	}
	:global(html.dark) .active-border--subtle {
		--ab-edge: theme('colors.slate.500 / 0.05');
		--ab-mid: theme('colors.slate.400 / 0.3');
	}

	.active-border::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		border: 1px solid transparent;
		background:
			linear-gradient(to bottom, var(--ab-edge), var(--ab-mid), var(--ab-edge)) padding-box,
			conic-gradient(from var(--bg-angle), var(--ab-edge), var(--ab-mid)) border-box;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: spin-border var(--ab-duration) linear infinite;
	}
</style>
