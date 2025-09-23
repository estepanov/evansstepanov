<script lang="ts">
	export let className: string = '';
</script>

<div
	class={`tag-highlighter flex-1 px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/70 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 ${className}`}
>
	<slot />
</div>

<style lang="postcss">
	@property --bg-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	@keyframes spinnner {
		to {
			--bg-angle: 360deg;
		}
	}

	.tag-highlighter {
		transform: scale(1);
		position: relative;
		background: transparent;
		z-index: 0;
		@apply transition-all duration-300 ease-in-out;
		@apply text-gray-700 dark:text-gray-300;
	}

	.tag-highlighter:hover {
		transform: scale(1.03);
		border-color: transparent;
		@apply text-emerald-500;
		@apply shadow-lg shadow-slate-300/30 dark:shadow-slate-900/50;
	}

	.tag-highlighter::before {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		bottom: -1px;
		left: -1px;
		z-index: -1;
		border-radius: inherit;
		border: 1px solid transparent;
		opacity: 0;
		background:
			linear-gradient(to bottom, transparent, transparent) padding-box,
			conic-gradient(from var(--bg-angle), transparent, transparent) border-box;
		animation: paused;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: paused;
	}

	.tag-highlighter:hover:before {
		animation: spinnner 3s linear infinite;
		background:
			linear-gradient(
					to bottom,
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.7'),
					theme('colors.emerald.500 / 0.1')
				)
				padding-box,
			conic-gradient(
					from var(--bg-angle),
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.7')
				)
				border-box;
		opacity: 1;
	}

	@media (prefers-color-scheme: dark) {
		.tag-highlighter:hover:before {
			animation: spinnner 3s linear infinite;
			background:
				linear-gradient(
						to bottom,
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.7'),
						theme('colors.emerald.500 / 0.1')
					)
					padding-box,
				conic-gradient(
						from var(--bg-angle),
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.7')
					)
					border-box;
			opacity: 1;
		}
		.tag-highlighter::before {
			opacity: 0;
			background:
				linear-gradient(to bottom, transparent, transparent) padding-box,
				conic-gradient(from var(--bg-angle), transparent, transparent) border-box;
			animation: paused;
		}
	}
</style>
