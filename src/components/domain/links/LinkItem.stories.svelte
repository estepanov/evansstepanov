<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LinkItemView from './LinkItemView.svelte';
	import { sampleGithubLink, sampleLinks } from './fixtures/sampleLinks';

	const { Story } = defineMeta({
		title: 'Domain/Links/LinkItem',
		component: LinkItemView,
		tags: ['autodocs'],
		argTypes: {
			onClick: { action: 'click' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Presentational link row with kind-aware icons and hover glow. Stories target ' +
						'`LinkItemView` so analytics stay out of Storybook; the public `LinkItem` container ' +
						'wires Fathom on click.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ link: sampleGithubLink }}>
	{#snippet template(args)}
		<LinkItemView {...args} />
	{/snippet}
</Story>

<Story name="Email" args={{ link: sampleLinks[1] }}>
	{#snippet template(args)}
		<LinkItemView {...args} />
	{/snippet}
</Story>

<Story name="Website" args={{ link: sampleLinks[2] }}>
	{#snippet template(args)}
		<LinkItemView {...args} />
	{/snippet}
</Story>
