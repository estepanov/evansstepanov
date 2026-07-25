<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import GridItemView from './GridItemView.svelte';
	import { sampleProjectItem } from './fixtures/sampleProjectItem';
	import { sampleTech, sampleWorkItem } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/GridItem',
		component: GridItemView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Presentational work/project card. Stories target `GridItemView`; the public ' +
						'`GridItem` container wires Fathom analytics callbacks.'
				}
			}
		}
	});
</script>

<Story name="Work Current" args={{ item: sampleWorkItem, type: 'work', tech: sampleTech }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<GridItemView {...args} />
		</ul>
	{/snippet}
</Story>

<Story name="Project Active" args={{ item: sampleProjectItem, type: 'project', tech: sampleTech }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<GridItemView {...args} />
		</ul>
	{/snippet}
</Story>
