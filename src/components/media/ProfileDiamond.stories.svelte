<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProfileDiamond from './ProfileDiamond.svelte';

	const { Story } = defineMeta({
		title: 'Media/ProfileDiamond',
		component: ProfileDiamond,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Animated profile portrait clipped to a morphing diamond, with orbiting emoji and ' +
						'sparkle icons. Mouse (desktop) or scroll (coarse pointer) drives the parallax.'
				}
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div style="max-width: 28rem; padding: 1rem;">
			<p style="line-height: 1.6;">
				<ProfileDiamond />
				Decorative float-right profile diamond with interactive motion. Resize or scroll to see
				parallax and orbit effects.
			</p>
		</div>
	{/snippet}
</Story>
