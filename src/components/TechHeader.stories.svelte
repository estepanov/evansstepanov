<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TechHeader from './TechHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/TechHeader',
		component: TechHeader,
		tags: ['autodocs'],
		argTypes: {
			rootLabel: { control: 'text' },
			rootHref: { control: 'text' },
			leaf: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Breadcrumb header for section routes. With no `leaf` it shows a single root crumb; ' +
						'with one it renders a linked root plus the leaf. The header and crumbs animate in on ' +
						'mount, and the animation is dropped under `prefers-reduced-motion`. The leaf is printed ' +
						'verbatim, so it should already be display-ready.'
				}
			}
		}
	});
</script>

<!-- Index state: one crumb, no link. -->
<Story name="Index" args={{ leaf: undefined }} />

<Story name="With Leaf" args={{ leaf: 'typescript' }} />

<!-- The leaf crumb is `truncate`, so overlong labels clip rather than wrap. -->
<Story name="Long Leaf" args={{ leaf: 'model-context-protocol-server-tooling' }} />

<Story
	name="Work"
	args={{ rootLabel: 'Work', rootHref: '/work', leaf: 'Cursor' }}
/>
