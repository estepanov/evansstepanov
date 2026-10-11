<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import type { ExternalLink } from '../../../util/links';

	export let links: ExternalLink[] = [];
</script>

<ul
	class="grid grid-cols-1 gap-6 md:gap-8 lg:gap-12 {links.length > 2
		? 'sm:grid-cols-2'
		: 'sm:max-w-md sm:mx-auto'}"
>
	{#each links as link (link.url)}
		<li class="min-w-0">
			<LinkItem {link} />
		</li>
	{/each}
</ul>
