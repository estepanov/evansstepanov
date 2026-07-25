<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, type ThemeMode } from '$lib/theme.svelte';

	let button = $state<HTMLButtonElement | null>(null);
	let visible = $state(true);
	let labelVisible = $state(false);
	let labelMode = $state<ThemeMode>(theme.mode);
	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let initialized = false;

	const label: Record<ThemeMode, string> = {
		light: 'Theme: light. Click for dark.',
		dark: 'Theme: dark. Click for system.',
		system: 'Theme: system. Click for light.'
	};

	const modeName: Record<ThemeMode, string> = {
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	};

	$effect(() => {
		const mode = theme.mode;
		if (!initialized) {
			initialized = true;
			labelMode = mode;
			return;
		}
		labelMode = mode;
		labelVisible = true;
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			labelVisible = false;
			hideTimer = null;
		}, 1400);
	});

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
	<span
		class="mode-label"
		class:is-visible={labelVisible}
		aria-live="polite"
		aria-atomic="true"
	>
		<span class="mode-label__text">{modeName[labelMode]}</span>
	</span>
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
			<circle class="star star-c" cx="9" cy="25" r="0.55" />
		</g>
	</svg>
	<span class="halo" aria-hidden="true"></span>
	<span class="ripple" aria-hidden="true"></span>
	{#if theme.mode === 'system'}
		<span class="system-badge" aria-hidden="true">
			<svg viewBox="0 0 12 12" focusable="false">
				<rect x="1.25" y="2" width="9.5" height="6.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.1" />
				<line x1="4" y1="10" x2="8" y2="10" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
			</svg>
		</span>
	{/if}
</button>

<style>
	.theme-toggle {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 50;
		width: 2.75rem;
		height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.65);
		backdrop-filter: blur(10px) saturate(140%);
		-webkit-backdrop-filter: blur(10px) saturate(140%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		color: #1f2937;
		cursor: pointer;
		transition:
			background 240ms ease,
			border-color 240ms ease,
			color 240ms ease,
			transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 380ms ease;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.06),
			0 8px 24px -12px rgba(0, 0, 0, 0.18);
		-webkit-tap-highlight-color: transparent;
		isolation: isolate;
	}
	:global(.dark) .theme-toggle {
		background: rgba(17, 17, 17, 0.55);
		border-color: rgba(255, 255, 255, 0.1);
		color: #f3f4f6;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.4),
			0 10px 28px -12px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(255, 255, 255, 0.02) inset;
	}
	.theme-toggle:hover {
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.08),
			0 14px 32px -14px rgba(0, 0, 0, 0.28);
	}
	:global(.dark) .theme-toggle:hover {
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.5),
			0 16px 36px -14px rgba(16, 185, 129, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.04) inset;
	}
	.theme-toggle:active {
		transform: scale(0.94);
		transition-duration: 120ms;
	}
	.theme-toggle:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	/* Soft ambient halo — neutral, tied to currentColor */
	.halo {
		position: absolute;
		inset: -4px;
		border-radius: inherit;
		pointer-events: none;
		z-index: -1;
		background: radial-gradient(
			closest-side,
			currentColor,
			transparent 70%
		);
		opacity: 0;
		transform: scale(0.9);
		transition: opacity 420ms ease, transform 420ms ease;
	}
	.theme-toggle:hover .halo {
		opacity: 0.12;
		transform: scale(1);
	}
	.is-dark:hover .halo {
		opacity: 0.18;
	}

	/* Click ripple */
	.ripple {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			circle at center,
			currentColor 0%,
			transparent 60%
		);
		opacity: 0;
		transform: scale(0.4);
	}
	.theme-toggle:active .ripple {
		animation: ripple 480ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes ripple {
		0% { opacity: 0.22; transform: scale(0.4); }
		100% { opacity: 0; transform: scale(1.4); }
	}

	/* System-mode indicator: tiny monitor glyph clipped to bottom-right */
	.system-badge {
		position: absolute;
		right: -2px;
		bottom: -2px;
		width: 14px;
		height: 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.95);
		color: #475569;
		box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.1);
		animation: badge-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:global(.dark) .system-badge {
		background: #1f2937;
		color: #cbd5e1;
		box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.5);
	}
	.system-badge svg {
		width: 9px;
		height: 9px;
	}
	@keyframes badge-in {
		from { transform: scale(0); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	.theme-toggle svg {
		width: 1.3rem;
		height: 1.3rem;
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
		transform-origin: 16px 16px;
		transition:
			r 520ms cubic-bezier(0.65, 0, 0.35, 1),
			transform 520ms cubic-bezier(0.65, 0, 0.35, 1);
	}
	.is-dark .orb {
		transform: scale(1.05);
	}

	.mask-circle {
		transform-origin: 24px 10px;
		transform: scale(0);
		transition: transform 560ms cubic-bezier(0.34, 1.46, 0.5, 1);
	}
	.is-dark .mask-circle {
		transform: scale(1);
	}

	.rays {
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		transform-origin: 16px 16px;
		transition:
			opacity 340ms cubic-bezier(0.4, 0, 0.2, 1) 80ms,
			transform 680ms cubic-bezier(0.34, 1.2, 0.5, 1);
		opacity: 1;
		transform: rotate(0deg) scale(1);
	}
	.is-dark .rays {
		opacity: 0;
		transform: rotate(-180deg) scale(0.2);
		transition:
			opacity 260ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 620ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	.stars {
		fill: currentColor;
		opacity: 0;
		transition: opacity 360ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.is-dark .stars {
		opacity: 1;
		transition-delay: 160ms;
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
	.star-c {
		animation-name: star-drift-c;
		animation-duration: 9s;
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
	@keyframes star-drift-c {
		from { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0.3; }
		to { transform: translate3d(1.5px, -2px, 0) scale(1.3); opacity: 0.9; }
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

	/* Mode label — fades in on change, fades out after a beat */
	.mode-label {
		position: absolute;
		top: 50%;
		right: calc(100% + 0.5rem);
		transform: translate(4px, -50%);
		display: inline-flex;
		align-items: center;
		padding: 0.32rem 0.7rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(12px) saturate(160%);
		-webkit-backdrop-filter: blur(12px) saturate(160%);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: #1f2937;
		font-family: 'Albert Sans', sans-serif;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		line-height: 1;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.05),
			0 8px 22px -14px rgba(0, 0, 0, 0.25);
		transition:
			opacity 360ms ease,
			transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(.dark) .mode-label {
		background: rgba(17, 17, 17, 0.72);
		border-color: rgba(255, 255, 255, 0.08);
		color: #f3f4f6;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.4),
			0 10px 26px -14px rgba(0, 0, 0, 0.7);
	}
	.mode-label.is-visible {
		opacity: 1;
		transform: translate(0, -50%);
	}
	@media (prefers-reduced-motion: reduce) {
		.mode-label {
			transition: opacity 200ms linear;
			transform: translate(0, -50%);
		}
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
