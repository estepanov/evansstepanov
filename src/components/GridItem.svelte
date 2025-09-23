<script lang="ts">
	import SpecialBadge from './SpecialBadge.svelte';
	import { getFormattedDate } from '../util/dates';
	import { GithubIcon } from '@lucide/svelte';
	import * as Fathom from 'fathom-client';

	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let idHash: ((name: string) => string) | undefined = undefined;

	$: isActive = type === 'work' ? item.isCurrent : item.isActive;
	$: badgeText = type === 'work' ? 'Current' : 'Active';
	$: titleField = type === 'work' ? item.title : item.name;
	$: companyOrUrl = type === 'work' ? item.companyName : undefined;
	
	const handleLinkClick = (linkType: string, itemName: string) => {
		const eventName = type === 'work' ? `click_work_link-${itemName}` : `click_project_link-${itemName}`;
		Fathom.trackEvent(eventName);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};
</script>

<li
	id={type === 'project' && idHash ? idHash(item.name) : undefined}
	class={`relative transition-all ease-in${type === 'project' ? '-out' : ''} p-6 rounded-xl flex flex-col ${
		isActive
			? `project-active-border`
			: `border border-slate-500/20 dark:border-slate-300/10`
	}`}
>
	{#if type === 'work'}
		<h3 class="relative mb-4">
			<span class="w-full block font-bold">
				{titleField}
			</span>
			{#if item.url}
				<a
					target="_blank"
					rel="noopener"
					referrerpolicy="no-referrer"
					on:click={() => handleLinkClick('work', titleField)}
					href={item.url}
					class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in opacity-70"
					>{companyOrUrl}</a
				>
			{:else}
				<span class="font-normal text-gray-700 dark:text-gray-300 opacity-70"
					>{companyOrUrl}</span
				>
			{/if}
		</h3>
	{:else}
		<div class="flex flex-row items-center mb-4 relative">
			<h3 class="font-bold flex justify-center items-center">
				{#if item.url}
					<a
						target="_blank"
						rel="noopener"
						referrerpolicy="no-referrer"
						on:click={() => handleLinkClick('project', titleField)}
						href={item.url}
						class="text-gray-700 dark:text-gray-200 line-clamp-1 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
						>{titleField}</a
					>
				{:else}
					<span class="text-gray-700 dark:text-gray-200 line-clamp-1">{titleField}</span>
				{/if}
			</h3>
		</div>
	{/if}
	
	<p class="leading-tight dark:text-gray-200 text-gray-600{type === 'project' ? ' line-clamp-4' : ''}">{item.description}</p>
	<div class="flex flex-grow"></div>
	
	<ul class={`text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 ${type === 'work' ? 'text-gray-500' : 'text-gray-700'} items-center`}>
		{#if item.startDate}
			<li class={`opacity-80${type === 'project' ? ' special' : ''}`}>
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
					class="hover:underline-offset-4 capitalize flex flex-row justify-center items-center opacity-80 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
				>
					{#if item.source?.includes('github.com')}
						<GithubIcon class="h-3 w-3 mr-1" />
					{/if}
					{new URL(item.source).hostname.split('.')[0]}
				</a>
			</li>
		{/if}
	</ul>

	{#if isActive}
		<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full">
			<SpecialBadge className="-ml-2">{badgeText}</SpecialBadge>
		</span>
	{/if}
</li>

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