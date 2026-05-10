<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, type ThemeMode } from '$lib/theme.svelte';

	let button = $state<HTMLButtonElement | null>(null);
	let visible = $state(true);

	const label: Record<ThemeMode, string> = {
		light: 'Theme: light. Click for dark.',
		dark: 'Theme: dark. Click for system.',
		system: 'Theme: system. Click for light.'
	};

	onMount(() => {
		if (!button || !('IntersectionObserver' in window)) return;
		const io = new IntersectionObserver(
			(entries) => {
				visible = entries[0]?.isIntersecting ?? true;
			},
			{ threshold: 0 }
		);
		io.observe(button);

		const onVis = () => {
			if (document.hidden) visible = false;
			else if (button) {
				const r = button.getBoundingClientRect();
				visible = r.bottom > 0 && r.top < innerHeight;
			}
		};
		document.addEventListener('visibilitychange', onVis);
		return () => {
			io.disconnect();
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<button
	bind:this={button}
	type="button"
	class="theme-toggle"
	class:is-dark={theme.resolved === 'dark'}
	class:is-system={theme.mode === 'system'}
	class:is-visible={visible}
	aria-label={label[theme.mode]}
	title={label[theme.mode]}
	onclick={() => theme.cycle()}
>
	<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
		<defs>
			<mask id="moon-mask">
				<rect width="32" height="32" fill="white" />
				<circle class="mask-circle" cx="24" cy="10" r="8" fill="black" />
			</mask>
		</defs>

		<!-- Sun rays / dark-mode stars share the same group; opacity gates which mode they belong to -->
		<g class="rays">
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="16" y1="26" x2="16" y2="30" />
			<line x1="2" y1="16" x2="6" y2="16" />
			<line x1="26" y1="16" x2="30" y2="16" />
			<line x1="6" y1="6" x2="9" y2="9" />
			<line x1="23" y1="23" x2="26" y2="26" />
			<line x1="6" y1="26" x2="9" y2="23" />
			<line x1="23" y1="9" x2="26" y2="6" />
		</g>

		<circle class="orb" cx="16" cy="16" r="7" mask="url(#moon-mask)" />

		<g class="stars" aria-hidden="true">
			<circle class="star star-a" cx="6" cy="8" r="0.9" />
			<circle class="star star-b" cx="26" cy="22" r="0.7" />
		</g>
	</svg>
</button>

<style>
	.theme-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 50;
		width: 2.5rem;
		height: 2.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(0, 0, 0, 0.08);
		color: #1f2937;
		cursor: pointer;
		transition: background 240ms ease, border-color 240ms ease, color 240ms ease;
		-webkit-tap-highlight-color: transparent;
	}
	:global(.dark) .theme-toggle {
		background: rgba(17, 17, 17, 0.55);
		border-color: rgba(255, 255, 255, 0.1);
		color: #f3f4f6;
	}
	.theme-toggle:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.theme-toggle svg {
		width: 1.25rem;
		height: 1.25rem;
		overflow: visible;
	}

	/* Compositor-only steady state; promote to its own layer once. */
	.orb,
	.rays,
	.stars,
	.mask-circle {
		transform: translateZ(0);
	}

	.orb {
		fill: currentColor;
		transition: r 420ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.mask-circle {
		transform-origin: 24px 10px;
		transform: scale(0);
		transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.is-dark .mask-circle {
		transform: scale(1);
	}

	.rays {
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		transform-origin: 16px 16px;
		transition: opacity 320ms ease, transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 1;
	}
	.is-dark .rays {
		opacity: 0;
		transform: scale(0.4);
	}

	.stars {
		fill: currentColor;
		opacity: 0;
		transition: opacity 320ms ease;
	}
	.is-dark .stars {
		opacity: 1;
	}

	/* Ambient loop — paused unless visible AND in dark mode. */
	.star {
		transform-origin: center;
		animation-play-state: paused;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}
	.star-a {
		animation-name: star-drift-a;
		animation-duration: 12s;
	}
	.star-b {
		animation-name: star-drift-b;
		animation-duration: 17s;
	}
	.is-dark.is-visible .star {
		animation-play-state: running;
	}
	.is-system.is-dark.is-visible .star {
		animation-duration: 18s, 26s;
	}

	@keyframes star-drift-a {
		from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.6; }
		to { transform: translate3d(2px, 1px, 0) scale(1.4); opacity: 1; }
	}
	@keyframes star-drift-b {
		from { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
		to { transform: translate3d(-2px, -1.5px, 0) scale(0.7); opacity: 0.5; }
	}

	/* Light-mode ambient — gentle ray pulse */
	.rays {
		animation: ray-breathe 14s ease-in-out infinite alternate;
		animation-play-state: paused;
	}
	.theme-toggle:not(.is-dark).is-visible .rays {
		animation-play-state: running;
	}
	@keyframes ray-breathe {
		from { transform: scale(1) rotate(0deg); }
		to { transform: scale(1.06) rotate(8deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.orb,
		.rays,
		.mask-circle,
		.stars,
		.theme-toggle {
			transition: none !important;
		}
		.star,
		.rays {
			animation: none !important;
		}
	}
</style>
