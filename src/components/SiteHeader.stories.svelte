<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SiteHeader from './SiteHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/SiteHeader',
		component: SiteHeader,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			eyebrow: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Page header: a home link wrapping `LogoIcon`, plus an optional eyebrow and title. ' +
						'The whole text block is omitted when both are empty. The title is `truncate`, so ' +
						'long values clip rather than wrap.'
				}
			}
		}
	});
</script>

<Story name="Title And Eyebrow" args={{ eyebrow: 'Collection', title: 'Bookmarks' }} />

<Story name="Title Only" args={{ title: 'Bookmarks' }} />

<Story name="Eyebrow Only" args={{ eyebrow: 'Collection' }} />

<!-- Neither prop set: only the logo link renders. -->
<Story name="Logo Only" args={{}} />

<!-- The title is `truncate`, so it clips with an ellipsis instead of wrapping. -->
<Story
	name="Long Title"
	args={{
		eyebrow: 'Collection',
		title: 'A deliberately long page title that will not fit on one line'
	}}
/>
