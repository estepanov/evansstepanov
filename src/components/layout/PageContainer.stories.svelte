<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PageContainer from './PageContainer.svelte';

	const { Story } = defineMeta({
		title: 'Layout/PageContainer',
		component: PageContainer,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Centered page shell: `max-w-5xl`, horizontal padding, column flex. Pass extra classes via `class`.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<PageContainer>
			<p>Page content</p>
		</PageContainer>
	{/snippet}
</Story>
