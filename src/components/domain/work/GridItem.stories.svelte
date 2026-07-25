<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import GridItemView from './GridItemView.svelte';
	import { sampleProjectItem } from './fixtures/sampleProjectItem';
	import { sampleTech } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/GridItem',
		component: GridItemView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Presentational project card. Stories target `GridItemView`; the public ' +
						'`GridItem` container wires Fathom analytics callbacks. Work cards live under ' +
						'`Domain/Work/WorkExperienceCard`.'
				}
			}
		}
	});
</script>

<Story name="Project Active" args={{ item: sampleProjectItem, tech: sampleTech }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<GridItemView {...args} />
		</ul>
	{/snippet}
</Story>
