<script lang="ts">
	import './gridCardChrome.css';
	import StatusIndicator from '../../feedback/StatusIndicator.svelte';
	import TechBackdrop from '../../media/TechBackdrop.svelte';
	import DetailsModal from './DetailsModal.svelte';
	import { getFormattedDate } from '../../../util/dates';
	import { GithubIcon } from '@lucide/svelte';
	import { handleGlowLeave, handleGlowMove } from './gridCardGlow';
	import type { Project } from '../../../data/projects';

	export let item: Project;
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];
	export let onLinkClick: (itemName: string) => void = () => {};
	export let onSourceClick: (itemName: string) => void = () => {};
	export let onDetailsClick: () => void = () => {};

	let detailsOpen = false;

	$: isActive = Boolean(item.isActive);
	$: titleField = item.name;
	$: techTags = item.techTags ?? [];

	const handleDetailsClick = () => {
		onDetailsClick();
		detailsOpen = true;
	};
</script>

<li
	id={idHash ? idHash(item.name) : undefined}
	class="card card--interactive grid-card relative p-6 sm:p-7 flex flex-col"
	class:active-border={isActive}
	class:active-border--subtle={isActive}
	on:pointerenter={handleGlowMove}
	on:pointermove={handleGlowMove}
	on:pointerleave={handleGlowLeave}
>
	<TechBackdrop tags={techTags} />

	{#if isActive}
		<span class="status-anchor">
			<StatusIndicator label="In progress" variant="subtle" />
		</span>
		<span class="active-glare" aria-hidden="true">
			<span class="active-glare__spot"></span>
		</span>
	{/if}

	<div class="relative z-[1] flex flex-col grow">
		<div class="flex flex-row items-center mb-7 relative">
			<h3 class="card-heading font-bold {isActive ? 'pr-24' : ''} flex justify-center items-center">
				{#if item.url}
					<a
						target="_blank"
						rel="noopener"
						referrerpolicy="no-referrer"
						on:click={() => onLinkClick(titleField)}
						href={item.url}
						class="text-gray-700 dark:text-gray-200 line-clamp-1 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ease-in"
						>{titleField}</a
					>
				{:else}
					<span class="text-gray-700 dark:text-gray-200 line-clamp-1">{titleField}</span>
				{/if}
			</h3>
		</div>

		<p class="card-description leading-snug dark:text-gray-200 text-gray-600 line-clamp-4">
			{item.description}
		</p>

		<div class="flex grow"></div>

		<ul
			class="card-meta text-xs md:text-[13px] mt-7 flex flex-row flex-wrap gap-x-4 gap-y-2 dark:text-gray-300 items-center text-gray-700"
		>
			{#if item.startDate}
				<li class="opacity-80 special">
					{getFormattedDate(item.startDate)}
				</li>
			{/if}
			{#if item.source}
				<li class="special">
					<a
						target="_blank"
						rel="noopener"
						referrerpolicy="no-referrer"
						on:click={() => onSourceClick(item.name)}
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
					class="capitalize flex flex-row justify-center items-center opacity-80 underline underline-offset-2 hover:underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ease-in focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-xs"
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
					class="details-btn group/details relative inline-flex items-center py-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-hidden focus-visible:text-emerald-700 dark:focus-visible:text-emerald-300 transition-colors duration-200"
				>
					<span class="details-btn__label">View details</span>
				</button>
			</li>
		</ul>
	</div>

	<DetailsModal bind:open={detailsOpen} {item} type="project" {tech} />
</li>

<style>
	@media (min-width: 640px) and (hover: hover) {
		.details-btn-wrap {
			opacity: 0;
			transform: translateY(2px);
			transition:
				opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
				transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		.grid-card:hover .details-btn-wrap,
		.grid-card:focus-within .details-btn-wrap {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.details-btn {
		text-shadow:
			0 0 1px var(--color-white),
			0 1px 1px var(--color-white);
	}

	:global(html.dark) .details-btn {
		text-shadow:
			0 0 1px var(--color-gray-900),
			0 1px 1px var(--color-gray-900);
	}

	.details-btn::before {
		content: '';
		position: absolute;
		inset: -0.3rem -0.65rem;
		border-radius: 999px;
		background: var(--color-white);
		box-shadow:
			0 1px 2px rgba(15, 23, 42, 0.06),
			0 0 0 1px rgba(15, 23, 42, 0.06);
		opacity: 0;
		transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: -1;
	}

	:global(html.dark) .details-btn::before {
		background: var(--color-gray-900);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.06);
	}

	.details-btn:hover::before,
	.details-btn:focus-visible::before {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.details-btn::before {
			transition: none;
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

	@media (prefers-reduced-motion: reduce) {
		.details-btn__label::after {
			transition: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-btn-wrap {
			transition: opacity 220ms ease;
			transform: none;
		}
	}
</style>
