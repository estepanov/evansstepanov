<script lang="ts">
	import * as Fathom from 'fathom-client';
	import GridItemView from './GridItemView.svelte';

	export let item: any;
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	const handleLinkClick = (_linkType: string, itemName: string) => {
		Fathom.trackEvent(`click_project_link-${itemName}`);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		Fathom.trackEvent(`click_project_details-${item.name}`);
	};
</script>

<GridItemView
	{item}
	{idHash}
	{tech}
	onLinkClick={handleLinkClick}
	onSourceClick={handleSourceClick}
	onDetailsClick={handleDetailsClick}
/>
