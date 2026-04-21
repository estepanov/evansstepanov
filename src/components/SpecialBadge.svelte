<script lang="ts">
	export let className: string = '';
	export let variant: 'emerald' | 'subtle' = 'emerald';
</script>

<div class={`inline-flex flex-row justify-center items-center ${className}`}>
	<!-- <span class="bg-gradient-to-tr from-emerald-600 to-emerald-400 w-3 h-3 rounded-full"></span> -->
	<span class="animated-badge font-bold tracking-widest {variant === 'subtle' ? 'subtle' : ''}">
		<slot />
	</span>
</div>

<style lang="postcss">
	.animated-badge {
        /* @apply shadow-sm; */
        text-shadow: 1px 1px white;
		@apply px-3 py-1 text-xs ml-2 uppercase rounded-full;
		@apply text-emerald-600 dark:text-emerald-100;
		@apply border border-emerald-300 dark:border-emerald-600;
		@apply relative;
		background: linear-gradient(
			90deg,
            theme('colors.emerald.500 / 0.10'),
            theme('colors.emerald.600 / 0.20'),
            theme('colors.emerald.500 / 0.10')
		);
		background-size: 200% 100%;
		animation: gradient-slide 3s linear infinite;
	}

	.animated-badge::after {
		content: '';
		@apply absolute inset-0 rounded-full;
		box-shadow: 0 0 10px theme('colors.emerald.900 / 0.2');
		animation: glow 2s ease-in-out infinite alternate;
	}

	.animated-badge.subtle {
		@apply text-slate-600 dark:text-slate-200;
		@apply border-slate-400/50 dark:border-slate-500/50;
		background: linear-gradient(
			90deg,
			theme('colors.slate.400 / 0.08'),
			theme('colors.slate.500 / 0.18'),
			theme('colors.slate.400 / 0.08')
		);
		background-size: 200% 100%;
		animation: gradient-slide 5s linear infinite;
	}

	.animated-badge.subtle::after {
		box-shadow: 0 0 8px theme('colors.slate.600 / 0.15');
		animation: glow-subtle 3s ease-in-out infinite alternate;
	}

	@keyframes glow-subtle {
		0% {
			box-shadow: 0 0 4px theme('colors.slate.600 / 0.1');
		}
		100% {
			box-shadow: 0 0 10px theme('colors.slate.600 / 0.2');
		}
	}

	@keyframes gradient-slide {
		0% {
			background-position: 100% 0%;
		}
		100% {
			background-position: -100% 0%;
		}
	}

	@keyframes glow {
		0% {
			box-shadow: 0 0 5px theme('colors.emerald.900 / 0.15');
		}
		100% {
			box-shadow: 0 0 15px theme('colors.emerald.900 / 0.25');
		}
	}

	@media (prefers-color-scheme: dark) {
		.animated-badge {
            text-shadow: 1px 1px black;
			background: linear-gradient(
				45deg,
				theme('colors.emerald.900 / 0.3'),
				theme('colors.emerald.600 / 0.4'),
				theme('colors.emerald.900 / 0.3')
			);
			background-size: 200% 100%;
			animation: gradient-slide 3s linear infinite;
		}

		.animated-badge::after {
			box-shadow: 0 0 10px theme('colors.emerald.400 / 0.3');
			animation: glow-dark 1.5s ease-in-out infinite alternate;
		}

		@keyframes glow-dark {
			0% {
				box-shadow: 0 0 5px theme('colors.emerald.400 / 0.2');
			}
			100% {
				box-shadow: 0 0 15px theme('colors.emerald.400 / 0.4');
			}
		}

		.animated-badge.subtle {
			background: linear-gradient(
				45deg,
				theme('colors.slate.700 / 0.25'),
				theme('colors.slate.500 / 0.35'),
				theme('colors.slate.700 / 0.25')
			);
			background-size: 200% 100%;
			animation: gradient-slide 5s linear infinite;
		}

		.animated-badge.subtle::after {
			box-shadow: 0 0 8px theme('colors.slate.400 / 0.2');
			animation: glow-subtle-dark 3s ease-in-out infinite alternate;
		}

		@keyframes glow-subtle-dark {
			0% {
				box-shadow: 0 0 4px theme('colors.slate.400 / 0.15');
			}
			100% {
				box-shadow: 0 0 12px theme('colors.slate.400 / 0.3');
			}
		}
	}
</style>
