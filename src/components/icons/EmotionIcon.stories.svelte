<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EmotionIcon from './EmotionIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/EmotionIcon',
		component: EmotionIcon,
		tags: ['autodocs'],
		argTypes: { size: { control: { type: 'number', min: 16, max: 96 } } },
		args: { size: 48 },
		parameters: {
			docs: {
				description: {
					component: 'Custom Emotion mark used by the tech icon registry.'
				}
			}
		}
	});
</script>

<Story name="Default" />
