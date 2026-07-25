<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TechIcon from './TechIcon.svelte';
	import { getTechIcon, techIconMap } from '../../../util/tech-icons';

	const { Story } = defineMeta({
		title: 'Domain/Tech/TechIcon',
		component: TechIcon,
		tags: ['autodocs'],
		argTypes: {
			icon: { control: false },
			size: { control: { type: 'range', min: 12, max: 96, step: 4 } }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Renders one entry from `techIconMap`, dispatching on the icon `kind` — Simple Icons ' +
						'components and Hugeicons take different props. Colour comes from `currentColor`, so ' +
						'the icon inherits whatever the surrounding text colour is. An unknown tech name ' +
						'yields `null` and the component renders nothing at all.'
				}
			}
		}
	});

	// Sorted so the gallery order stays stable across runs.
	const allNames = Object.keys(techIconMap).sort((a, b) => a.localeCompare(b));
</script>

<Story name="Simple Icon" args={{ icon: getTechIcon('TypeScript'), size: 48 }} />

<!-- The other branch of the kind check: a Hugeicons icon. -->
<Story name="Hugeicons Icon" args={{ icon: getTechIcon('Java'), size: 48 }} />

<!-- getTechIcon returns null for anything not in the map; nothing renders. -->
<Story name="Unknown Tech" args={{ icon: getTechIcon('Not A Real Technology'), size: 48 }} />

<!-- Icons use currentColor, so they take the colour of their container. -->
<Story name="Inherits Color">
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 1.5rem;">
			<span style="color: #10b981;"><TechIcon icon={getTechIcon('Svelte')} size={40} /></span>
			<span style="color: #8b5cf6;"><TechIcon icon={getTechIcon('Svelte')} size={40} /></span>
			<span style="opacity: 0.4;"><TechIcon icon={getTechIcon('Svelte')} size={40} /></span>
		</div>
	{/snippet}
</Story>

<!-- Every mapped tech, to catch a missing or broken icon at a glance. -->
<Story name="All Icons">
	{#snippet template()}
		<div
			style="display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 1rem;"
		>
			{#each allNames as name (name)}
				<div
					style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 0.75rem; text-align: center;"
				>
					<TechIcon icon={getTechIcon(name)} size={28} />
					<span style="font-size: 10px; opacity: 0.7; line-height: 1.3;">{name}</span>
				</div>
			{/each}
		</div>
	{/snippet}
</Story>
