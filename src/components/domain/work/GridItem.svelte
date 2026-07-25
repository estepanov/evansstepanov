<script lang="ts">
	import * as Fathom from 'fathom-client';
	import GridItemView from './GridItemView.svelte';

	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	$: titleField = type === 'work' ? item.title : item.name;
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
	};
</script>

<GridItemView
	{item}
	{type}
	{idHash}
	{tech}
	onLinkClick={handleLinkClick}
	onSourceClick={handleSourceClick}
	onDetailsClick={handleDetailsClick}
/>
