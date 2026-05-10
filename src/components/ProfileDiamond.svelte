<script lang="ts">
	import { onMount } from 'svelte';

	let wrapper: HTMLElement;
	let mx = 0;
	let my = 0;
	let raf = 0;
	let targetX = 0;
	let targetY = 0;

	function handleMove(e: MouseEvent) {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		// Normalize roughly to [-1, 1] within ~400px radius around the element
		const r = 400;
		targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / r));
		targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / r));
	}

	function tick() {
		// Ease toward target for smooth parallax
		mx += (targetX - mx) * 0.08;
		my += (targetY - my) * 0.08;
		if (wrapper) {
			wrapper.style.setProperty('--mx', mx.toFixed(3));
			wrapper.style.setProperty('--my', my.toFixed(3));
		}
		raf = requestAnimationFrame(tick);
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMove, { passive: true });
		raf = requestAnimationFrame(tick);
		return () => {
			window.removeEventListener('mousemove', handleMove);
			cancelAnimationFrame(raf);
		};
	});

	// Sparkle path centered at (0,0)
	const sparkle =
		'M 0 -10 C 0 -4, 4 0, 10 0 C 4 0, 0 4, 0 10 C 0 4, -4 0, -10 0 C -4 0, 0 -4, 0 -10 Z';
</script>

<span bind:this={wrapper} class="profile-wrapper float-right ml-2 mb-2 w-24 h-36 sm:w-36 sm:h-56">
	<svg
		viewBox="-40 -40 240 320"
		role="img"
		aria-label="me"
		class="profile-image opacity-90 text-gray-300 dark:text-gray-700"
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
			<path
				d="M80 0 L160 120 L80 240 L0 120 Z"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				stroke-linejoin="round"
			/>
		</g>

		<g class="sparkle sparkle-1" transform="translate(178 -10)">
			<path d={sparkle} fill="currentColor" />
		</g>
		<g class="sparkle sparkle-2" transform="translate(-22 60)">
			<path d={sparkle} fill="currentColor" />
		</g>
		<g class="sparkle sparkle-3" transform="translate(165 215)">
			<path d={sparkle} fill="currentColor" />
		</g>
	</svg>
</span>

<style>
	.profile-wrapper {
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

	/* Playful idle float on the diamond, plus mouse-driven tilt */
	.diamond {
		transform-box: fill-box;
		transform-origin: 80px 120px;
		animation: float 6s ease-in-out infinite;
		transform: translate(calc(var(--mx) * 6px), calc(var(--my) * 6px))
			rotate(calc(var(--mx) * 4deg));
		transition: transform 0.05s linear;
	}

	/* Image inside the clip moves further than the frame for a depth/parallax feel */
	.parallax-image {
		transform: translate(calc(var(--mx) * -10px), calc(var(--my) * -10px));
	}

	/* Sparkles twinkle on idle and drift at varying depths with the mouse */
	.sparkle {
		transform-box: fill-box;
		transform-origin: center;
		color: rgb(168 85 247); /* purple-500 */
	}
	:global(.dark) .sparkle {
		color: rgb(192 132 252); /* purple-400 */
	}

	.sparkle-1 {
		animation: twinkle 2.4s ease-in-out infinite;
		transform: translate(calc(178px + var(--mx) * 14px), calc(-10px + var(--my) * 14px))
			rotate(calc(var(--mx) * 20deg));
	}
	.sparkle-2 {
		animation: twinkle 3.1s ease-in-out infinite 0.6s;
		transform: translate(calc(-22px + var(--mx) * -18px), calc(60px + var(--my) * 10px))
			rotate(calc(var(--my) * -15deg)) scale(0.9);
	}
	.sparkle-3 {
		animation: twinkle 2.7s ease-in-out infinite 1.2s;
		transform: translate(calc(165px + var(--mx) * 10px), calc(215px + var(--my) * -16px))
			rotate(calc(var(--mx) * -25deg)) scale(0.75);
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
		.sparkle-1,
		.sparkle-2,
		.sparkle-3 {
			animation: none;
		}
	}
</style>
