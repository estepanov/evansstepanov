<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TopicHero from './TopicHero.svelte';

	const { Story } = defineMeta({
		title: 'Domain/Tech/TopicHero',
		component: TopicHero,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'Tech-page hero shell: `TechBackdrop` plus a slotted content area.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ tags: ['TypeScript', 'Svelte', 'Playwright'] }}>
	{#snippet template(args)}
		<TopicHero {...args}>
			<h1 style="font-size: 1.75rem; font-weight: 700;">TypeScript</h1>
			<p style="opacity: 0.75;">Slotted hero copy.</p>
		</TopicHero>
	{/snippet}
</Story>
