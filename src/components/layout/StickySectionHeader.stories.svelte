<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StickySectionHeader from './StickySectionHeader.svelte';

	const { Story } = defineMeta({
		title: 'Layout/StickySectionHeader',
		component: StickySectionHeader,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Sticky section chrome. Scroll the story canvas to see the stuck styles (`is-stuck`) engage.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="min-height: 120vh;">
			<StickySectionHeader>
				<h2 class="section-title">Projects</h2>
			</StickySectionHeader>
			<p style="margin-top: 2rem; opacity: 0.7;">Scroll to pin the header.</p>
		</div>
	{/snippet}
</Story>
