<script lang="ts">
	import StatusIndicator from './StatusIndicator.svelte';
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
	$: statusLabel = type === 'work' ? 'Now' : 'In progress';
	$: statusVariant = (type === 'work' ? 'emerald' : 'subtle') as 'emerald' | 'subtle';
	$: titleField = type === 'work' ? item.title : item.name;
	$: companyOrUrl = type === 'work' ? item.companyName : undefined;
	$: techTags = (item.techTags as string[] | undefined) ?? [];
	$: detailsEventName =
		type === 'work' ? `click_work_details-${titleField}` : `click_project_details-${titleField}`;

	const handleLinkClick = (_linkType: string, itemName: string) => {
		const eventName =
			type === 'work' ? `click_work_link-${itemName}` : `click_project_link-${itemName}`;
		Fathom.trackEvent(eventName);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		Fathom.trackEvent(detailsEventName);
		detailsOpen = true;
	};

	function handleGlowMove(event: PointerEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		target.style.setProperty('--grid-glow-x', `${x}%`);
		target.style.setProperty('--grid-glow-y', `${y}%`);
	}

	function handleGlowLeave(event: PointerEvent) {
		const target = event.currentTarget as HTMLElement;
		target.style.removeProperty('--grid-glow-x');
		target.style.removeProperty('--grid-glow-y');
	}
</script>

<li
	id={type === 'project' && idHash ? idHash(item.name) : undefined}
	class="card card--interactive grid-card relative p-6 sm:p-7 flex flex-col"
	class:active-border={isActive}
	class:active-border--subtle={isActive && type === 'project'}
	on:pointerenter={handleGlowMove}
	on:pointermove={handleGlowMove}
	on:pointerleave={handleGlowLeave}
>
	<TechBackdrop tags={techTags} />

	{#if isActive}
		<span class="status-anchor">
			<StatusIndicator label={statusLabel} variant={statusVariant} />
		</span>
		<span class="active-glare" aria-hidden="true">
			<span class="active-glare__spot"></span>
		</span>
	{/if}

	<div class="relative z-[1] flex flex-col grow">
		{#if type === 'work'}
			<div class="relative mb-7">
				<h3 class="card-heading font-bold {isActive ? 'pr-24' : ''}">
					{titleField}
				</h3>
				{#if companyOrUrl}
					<p class="mt-2.5 text-sm italic text-gray-500 dark:text-gray-400">
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
			<div class="flex flex-row items-center mb-7 relative">
				<h3
					class="card-heading font-bold {isActive ? 'pr-24' : ''} flex justify-center items-center"
				>
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
			class="card-description leading-snug dark:text-gray-200 text-gray-600{type === 'project'
				? ' line-clamp-4'
				: ''}"
		>
			{item.description}
		</p>

		<div class="flex grow"></div>

		<ul
			class="text-xs md:text-[13px] mt-7 flex flex-row flex-wrap gap-x-4 gap-y-2 dark:text-gray-300 items-center {type ===
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
					class="details-btn group/details relative inline-flex items-center gap-1.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-hidden focus-visible:text-emerald-700 dark:focus-visible:text-emerald-300 transition-colors duration-200"
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
</li>

<style>
	.card-heading {
		font-size: clamp(1.05rem, 0.95rem + 0.45vw, 1.375rem);
		line-height: 1.2;
	}

	.card-description {
		text-shadow:
			0 0 1px var(--color-white),
			0 1px 1px var(--color-white);
	}

	:global(html.dark) .card-description {
		text-shadow:
			0 0 1px var(--color-gray-900),
			0 1px 1px var(--color-gray-900);
	}

	.status-anchor {
		position: absolute;
		top: 1.1rem;
		right: 1.25rem;
		z-index: 3;
	}

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

	.grid-card {
		--grid-glow-x: 86%;
		--grid-glow-y: 14%;
		/* Let the browser skip layout/paint for cards far from the viewport.
		 * intrinsic size keeps scrollbar + anchor positions stable. */
		content-visibility: auto;
		contain-intrinsic-size: auto 320px;
	}

	.grid-card::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			20rem circle at var(--grid-glow-x) var(--grid-glow-y),
			rgba(126, 34, 206, 0.13) 0%,
			rgba(126, 34, 206, 0.07) 45%,
			transparent 78%
		);
		opacity: 0;
		transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .grid-card::after {
		background: radial-gradient(
			20rem circle at var(--grid-glow-x) var(--grid-glow-y),
			rgba(168, 85, 247, 0.07) 0%,
			rgba(168, 85, 247, 0.035) 45%,
			transparent 78%
		);
	}

	.grid-card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			88% 78% at 0% 100%,
			rgba(5, 150, 105, 0.17) 0%,
			rgba(5, 150, 105, 0.06) 36%,
			transparent 64%
		);
		-webkit-backdrop-filter: blur(3px) saturate(1.15);
		backdrop-filter: blur(3px) saturate(1.15);
		-webkit-mask-image: radial-gradient(
			88% 78% at 0% 100%,
			#000 0%,
			rgba(0, 0, 0, 0.55) 30%,
			transparent 70%
		);
		mask-image: radial-gradient(
			88% 78% at 0% 100%,
			#000 0%,
			rgba(0, 0, 0, 0.55) 30%,
			transparent 70%
		);
		opacity: 0;
		transform: scale(0.55);
		transform-origin: 0% 100%;
		transition:
			opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1) 220ms,
			transform 1200ms cubic-bezier(0.22, 1, 0.36, 1) 220ms;
		will-change: transform, opacity;
	}

	:global(html.dark) .grid-card::before {
		background: radial-gradient(
			88% 78% at 0% 100%,
			rgba(16, 185, 129, 0.22) 0%,
			rgba(16, 185, 129, 0.08) 36%,
			transparent 64%
		);
		-webkit-backdrop-filter: blur(4px) saturate(1.2);
		backdrop-filter: blur(4px) saturate(1.2);
	}

	@media (hover: hover) and (pointer: fine) {
		.grid-card:hover::after,
		.grid-card:focus-within::after {
			opacity: 0.75;
		}

		:global(html.dark) .grid-card:hover::after,
		:global(html.dark) .grid-card:focus-within::after {
			opacity: 0.8;
		}

		.grid-card:hover::before,
		.grid-card:focus-within::before {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid-card::before {
			transform: none;
			transition: opacity 240ms ease;
		}
	}

	.grid-card.active-border {
		content-visibility: visible;
		contain-intrinsic-size: none;
	}

	.active-border {
		--ab-accent: var(--color-emerald-500);
		--ab-edge: color-mix(in oklab, var(--color-emerald-500) 32%, transparent);
		position: relative;
		border-color: color-mix(in oklab, var(--color-emerald-500) 18%, transparent);
	}

	:global(html.dark) .active-border {
		--ab-accent: var(--color-emerald-400);
		--ab-edge: color-mix(in oklab, var(--color-emerald-400) 32%, transparent);
		border-color: color-mix(in oklab, var(--color-emerald-400) 18%, transparent);
	}

	.active-border--subtle {
		--ab-accent: var(--color-slate-600);
		--ab-edge: color-mix(in oklab, var(--color-slate-500) 40%, transparent);
		--glare-opacity: 0.62;
		border-color: color-mix(in oklab, var(--color-slate-500) 28%, transparent);
	}

	:global(html.dark) .active-border--subtle {
		--ab-accent: var(--color-slate-300);
		--ab-edge: color-mix(in oklab, var(--color-slate-300) 22%, transparent);
		border-color: color-mix(in oklab, var(--color-slate-300) 14%, transparent);
	}

	.active-glare {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		z-index: 2;
		pointer-events: none;
		overflow-x: clip;
		overflow-y: visible;
	}

	.active-glare__spot {
		position: absolute;
		top: 0;
		left: 0;
		width: 180px;
		height: 44px;
		transform: translate(-50%, -50%);
		background: radial-gradient(
			closest-side at 50% 50%,
			color-mix(in oklab, var(--ab-accent), transparent 55%) 0%,
			color-mix(in oklab, var(--ab-accent), transparent 82%) 38%,
			transparent 72%
		);
		filter: blur(8px);
		--glare-opacity: 0.42;
		opacity: 0;
		mix-blend-mode: multiply;
		transition: opacity 7000ms cubic-bezier(0.45, 0, 0.55, 1);
		will-change: transform, opacity;
	}

	:global(html.is-scrolling) .active-glare__spot {
		opacity: var(--glare-opacity);
		transition: opacity 3800ms cubic-bezier(0.45, 0, 0.55, 1);
	}

	:global(html.dark) .active-glare__spot {
		--glare-opacity: 0.72;
		mix-blend-mode: plus-lighter;
	}

	@supports (animation-timeline: view()) {
		.active-glare__spot {
			animation: glare-travel linear both;
			animation-timeline: view();
			animation-range: cover 0% cover 100%;
		}
	}

	@keyframes glare-travel {
		from {
			transform: translate(-30%, -50%);
		}
		to {
			transform: translate(130%, -50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.active-glare__spot {
			animation: none;
			transform: translate(50%, -50%);
		}
	}
</style>
