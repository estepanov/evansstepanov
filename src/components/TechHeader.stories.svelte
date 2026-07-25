<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TechHeader from './TechHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/TechHeader',
		component: TechHeader,
		tags: ['autodocs'],
		argTypes: {
			slug: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Breadcrumb header for the `/tech` routes. With no `slug` it shows a single "Tech" ' +
						'crumb; with one it renders a linked root plus the leaf. The header and crumbs ' +
						'animate in on mount, and the animation is dropped under `prefers-reduced-motion`. ' +
						'The slug is printed verbatim, so it should already be display-ready.'
				}
			}
		}
	});
</script>

<!-- Index state: one crumb, no link. -->
<Story name="Index" args={{ slug: undefined }} />

<Story name="With Slug" args={{ slug: 'typescript' }} />

<!-- The leaf crumb is `truncate`, so overlong slugs clip rather than wrap. -->
<Story name="Long Slug" args={{ slug: 'model-context-protocol-server-tooling' }} />
