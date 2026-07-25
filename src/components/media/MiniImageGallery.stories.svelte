<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MiniImageGallery from './MiniImageGallery.svelte';

	const fixtureImages = [
		{ url: '/favicon.png', alt: 'Favicon' },
		{ url: '/small.png', alt: 'Profile thumbnail' },
		{ url: '/logo/logo.svg', alt: 'Logo mark' }
	];

	const { Story } = defineMeta({
		title: 'Media/MiniImageGallery',
		component: MiniImageGallery,
		tags: ['autodocs'],
		argTypes: {
			isOpen: { control: 'boolean' },
			images: { control: false }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Horizontal strip of lazy-loaded thumbnails inside an expandable panel. Click a ' +
						'thumbnail to open a full-size modal overlay.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ isOpen: true, images: fixtureImages }} />

<Story name="Closed" args={{ isOpen: false, images: fixtureImages }} />
