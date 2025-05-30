<script lang="ts">
	import TagIcon from './TagIcon.svelte';

	export let tags: string[] = [];
	export let speed: number = 30; // Speed in seconds for one complete cycle
	export let iconSize: number = 24;
</script>

<div class="scrolling-container">
	<div class="scrolling-content" style="animation-duration: {speed}s;">
		{#each [...tags, ...tags, ...tags] as tag}
			<div class="tag-item">
				<TagIcon {tag} size={iconSize} />
			</div>
		{/each}
	</div>
</div>

<style>
	.scrolling-container {
		width: 100%;
		overflow: hidden;
		position: relative;
		white-space: nowrap;
		border-radius: 0.5rem;
		padding: 0.5rem 0;
		mask: linear-gradient(
			to right,
			transparent 0%,
			black 3rem,
			black calc(100% - 3rem),
			transparent 100%
		);
		-webkit-mask: linear-gradient(
			to right,
			transparent 0%,
			black 3rem,
			black calc(100% - 3rem),
			transparent 100%
		);
	}

	.scrolling-content {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		animation: scroll linear infinite;
		will-change: transform;
	}

	.scrolling-container:hover .scrolling-content {
		animation-play-state: paused;
	}

	.tag-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		opacity: 0.8;
		transition: opacity 0.2s ease;
		flex-shrink: 0;
	}

	.tag-item:hover {
		@apply text-emerald-700 dark:text-emerald-400;
		opacity: 1;
		transform: scale(1.2);
		transition: all 0.2s ease;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
