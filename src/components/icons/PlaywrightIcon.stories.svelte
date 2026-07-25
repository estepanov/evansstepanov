<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PlaywrightIcon from './PlaywrightIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/PlaywrightIcon',
		component: PlaywrightIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom Playwright mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
