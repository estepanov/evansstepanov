<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ThemeToggle from './ThemeToggle.svelte';

	const { Story } = defineMeta({
		title: 'Chrome/ThemeToggle',
		component: ThemeToggle,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'The site-wide theme switch, cycling light → dark → system. Two things to know when ' +
						'viewing it here:\n\n' +
						'- It is `position: fixed`, so it pins to the bottom-right of the preview frame ' +
						'rather than sitting inline.\n' +
						'- It drives the real `ThemeController`, which writes the `dark` class straight onto ' +
						"`<html>` and persists to `localStorage`. That is the same element Storybook's theme " +
						'toolbar targets, so the two will disagree until you change one of them again. ' +
						'Clicking the toggle is the source of truth in this story.\n\n' +
						'The icon morphs between sun and moon via an SVG mask, and the star drift animation ' +
						'only runs while the button is on screen and the document is visible.'
				}
			}
		}
	});
</script>

<!-- Fixed positioning means this renders in the corner of the frame, not inline. -->
<Story name="Default" />

<!-- Some vertical space, to make the fixed positioning obvious against content. -->
<Story name="Over Page Content">
	{#snippet template()}
		<div style="min-height: 60vh; max-width: 42ch;">
			<h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">Page content</h2>
			<p style="opacity: 0.75; line-height: 1.6;">
				The toggle sits fixed in the bottom-right corner. Click it to cycle light, dark, and system.
				Watch the sun collapse into a moon and the stars fade in.
			</p>
		</div>
		<ThemeToggle />
	{/snippet}
</Story>
