<script lang="ts">
	import DetailsModalView from './DetailsModalView.svelte';

	export let open = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- passthrough to DetailsModalView, which renders either Work or Project shapes
	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let tech: Array<{ name: string; type?: string; proficiencyWeight?: number }> = [];
	export let onClose: () => void = () => {};
</script>

<!-- bind:open preserves ProjectCard's two-way open state; work page uses open + onClose. -->
<DetailsModalView bind:open {item} {type} {tech} {onClose} />
