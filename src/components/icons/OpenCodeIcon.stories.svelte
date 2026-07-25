<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import OpenCodeIcon from './OpenCodeIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/OpenCodeIcon',
		component: OpenCodeIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom OpenCode mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
