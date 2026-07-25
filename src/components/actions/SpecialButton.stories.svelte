<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SpecialButton from './SpecialButton.svelte';

	const { Story } = defineMeta({
		title: 'Actions/SpecialButton',
		component: SpecialButton,
		tags: ['autodocs'],
		argTypes: {
			className: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A tag-style surface whose border becomes an animated conic gradient on hover, ' +
						'driven by the registered `--bg-angle` custom property. **Hover it** — the resting ' +
						'state is deliberately plain and the whole point of the component is the transition. ' +
						'Note it renders a `div`, not a `button`, so it is not focusable or clickable on its own.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<SpecialButton {...args}>Hover me</SpecialButton>
	{/snippet}
</Story>

<!-- The component is flex-1, so a row of them divides the available width. -->
<Story name="Row">
	{#snippet template()}
		<div style="display: flex; gap: 1rem;">
			<SpecialButton>TypeScript</SpecialButton>
			<SpecialButton>Svelte</SpecialButton>
			<SpecialButton>Tailwind</SpecialButton>
		</div>
	{/snippet}
</Story>

<Story name="Long Content">
	{#snippet template(args)}
		<SpecialButton {...args}>Infrastructure and platform engineering</SpecialButton>
	{/snippet}
</Story>
