<script lang="ts">
	import { onMount } from 'svelte';
	import { MousePointer, ShoppingCart } from '@lucide/svelte';
	import { SiReact, SiTypescript } from '@icons-pack/svelte-simple-icons';

	let wrapper: HTMLElement;
	let mx = 0;
	let my = 0;
	let raf = 0;
	let targetX = 0;
	let targetY = 0;

	// Emojis cycled while the bottle is hidden behind the diamond, so a
	// fresh one re-emerges from the top-left each lap. Period must match
	// the planet-orbit animation duration in CSS (16s).
	const orbitEmojis = ['🍼', '📚', '⛷️', '🎮', '🛌'] as const;
	const ORBIT_MS = 16000;
	// 75% mark of the orbit = deep behind the diamond (top-left arc).
	const SWAP_OFFSET_MS = ORBIT_MS * 0.75;
	let emojiIdx = $state(0);

	function handleMove(e: MouseEvent) {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const r = 400;
		targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / r));
		targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / r));
	}

	function handleScroll() {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const cy = rect.top + rect.height / 2;
		// Progress: -1 when element center is at top of viewport, +1 at bottom.
		const progress = Math.max(-1, Math.min(1, (cy / window.innerHeight) * 2 - 1));
		targetY = progress;
		// Subtle horizontal sway driven by the same progress for life.
		targetX = Math.sin(progress * Math.PI) * 0.4;
	}

	function tick() {
		mx += (targetX - mx) * 0.08;
		my += (targetY - my) * 0.08;
		if (wrapper) {
			wrapper.style.setProperty('--mx', mx.toFixed(3));
			wrapper.style.setProperty('--my', my.toFixed(3));
		}
		raf = requestAnimationFrame(tick);
	}

	onMount(() => {
		const coarse = window.matchMedia('(pointer: coarse)').matches;
		if (coarse) {
			window.addEventListener('scroll', handleScroll, { passive: true });
			handleScroll();
		} else {
			window.addEventListener('mousemove', handleMove, { passive: true });
		}
		raf = requestAnimationFrame(tick);

		const swapEmoji = () => {
			emojiIdx = (emojiIdx + 1) % orbitEmojis.length;
		};
		const swapTimeout = setTimeout(() => {
			swapEmoji();
			swapInterval = setInterval(swapEmoji, ORBIT_MS);
		}, SWAP_OFFSET_MS);
		let swapInterval: ReturnType<typeof setInterval> | undefined;

		return () => {
			window.removeEventListener('mousemove', handleMove);
			window.removeEventListener('scroll', handleScroll);
			cancelAnimationFrame(raf);
			clearTimeout(swapTimeout);
			if (swapInterval) clearInterval(swapInterval);
		};
	});

	// Icons placed around the diamond like the old sparkles — larger,
	// different sizes, twinkling. Position is wrapper-relative %.
	const sparkleIcons = [
		{ component: SiReact, size: 36, top: '8%', left: '70%', dur: 2.4, delay: 0, scale: 1, dx: 1, dy: 1, driftDur: 7.5, driftDelay: 0, spin: 1 },
		{ component: SiTypescript, size: 28, top: '54%', left: '94%', dur: 3.1, delay: 0.6, scale: 0.9, dx: 1, dy: 1, driftDur: 9.2, driftDelay: 1.3, spin: -1 },
		{ component: MousePointer, size: 24, top: '88%', left: '38%', dur: 2.7, delay: 1.2, scale: 1.1, dx: 1, dy: -1, driftDur: 6.8, driftDelay: 2.1, spin: 1 },
		{ component: ShoppingCart, size: 32, top: '22%', left: '10%', dur: 2.9, delay: 0.3, scale: 0.85, dx: -1, dy: -1, driftDur: 8.4, driftDelay: 0.7, spin: -1 }
	] as const;
</script>

<span bind:this={wrapper} class="profile-wrapper float-right ml-2 mb-2 w-28 h-44 sm:w-48 sm:h-72">
	<svg
		viewBox="-40 -40 240 320"
		role="img"
		aria-label="me"
		class="profile-image text-gray-300 dark:text-gray-700"
		overflow="visible"
	>
		<defs>
			<clipPath id="diamond-clip" clipPathUnits="userSpaceOnUse">
				<path d="M80 0 L160 120 L80 240 L0 120 Z" />
			</clipPath>
		</defs>

		<g class="diamond">
			<image
				href="/small.png"
				x="-8"
				y="-12"
				width="176"
				height="264"
				preserveAspectRatio="xMidYMid slice"
				clip-path="url(#diamond-clip)"
				class="parallax-image grayscale"
			/>
			<!-- <path
				d="M80 0 L160 120 L80 240 L0 120 Z"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				stroke-linejoin="round"
			/> -->
		</g>

	</svg>

	<span class="planet" aria-hidden="true">
		<span class="planet-body">{orbitEmojis[emojiIdx]}</span>
	</span>

	{#each sparkleIcons as s, i (i)}
		<span
			class="sparkle-icon"
			aria-hidden="true"
			style="--top:{s.top}; --left:{s.left}; --dur:{s.dur}s; --delay:{s.delay}s; --scale:{s.scale}; --dx:{s.dx}; --dy:{s.dy}; --drift-dur:{s.driftDur}s; --drift-delay:{s.driftDelay}s; --spin:{s.spin};"
		>
			<span class="sparkle-inner">
				<svelte:component this={s.component} size={s.size} />
			</span>
		</span>
	{/each}
</span>

<style>
	.profile-wrapper {
		position: relative;
		display: inline-block;
		shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		shape-margin: 0.75rem;
		--mx: 0;
		--my: 0;
	}

	.profile-image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.diamond {
		transform-box: fill-box;
		transform-origin: 80px 120px;
		animation: float 6s ease-in-out infinite;
		transform: translate(calc(var(--mx) * 6px), calc(var(--my) * 6px))
			rotate(calc(var(--mx) * 4deg));
		transition: transform 0.05s linear;
	}

	.parallax-image {
		transform: translate(calc(var(--mx) * -10px), calc(var(--my) * -10px));
	}

	.profile-image {
		position: relative;
		z-index: 1;
	}

	.sparkle-icon {
		position: absolute;
		top: var(--top);
		left: var(--left);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		color: rgb(126 34 206); /* purple-700 */
		z-index: 2;
		transform: translate(
				calc(-50% + var(--mx) * 14px * var(--dx)),
				calc(-50% + var(--my) * 12px * var(--dy))
			)
			rotate(calc(var(--mx) * 16deg * var(--dx))) scale(var(--scale));
		animation: twinkle var(--dur) ease-in-out infinite var(--delay);
		filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.4));
	}
	:global(.dark) .sparkle-icon {
		color: rgb(192 132 252);
	}

	.sparkle-inner {
		display: inline-flex;
		transform-origin: center;
		animation: sparkle-drift var(--drift-dur, 8s) ease-in-out infinite var(--drift-delay, 0s);
		will-change: transform;
	}

	@keyframes sparkle-drift {
		0% {
			transform: translate(0, 0) rotate(0deg) scale(1);
		}
		25% {
			transform: translate(2px, -3px) rotate(calc(var(--spin, 1) * 4deg)) scale(1.04);
		}
		50% {
			transform: translate(0, 1px) rotate(0deg) scale(0.97);
		}
		75% {
			transform: translate(-2px, -2px) rotate(calc(var(--spin, 1) * -3deg)) scale(1.02);
		}
		100% {
			transform: translate(0, 0) rotate(0deg) scale(1);
		}
	}

	.planet {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 28px;
		height: 28px;
		margin-left: -14px;
		margin-top: -14px;
		pointer-events: none;
		--rx: 46px;
		--ry: 11px;
		animation: planet-orbit 16s linear infinite;
		will-change: transform, z-index;
	}

	.planet-body {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 20px;
		line-height: 28px;
		text-align: center;
		animation: planet-spin 9s ease-in-out infinite;
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
	}

	@media (min-width: 640px) {
		.planet {
			--rx: 82px;
			--ry: 18px;
		}
		.planet-body {
			font-size: 26px;
		}
	}

	/* Tilted elliptical orbit: major axis runs top-left → bottom-right.
	   The leading rotate(45deg) puts the translate axes in that diagonal
	   frame, so x-translate moves along TL↔BR and y-translate along the
	   perpendicular BL↔TR. 8 sin/cos samples at 45° increments give a
	   smooth ellipse rather than a polygon. Front (z above diamond) is
	   the bottom-right arc (0%–50%); back is the top-left arc. */
	/* 16-step ellipse so linear interpolation between samples follows
	   the curve closely — fewer/coarser samples produce visible kinks
	   at sample boundaries that read as "bouncy". Scale held at 1 for
	   a steady glide; perspective is implied by the path alone. */
	@keyframes planet-orbit {
		0% {
			transform: rotate(45deg) translate(var(--rx), 0);
			z-index: 2;
		}
		6.25% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.924), calc(var(--ry) * 0.383));
			z-index: 2;
		}
		12.5% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.707), calc(var(--ry) * 0.707));
			z-index: 2;
		}
		18.75% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.383), calc(var(--ry) * 0.924));
			z-index: 2;
		}
		25% {
			transform: rotate(45deg) translate(0, var(--ry));
			z-index: 2;
		}
		31.25% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.383), calc(var(--ry) * 0.924));
			z-index: 2;
		}
		37.5% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.707), calc(var(--ry) * 0.707));
			z-index: 2;
		}
		43.75% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.924), calc(var(--ry) * 0.383));
			z-index: 2;
		}
		49.99% {
			transform: rotate(45deg) translate(calc(var(--rx) * -1), 0);
			z-index: 2;
		}
		50% {
			transform: rotate(45deg) translate(calc(var(--rx) * -1), 0);
			z-index: 0;
		}
		56.25% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.924), calc(var(--ry) * -0.383));
			z-index: 0;
		}
		62.5% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.707), calc(var(--ry) * -0.707));
			z-index: 0;
		}
		68.75% {
			transform: rotate(45deg) translate(calc(var(--rx) * -0.383), calc(var(--ry) * -0.924));
			z-index: 0;
		}
		75% {
			transform: rotate(45deg) translate(0, calc(var(--ry) * -1));
			z-index: 0;
		}
		81.25% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.383), calc(var(--ry) * -0.924));
			z-index: 0;
		}
		87.5% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.707), calc(var(--ry) * -0.707));
			z-index: 0;
		}
		93.75% {
			transform: rotate(45deg) translate(calc(var(--rx) * 0.924), calc(var(--ry) * -0.383));
			z-index: 0;
		}
		99.99% {
			transform: rotate(45deg) translate(var(--rx), 0);
			z-index: 0;
		}
		100% {
			transform: rotate(45deg) translate(var(--rx), 0);
			z-index: 2;
		}
	}

	/* Counter-rotates the parent's 45° tilt so the emoji glyph stays
	   roughly upright on screen, with a gentle swing for life. */
	@keyframes planet-spin {
		0%,
		100% {
			transform: rotate(-57deg);
		}
		50% {
			transform: rotate(-31deg);
		}
	}

	@keyframes float {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -4px;
		}
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.diamond,
		.sparkle-icon,
		.sparkle-inner,
		.planet,
		.planet-body {
			animation: none;
		}
	}
</style>
