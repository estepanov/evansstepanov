<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterQuote from './FooterQuote.svelte';

	const edison = {
		text: "I have not failed. I've just found 10,000 ways that won't work.",
		attribution: 'Thomas A. Edison'
	};

	const { Story } = defineMeta({
		title: 'Chrome/FooterQuote',
		component: FooterQuote,
		tags: ['autodocs'],
		args: {
			fallback: edison,
			quotes: [edison]
		},
		parameters: {
			docs: {
				description: {
					component:
						'Home-only footer quote. Server HTML always shows the Edison fallback so route cache ' +
						'cannot freeze a random pick; `client:load` may shuffle among `quotes` after hydrate.'
				}
			}
		}
	});
</script>

<Story name="Edison Fallback" />

<Story
	name="Several Quotes"
	args={{
		fallback: edison,
		quotes: [
			edison,
			{ text: 'Stay hungry. Stay foolish.', attribution: 'Steve Jobs' },
			{ text: 'Do or do not. There is no try.', attribution: 'Yoda' }
		]
	}}
/>
