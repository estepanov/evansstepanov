<script lang="ts">
	import * as Fathom from 'fathom-client';
	import ProjectCardView from './ProjectCardView.svelte';
	import type { Project } from '../../../data/projects';

	export let item: Project;
	export let idHash: ((name: string) => string) | undefined = undefined;
	export let tech: Array<{ name: string; type?: string }> = [];

	const handleLinkClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_link-${itemName}`);
	};

	const handleSourceClick = (itemName: string) => {
		Fathom.trackEvent(`click_project_source-${itemName}`);
	};

	const handleDetailsClick = () => {
		Fathom.trackEvent(`click_project_details-${item.name}`);
	};
</script>

<ProjectCardView
	{item}
	{idHash}
	{tech}
	onLinkClick={handleLinkClick}
	onSourceClick={handleSourceClick}
	onDetailsClick={handleDetailsClick}
/>
