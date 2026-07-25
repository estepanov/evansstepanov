<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TechBackdrop from './TechBackdrop.svelte';

	const { Story } = defineMeta({
		title: 'Media/TechBackdrop',
		component: TechBackdrop,
		tags: ['autodocs'],
		argTypes: {
			tags: { control: 'object' },
			size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
			rows: { control: { type: 'range', min: 2, max: 12, step: 1 } },
			cols: { control: { type: 'range', min: 2, max: 12, step: 1 } }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Decorative tech-icon lattice rendered behind cards and heroes. Tags are mapped through ' +
						'`getTechIcon`; unknown names are skipped. Grid density upgrades on desktop after mount.'
				}
			}
		}
	});
</script>

<Story name="Default" args={{ tags: ['TypeScript', 'React', 'Svelte'] }}>
	{#snippet template(args)}
		<div
			style="position: relative; min-height: 12rem; border-radius: 1rem; border: 1px solid rgb(226 232 240 / 0.8); overflow: hidden;"
		>
			<TechBackdrop {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Dense" args={{ tags: ['TypeScript', 'React', 'Svelte'], rows: 10, cols: 10 }}>
	{#snippet template(args)}
		<div
			style="position: relative; min-height: 12rem; border-radius: 1rem; border: 1px solid rgb(226 232 240 / 0.8); overflow: hidden;"
		>
			<TechBackdrop {...args} />
		</div>
	{/snippet}
</Story>
