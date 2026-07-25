<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SimpleSpinner from './SimpleSpinner.svelte';

	const { Story } = defineMeta({
		title: 'Components/SimpleSpinner',
		component: SimpleSpinner,
		tags: ['autodocs'],
		argTypes: {
			size: { control: { type: 'range', min: 12, max: 120, step: 4 } },
			color: { control: 'color' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A CSS-only rotating ring. **Not theme-aware**: `color` defaults to `#000` and the ' +
						'track is a hardcoded `rgba(0, 0, 0, 0.1)`, so the default renders nearly invisible ' +
						'against the dark background. Callers currently have to pass a colour themselves — ' +
						'switch this story to the dark theme to see it. It also has no `role="status"` or ' +
						'accessible label.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ size: 40, color: '#000' }} />

<!-- Toggle the theme on this story: the default black ring disappears in dark mode. -->
<Story name="Emerald" args={{ size: 40, color: '#10b981' }} />

<Story name="Sizes">
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 1.5rem;">
			<SimpleSpinner size={16} color="#10b981" />
			<SimpleSpinner size={32} color="#10b981" />
			<SimpleSpinner size={64} color="#10b981" />
		</div>
	{/snippet}
</Story>
