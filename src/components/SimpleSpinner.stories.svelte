<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SimpleSpinner from './SimpleSpinner.svelte';

	const { Story } = defineMeta({
		title: 'Components/SimpleSpinner',
		component: SimpleSpinner,
		tags: ['autodocs'],
		argTypes: {
			size: { control: { type: 'range', min: 12, max: 120, step: 4 } },
			color: { control: 'text' },
			label: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A CSS-only rotating ring. `color` defaults to `currentColor`, so the spinner takes ' +
						'the surrounding text colour and stays visible in both themes; the track is derived ' +
						'from that same colour. Ring thickness scales with `size`. It exposes ' +
						'`role="status"` with a configurable `label`, and slows rather than stops under ' +
						'`prefers-reduced-motion`.'
				}
			}
		}
	});
</script>

<!-- Default inherits the page text colour — toggle the theme to see it adapt. -->
<Story name="Default" args={{ size: 40 }} />

<Story name="Custom Color" args={{ size: 40, color: '#10b981' }} />

<!-- currentColor means a caller can theme it by setting `color` on any ancestor. -->
<Story name="Inherits Color">
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 1.5rem;">
			<span style="color: #10b981;"><SimpleSpinner size={40} /></span>
			<span style="color: #8b5cf6;"><SimpleSpinner size={40} /></span>
			<span style="opacity: 0.5;"><SimpleSpinner size={40} /></span>
		</div>
	{/snippet}
</Story>

<!-- Thickness is max(2px, size / 10), so small sizes stay legible. -->
<Story name="Sizes">
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 1.5rem;">
			<SimpleSpinner size={16} />
			<SimpleSpinner size={32} />
			<SimpleSpinner size={64} />
		</div>
	{/snippet}
</Story>

<Story name="Custom Label" args={{ size: 40, label: 'Fetching projects' }} />
