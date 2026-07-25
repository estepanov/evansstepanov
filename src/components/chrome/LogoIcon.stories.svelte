<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LogoIcon from './LogoIcon.svelte';

	const { Story } = defineMeta({
		title: 'Chrome/LogoIcon',
		component: LogoIcon,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Compact E.S. monogram used in the site header home link. Fills with `currentColor`.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="width: 2.5rem; height: 2.5rem; color: currentColor;">
			<LogoIcon />
		</div>
	{/snippet}
</Story>
