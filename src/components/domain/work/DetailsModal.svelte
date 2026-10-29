<script lang="ts">
	import DetailsModalView from './DetailsModalView.svelte';
	import type { Work } from '../../../data/work';
	import type { Project } from '../../../data/projects';
	import type { TechChip } from '../../../util/tech-chip';

	export let open = false;
	export let item: Work | Project | undefined = undefined;
	export let type: 'work' | 'project' = 'work';
	export let tech: TechChip[] = [];
	export let onClose: () => void = () => {};
</script>

<!-- bind:open preserves ProjectCard's two-way open state; work page uses open + onClose. -->
<DetailsModalView bind:open {item} {type} {tech} {onClose} />
