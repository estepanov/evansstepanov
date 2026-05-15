<script lang="ts">
	import SpecialBadge from './SpecialBadge.svelte';
	import TechBackdrop from './TechBackdrop.svelte';
	import DetailsModal from './DetailsModal.svelte';
	import { getFormattedDate } from '../util/dates';
	import { GithubIcon, ArrowUpRight } from '@lucide/svelte';
	import * as Fathom from 'fathom-client';

	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	let detailsOpen = false;

	$: isActive = type === 'work' ? item.isCurrent : item.isActive;
	$: badgeText = type === 'work' ? 'Current' : 'Active';
	$: titleField = type === 'work' ? item.title : item.name;
	$: companyOrUrl = type === 'work' ? item.companyName : undefined;
	$: techTags = (item.techTags as string[] | undefined) ?? [];

	const handleLinkClick = (_linkType: string, itemName: string) => {
		const eventName =
			type === 'work' ? `click_work_link-${itemName}` : `click_project_link-${itemName}`;
		Fathom.trackEvent(eventName);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		const eventName =
			type === 'work' ? `click_work_details-${titleField}` : `click_project_details-${titleField}`;
		Fathom.trackEvent(eventName);
		detailsOpen = true;
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
					<p class="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
						<span class="mr-1">at</span>
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

		<div class="flex flex-grow"></div>

		<ul
			class="text-xs md:text-[13px] mt-4 flex flex-row flex-wrap gap-x-4 gap-y-2 dark:text-gray-300 items-center {type ===
			'work'
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
			<li class="sm:hidden special">
				<button
					type="button"
					on:click={handleDetailsClick}
					aria-haspopup="dialog"
					aria-expanded={detailsOpen}
					class="capitalize flex flex-row justify-center items-center opacity-80 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ease-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-sm"
				>
					Details
				</button>
			</li>
			<li class="details-btn-wrap hidden sm:inline-flex sm:ml-auto">
				<button
					type="button"
					on:click={handleDetailsClick}
					aria-label="View details for {titleField}"
					aria-haspopup="dialog"
					aria-expanded={detailsOpen}
					class="details-btn group/details relative inline-flex items-center gap-1.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:text-emerald-700 dark:focus-visible:text-emerald-300 transition-colors duration-200"
				>
					<span class="details-btn__label">View details</span>
					<ArrowUpRight
						size={12}
						strokeWidth={2.25}
						class="details-btn__arrow"
						aria-hidden="true"
					/>
				</button>
			</li>
		</ul>
	</div>

	<DetailsModal bind:open={detailsOpen} {item} {type} {tech} />

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
		font-size: clamp(1.05rem, 0.95rem + 0.45vw, 1.375rem);
		line-height: 1.2;
	}

	@media (min-width: 640px) and (hover: hover) {
		.details-btn-wrap {
			opacity: 0;
			transform: translateY(2px);
			transition:
				opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
				transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		.tech-card:hover .details-btn-wrap,
		.tech-card:focus-within .details-btn-wrap {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.details-btn__label {
		position: relative;
	}

	.details-btn__label::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.details-btn:hover .details-btn__label::after,
	.details-btn:focus-visible .details-btn__label::after {
		transform: scaleX(1);
	}

	.details-btn :global(.details-btn__arrow) {
		transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.details-btn:hover :global(.details-btn__arrow),
	.details-btn:focus-visible :global(.details-btn__arrow) {
		transform: translate(2px, -2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.details-btn__label::after,
		.details-btn :global(.details-btn__arrow) {
			transition: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-btn-wrap {
			transition: opacity 220ms ease;
			transform: none;
		}
	}

	.tech-card {
		isolation: isolate;
		transition:
			color 300ms ease,
			background-color 300ms ease,
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1);
		animation: card-breathe 9s ease-in-out infinite;
	}

	@keyframes card-breathe {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-1px);
		}
	}

	.tech-card:hover,
	.tech-card:focus-within {
		transform: translateY(-2px);
		animation-play-state: paused;
		box-shadow:
			0 1px 0 rgba(15, 23, 42, 0.02),
			0 10px 30px -18px rgba(15, 23, 42, 0.18);
	}

	:global(html.dark) .tech-card:hover,
	:global(html.dark) .tech-card:focus-within {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.02),
			0 10px 30px -18px rgba(0, 0, 0, 0.6);
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-card {
			animation: none;
		}
		.tech-card:hover,
		.tech-card:focus-within {
			transform: none;
		}
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
