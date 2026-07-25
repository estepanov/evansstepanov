<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProjectCardView from './ProjectCardView.svelte';
	import { sampleProjectItem } from './fixtures/sampleProjectItem';
	import { sampleTech } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/ProjectCard',
		component: ProjectCardView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Presentational project card. Stories target `ProjectCardView`; the public ' +
						'`ProjectCard` container wires Fathom analytics callbacks. Work cards live under ' +
						'`Domain/Work/WorkExperienceCard`.'
				}
			}
		}
	});
</script>

<Story name="Project Active" args={{ item: sampleProjectItem, tech: sampleTech }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<ProjectCardView {...args} />
		</ul>
	{/snippet}
</Story>
