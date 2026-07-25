<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Section from './Section.svelte';

	const { Story } = defineMeta({
		title: 'Components/Section',
		component: Section,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A titled content block. The `title` prop is rendered with `{@html}`, so it accepts ' +
						'inline markup — but it must never receive untrusted input. When `title` is empty ' +
						'the component falls back to a named `title` slot instead.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ title: 'Projects' }}>
	{#snippet template(args)}
		<Section {...args}>
			<p>Section body content goes in the default slot.</p>
		</Section>
	{/snippet}
</Story>

<!-- title is rendered via {@html}, so inline markup works. Trusted input only. -->
<Story name="Markup In Title" args={{ title: 'Work <em>&amp; play</em>' }}>
	{#snippet template(args)}
		<Section {...args}>
			<p>The title above contains an <code>&lt;em&gt;</code> element.</p>
		</Section>
	{/snippet}
</Story>

<!-- With no title prop, the named `title` slot takes over. -->
<Story name="Title Slot Fallback" args={{ title: '' }}>
	{#snippet template(args)}
		<Section {...args}>
			<span slot="title" style="display: inline-flex; align-items: center; gap: 0.5rem;">
				<span style="font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
					Custom heading
				</span>
			</span>
			<p>Rendered through the named slot rather than the prop.</p>
		</Section>
	{/snippet}
</Story>
