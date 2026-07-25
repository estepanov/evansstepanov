<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LazyLoadImage from './LazyLoadImage.svelte';

	const { Story } = defineMeta({
		title: 'Media/LazyLoadImage',
		component: LazyLoadImage,
		tags: ['autodocs'],
		argTypes: {
			src: { control: 'text' },
			alt: { control: 'text' },
			shouldLoad: { control: 'boolean' },
			classNames: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Deferred image loader with a pulse/spinner placeholder. When `shouldLoad` is true the ' +
						'src is fetched (with a short delay) and cached via `imageCache`.'
				}
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		src: '/favicon.png',
		alt: 'Site favicon',
		shouldLoad: true,
		classNames: 'rounded-md object-cover'
	}}
/>

<Story
	name="Loading"
	args={{
		src: '/favicon.png',
		alt: 'Site favicon',
		shouldLoad: false,
		classNames: 'rounded-md object-cover'
	}}
/>
