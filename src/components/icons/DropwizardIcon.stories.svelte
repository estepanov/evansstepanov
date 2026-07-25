<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DropwizardIcon from './DropwizardIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/DropwizardIcon',
		component: DropwizardIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom Dropwizard mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
