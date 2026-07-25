<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ButtonContainer from './ButtonContainer.svelte';
	import AnchorButton from './AnchorButton.svelte';

	const { Story } = defineMeta({
		title: 'Actions/ButtonContainer',
		component: ButtonContainer,
		tags: ['autodocs'],
		argTypes: {
			className: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Layout-only wrapper: stacks children vertically on small screens and switches to ' +
						'a horizontal row at the `md` breakpoint. Resize the preview to see it flip.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<ButtonContainer {...args}>
			<AnchorButton href="/tech">Tech</AnchorButton>
			<AnchorButton href="/bookmarks">Bookmarks</AnchorButton>
		</ButtonContainer>
	{/snippet}
</Story>

<Story name="Three Children">
	{#snippet template(args)}
		<ButtonContainer {...args}>
			<AnchorButton href="/tech">Tech</AnchorButton>
			<AnchorButton href="/bookmarks">Bookmarks</AnchorButton>
			<AnchorButton href="https://github.com" target="_blank" rel="noopener noreferrer">
				GitHub
			</AnchorButton>
		</ButtonContainer>
	{/snippet}
</Story>

<!-- Below md the children stack; this viewport forces that branch. -->
<Story name="Stacked (mobile)" parameters={{ viewport: { defaultViewport: 'mobile1' } }}>
	{#snippet template(args)}
		<ButtonContainer {...args}>
			<AnchorButton href="/tech">Tech</AnchorButton>
			<AnchorButton href="/bookmarks">Bookmarks</AnchorButton>
		</ButtonContainer>
	{/snippet}
</Story>
