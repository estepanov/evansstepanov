<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Link from './Link.svelte';

	const { Story } = defineMeta({
		title: 'Actions/Link',
		component: Link,
		tags: ['autodocs'],
		argTypes: {
			href: { control: 'text' },
			target: { control: 'inline-radio', options: ['_self', '_blank'] },
			rel: { control: 'text' },
			onClick: { action: 'click' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A plain inline link with emerald hover. `rel` defaults to `noopener noreferrer` ' +
						'even for same-tab links. `onClick` is a plain callback prop, not a Svelte event.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ href: '/tech' }}>
	{#snippet template(args)}
		<Link {...args}>Tech I use</Link>
	{/snippet}
</Story>

<Story name="New Tab" args={{ href: 'https://github.com', target: '_blank' }}>
	{#snippet template(args)}
		<Link {...args}>GitHub</Link>
	{/snippet}
</Story>

<!-- Padding is responsive (py-1.5 px-2.5 below sm), so links sit apart in a nav row. -->
<Story name="In A Row">
	{#snippet template()}
		<nav style="display: flex; align-items: center;">
			<Link href="/">Home</Link>
			<Link href="/tech">Tech</Link>
			<Link href="/bookmarks">Bookmarks</Link>
		</nav>
	{/snippet}
</Story>
