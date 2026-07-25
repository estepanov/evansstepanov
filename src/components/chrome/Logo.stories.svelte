<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Logo from './Logo.svelte';

	const { Story } = defineMeta({
		title: 'Chrome/Logo',
		component: Logo,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Full wordmark SVG with an animated shine pass. Uses `currentColor` for the base fill, ' +
						'so set a text colour on the wrapper to tint the logo.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="width: 12rem; height: 6rem; color: rgb(15 23 42);">
			<Logo />
		</div>
	{/snippet}
</Story>
