<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AwsIcon from './AwsIcon.svelte';
	import DropwizardIcon from './DropwizardIcon.svelte';
	import EmotionIcon from './EmotionIcon.svelte';
	import OpenCodeIcon from './OpenCodeIcon.svelte';
	import PlaywrightIcon from './PlaywrightIcon.svelte';

	const { Story } = defineMeta({
		title: 'Icons/Gallery',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'All custom tech icons at a glance.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div
			style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; color: currentColor;"
		>
			<span title="AWS"><AwsIcon size={40} /></span>
			<span title="Dropwizard"><DropwizardIcon size={40} /></span>
			<span title="Emotion"><EmotionIcon size={40} /></span>
			<span title="OpenCode"><OpenCodeIcon size={40} /></span>
			<span title="Playwright"><PlaywrightIcon size={40} /></span>
		</div>
	{/snippet}
</Story>
