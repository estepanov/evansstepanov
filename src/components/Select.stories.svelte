<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Select from './Select.svelte';

	const { Story } = defineMeta({
		title: 'Components/Select',
		component: Select,
		tags: ['autodocs'],
		argTypes: {
			options: { control: 'object' },
			value: { control: false },
			placeholder: { control: 'text' },
			ariaLabel: { control: 'text' },
			class: { control: 'text' }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A custom listbox built on the ARIA listbox pattern: the trigger opens a menu, ' +
						'the `ul` owns keyboard handling, and options receive focus programmatically. ' +
						'Emits a `change` event with the selected value.'
				}
			}
		}
	});

	const sortOptions = [
		{ value: 'recent', label: 'Most recent' },
		{ value: 'oldest', label: 'Oldest first' },
		{ value: 'alpha', label: 'A to Z' }
	];

	const countedOptions = [
		{ value: 'all', label: 'All', meta: '48' },
		{ value: 'language', label: 'Languages', meta: '12' },
		{ value: 'framework', label: 'Frameworks', meta: '19' },
		{ value: 'tooling', label: 'Tooling', meta: '17' }
	];

	const manyOptions = Array.from({ length: 24 }, (_, i) => ({
		value: `opt-${i}`,
		label: `Option ${i + 1}`,
		meta: `${(i + 1) * 3}`
	}));
</script>

<script lang="ts">
	// Local state for the interactive story, so selecting an option sticks.
	let liveValue = $state<string | null>('framework');
</script>

<!-- Nothing selected: the trigger falls back to the placeholder. -->
<Story
	name="Default"
	args={{ options: sortOptions, value: null, placeholder: 'Sort', ariaLabel: 'Sort order' }}
/>

<!-- A selected value replaces the placeholder and gets a check in the menu. -->
<Story
	name="Selected"
	args={{ options: sortOptions, value: 'alpha', placeholder: 'Sort', ariaLabel: 'Sort order' }}
/>

<!-- The optional `meta` field renders right-aligned, in tabular numerals. -->
<Story
	name="With Meta"
	args={{
		options: countedOptions,
		value: 'all',
		placeholder: 'Filter',
		ariaLabel: 'Filter by category'
	}}
/>

<!-- Labels are `white-space: nowrap`, so the menu grows rather than wrapping. -->
<Story
	name="Long Labels"
	args={{
		options: [
			{ value: 'a', label: 'Infrastructure and platform engineering' },
			{ value: 'b', label: 'Frontend architecture and design systems' },
			{ value: 'c', label: 'Short one' }
		],
		value: 'b',
		placeholder: 'Discipline',
		ariaLabel: 'Discipline'
	}}
/>

<!-- The menu has no max-height, so a long list runs past the viewport.
     Worth seeing before this component gets used in anger. -->
<Story
	name="Many Options"
	args={{ options: manyOptions, value: null, placeholder: 'Pick one', ariaLabel: 'Pick one' }}
/>

<!-- Two-way: the component assigns to `value`, so binding keeps the selection. -->
<Story name="Interactive" args={{ options: countedOptions }}>
	{#snippet template(args)}
		<div style="display: flex; align-items: center; gap: 1rem;">
			<Select
				{...args}
				bind:value={liveValue}
				placeholder="Filter"
				ariaLabel="Filter by category"
			/>
			<span style="font-size: 12px; opacity: 0.7;">value: {liveValue ?? 'null'}</span>
		</div>
	{/snippet}
</Story>
