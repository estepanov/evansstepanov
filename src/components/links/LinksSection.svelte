<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import type { ExternalLink } from '../../util/links';

	export let links: ExternalLink[] = [];
</script>

<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
	{#each links as link}
		<li class="min-w-0">
			<LinkItem {link} />
		</li>
	{/each}
</ul>
