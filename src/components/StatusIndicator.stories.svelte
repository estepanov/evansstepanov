<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StatusIndicator from './StatusIndicator.svelte';

	const { Story } = defineMeta({
		title: 'Components/StatusIndicator',
		component: StatusIndicator,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			variant: { control: 'inline-radio', options: ['emerald', 'subtle'] },
			className: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A small dot-plus-label badge with a pinging halo. The dot colour is driven by ' +
						'`--status-color` custom properties set per variant, so the two variants differ ' +
						'in hue only. The ping animation is disabled under `prefers-reduced-motion`.'
				}
			}
		}
	});
</script>

<Story name="Emerald" args={{ label: 'Now', variant: 'emerald' }} />

<Story name="Subtle" args={{ label: 'Archived', variant: 'subtle' }} />

<!-- The label is uppercased in CSS and letter-spaced, so long text gets wide. -->
<Story name="Custom Label" args={{ label: 'Currently building', variant: 'emerald' }} />

<Story name="Both Variants">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
			<StatusIndicator label="Now" variant="emerald" />
			<StatusIndicator label="Archived" variant="subtle" />
		</div>
	{/snippet}
</Story>
