<script lang="ts">
	import DetailsModalView from './DetailsModalView.svelte';

	export let open = false;
	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let tech: Array<{ name: string; type?: string; proficiencyWeight?: number }> = [];
	export let onClose: () => void = () => {};
</script>

<!-- bind:open preserves ProjectCard's two-way open state; work page uses open + onClose. -->
<DetailsModalView bind:open {item} {type} {tech} {onClose} />
