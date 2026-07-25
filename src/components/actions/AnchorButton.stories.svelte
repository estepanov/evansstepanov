<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AnchorButton from './AnchorButton.svelte';

	const { Story } = defineMeta({
		title: 'Actions/AnchorButton',
		component: AnchorButton,
		tags: ['autodocs'],
		argTypes: {
			href: { control: 'text' },
			target: { control: 'text' },
			rel: { control: 'text' },
			className: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A link styled as a full-width button. It is `flex-1`, so it expects to sit inside ' +
						'a flex row — see `ButtonContainer`. Content comes through the default slot.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ href: '/tech' }}>
	{#snippet template(args)}
		<AnchorButton {...args}>View tech</AnchorButton>
	{/snippet}
</Story>

<!-- External links should carry both target and rel. -->
<Story
	name="External"
	args={{ href: 'https://github.com', target: '_blank', rel: 'noopener noreferrer' }}
>
	{#snippet template(args)}
		<AnchorButton {...args}>GitHub</AnchorButton>
	{/snippet}
</Story>

<!-- Because the component is flex-1, two side by side split the row evenly. -->
<Story name="Side By Side">
	{#snippet template()}
		<div style="display: flex; gap: 1rem;">
			<AnchorButton href="/tech">Tech</AnchorButton>
			<AnchorButton href="/bookmarks">Bookmarks</AnchorButton>
		</div>
	{/snippet}
</Story>
