<script lang="ts">
	import StatusIndicator from '../../feedback/StatusIndicator.svelte';
	import TechBackdrop from '../../media/TechBackdrop.svelte';
	import { getFormattedDate } from '../../../util/dates';
	import { workExperienceHref } from '../../../util/work-experience-href';
	import { handleGlowLeave, handleGlowMove } from './gridCardGlow';
	import type { Work } from '../../../data/work';
	import './gridCardChrome.css';

	/** Slug is optional here so the card can render its unlinked fallback. */
	export let item: Omit<Work, 'companySlug'> & { companySlug?: string };
	export let onCardClick: () => void = () => {};

	$: href = workExperienceHref(item.companySlug);
	$: isActive = Boolean(item.isCurrent);
	$: techTags = item.techTags ?? [];
</script>

{#snippet cardBody()}
	<TechBackdrop tags={techTags} />

	{#if isActive}
		<span class="status-anchor">
			<StatusIndicator label="Now" variant="emerald" />
		</span>
		<span class="active-glare" aria-hidden="true">
			<span class="active-glare__spot"></span>
		</span>
	{/if}

	<div class="relative z-[1] flex flex-col grow">
		<div class="relative mb-7">
			<h3 class="card-heading font-bold {isActive ? 'pr-24' : ''}">{item.title}</h3>
			<p class="mt-2.5 text-sm italic text-gray-500 dark:text-gray-400">
				<span class="mr-1">at</span>
				<span class="not-italic font-medium text-gray-700 dark:text-gray-200"
					>{item.companyName}</span
				>
			</p>
		</div>

		<p class="card-description leading-snug dark:text-gray-200 text-gray-600">
			{item.description}
		</p>

		<div class="flex grow"></div>

		<ul
			class="card-meta text-xs md:text-[13px] mt-7 flex flex-row flex-wrap gap-x-4 gap-y-2 dark:text-gray-300 items-center text-gray-500"
		>
			{#if item.startDate}
				<li class="opacity-80">
					{getFormattedDate(item.startDate)}
					{#if item.endDate}
						<span class="mx-1">-</span>
						{getFormattedDate(item.endDate)}
					{/if}
				</li>
			{/if}
		</ul>
	</div>
{/snippet}

<li class="list-none">
	{#if href}
		<a
			{href}
			class="card card--interactive grid-card relative h-full p-6 sm:p-7 flex flex-col no-underline text-inherit"
			class:active-border={isActive}
			aria-label="{item.title} at {item.companyName}"
			on:click={onCardClick}
			on:pointerenter={handleGlowMove}
			on:pointermove={handleGlowMove}
			on:pointerleave={handleGlowLeave}
		>
			{@render cardBody()}
		</a>
	{:else}
		<div
			class="card grid-card relative h-full p-6 sm:p-7 flex flex-col"
			class:active-border={isActive}
			on:pointerenter={handleGlowMove}
			on:pointermove={handleGlowMove}
			on:pointerleave={handleGlowLeave}
		>
			{@render cardBody()}
		</div>
	{/if}
</li>
