<script lang="ts">
	import { stuckDetect } from '../util/stuck-detect';
</script>

<div
	use:stuckDetect
	class="section-header sticky top-[-1px] z-20 flex items-baseline justify-between py-3"
>
	<slot />
</div>

<style>
	.section-header {
		isolation: isolate;
		width: 100%;
	}

	.section-header :global(.section-title) {
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: 0.18em;
		transition:
			font-size 0.3s ease,
			letter-spacing 0.3s ease;
	}

	.section-header:global(.is-stuck) :global(.section-title) {
		font-size: 0.875rem;
		letter-spacing: 0.15em;
	}

	.section-header::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - 50vw);
		width: 100vw;
		z-index: -1;
		background-color: transparent;
		border-bottom: 1px solid transparent;
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			backdrop-filter 0.25s ease;
	}

	.section-header:global(.is-stuck)::before {
		background-color: rgb(255 255 255 / 0.75);
		border-bottom-color: rgb(226 232 240 / 0.8);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	:global(.dark) .section-header:global(.is-stuck)::before {
		background-color: rgb(2 6 23 / 0.75);
		border-bottom-color: rgb(30 41 59 / 0.8);
	}

	@media (prefers-reduced-motion: reduce) {
		.section-header::before,
		.section-header :global(.section-title) {
			transition: none;
		}
	}
</style>
