<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import WorkExperienceCardView from './WorkExperienceCardView.svelte';
	import { samplePastWorkItem, sampleWorkItem } from './fixtures/sampleWorkItem';

	const { Story } = defineMeta({
		title: 'Domain/Work/WorkExperienceCard',
		component: WorkExperienceCardView,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Whole-card link to a company work page. No nested interactives. ' +
						'Stories target `WorkExperienceCardView`; the public container wires Fathom.'
				}
			}
		}
	});
</script>

<Story name="Current Role" args={{ item: sampleWorkItem }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>

<Story name="Past Role" args={{ item: samplePastWorkItem }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>

<Story name="Missing Slug" args={{ item: { ...sampleWorkItem, companySlug: undefined } }}>
	{#snippet template(args)}
		<ul class="list-none p-0 m-0 max-w-md">
			<WorkExperienceCardView {...args} />
		</ul>
	{/snippet}
</Story>
