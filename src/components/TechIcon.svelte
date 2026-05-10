<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import type { TechIcon } from '../util/tech-icons';

	export let icon: TechIcon | null;
	export let size: number = 24;
</script>

{#if icon?.kind === 'simple'}
	<svelte:component this={icon.component} {size} />
{:else if icon?.kind === 'hugeicons'}
	<HugeiconsIcon icon={icon.icon} {size} color="currentColor" strokeWidth={1.5} />
{/if}
