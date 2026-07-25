<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DetailsModalView from './DetailsModalView.svelte';
	import { sampleProjectItem } from './fixtures/sampleProjectItem';
	import { sampleTech, sampleWorkItem } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/DetailsModal',
		component: DetailsModalView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Presentational details dialog for work roles and projects. Stories target ' +
						'`DetailsModalView`; the public `DetailsModal` container re-exports the same props ' +
						'for route/ProjectCard imports.'
				}
			}
		}
	});
</script>

<script lang="ts">
	let workOpen = true;
	let projectOpen = true;
</script>

<Story name="Open Work" args={{ open: true, type: 'work', item: sampleWorkItem, tech: sampleTech }}>
	{#snippet template(args)}
		<DetailsModalView
			{...args}
			bind:open={workOpen}
			onClose={() => {
				workOpen = false;
			}}
		/>
	{/snippet}
</Story>

<Story
	name="Open Project"
	args={{ open: true, type: 'project', item: sampleProjectItem, tech: sampleTech }}
>
	{#snippet template(args)}
		<DetailsModalView
			{...args}
			bind:open={projectOpen}
			onClose={() => {
				projectOpen = false;
			}}
		/>
	{/snippet}
</Story>

<Story name="Closed" args={{ open: false, type: 'work', item: sampleWorkItem, tech: sampleTech }}>
	{#snippet template(args)}
		<div style="padding: 1rem; opacity: 0.7; font-size: 0.875rem;">
			Modal inert (<code>open: false</code>). Use Open Work / Open Project to interact.
		</div>
		<DetailsModalView {...args} onClose={() => {}} />
	{/snippet}
</Story>
