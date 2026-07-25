<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LinksSection from './LinksSection.svelte';
	import { sampleLinks } from './fixtures/sampleLinks';

	const { Story } = defineMeta({
		title: 'Domain/Links/LinksSection',
		component: LinksSection,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Responsive grid of external links. Composes the public `LinkItem` container; ' +
						'Fathom may no-op harmlessly in Storybook.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ links: sampleLinks }} />
