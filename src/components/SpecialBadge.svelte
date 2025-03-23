<script lang="ts">
	export let className: string = '';
</script>

<div class={`inline-flex flex-row justify-center items-center ${className}`}>
	<!-- <span class="bg-gradient-to-tr from-emerald-600 to-emerald-400 w-3 h-3 rounded-full"></span> -->
	<span class="animated-badge font-bold tracking-widest">
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
	}
</style>
