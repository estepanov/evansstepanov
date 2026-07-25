<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AwsIcon from './AwsIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/AwsIcon',
		component: AwsIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom AWS mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
