<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StatusIndicator from './StatusIndicator.svelte';

	const { Story } = defineMeta({
		title: 'Feedback/StatusIndicator',
		component: StatusIndicator,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			// Explicit enum types: svelte-csf infers TS unions as `union`, which Storybook's
			// URL-args coercion (mapArgsToTypes) silently drops.
			variant: {
				control: 'inline-radio',
				options: ['emerald', 'subtle'],
				type: { name: 'enum', value: ['emerald', 'subtle'] }
			},
			animation: {
				control: 'inline-radio',
				options: ['ping', 'orbit'],
				type: { name: 'enum', value: ['ping', 'orbit'] }
			},
			className: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A small dot-plus-label badge. Colours are driven by `--status-*` custom ' +
						'properties set per variant (`emerald`, `subtle`), so variants differ in hue only. ' +
						'The `animation` prop picks the motion: `ping` pulses an expanding halo, `orbit` ' +
						'sweeps a satellite around a static ring (used by the work-grid cards for ' +
						'active/in-progress items). Both animations are disabled under ' +
						'`prefers-reduced-motion`.'
				}
			}
		}
	});
</script>

<Story name="Emerald" args={{ label: 'Now', variant: 'emerald' }} />

<Story name="Subtle" args={{ label: 'Archived', variant: 'subtle' }} />

<!-- The label is uppercased in CSS and letter-spaced, so long text gets wide. -->
<Story name="Custom Label" args={{ label: 'Currently building', variant: 'emerald' }} />

<Story name="Orbit Emerald" args={{ label: 'Now', variant: 'emerald', animation: 'orbit' }} />

<Story name="Orbit Subtle" args={{ label: 'In progress', variant: 'subtle', animation: 'orbit' }} />

<!-- Variant is fixed per row here (that's the point of the story), so its control is hidden. -->
<Story
	name="Both Variants"
	args={{ label: 'Now', animation: 'ping' }}
	parameters={{ controls: { exclude: ['variant'] } }}
>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
			<StatusIndicator label={args.label} variant="emerald" animation={args.animation} />
			<StatusIndicator label={args.label} variant="subtle" animation={args.animation} />
		</div>
	{/snippet}
</Story>
