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

	function handleMove(e: MouseEvent) {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const r = 400;
		targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / r));
		targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / r));
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
		window.addEventListener('mousemove', handleMove, { passive: true });
		raf = requestAnimationFrame(tick);
		return () => {
			window.removeEventListener('mousemove', handleMove);
			cancelAnimationFrame(raf);
		};
	});

	const sparkle =
		'M 0 -10 C 0 -4, 4 0, 10 0 C 4 0, 0 4, 0 10 C 0 4, -4 0, -10 0 C -4 0, 0 -4, 0 -10 Z';

	// Icons + emojis from the About Me copy, in orbit order
	const orbitItems = [
		{ kind: 'icon', component: ShoppingCart, tone: 'purple' },
		{ kind: 'emoji', char: '📚' },
		{ kind: 'icon', component: SiTypescript, tone: 'purple' },
		{ kind: 'emoji', char: '⛷️' },
		{ kind: 'icon', component: MousePointer, tone: 'purple' },
		{ kind: 'emoji', char: '🎮' },
		{ kind: 'icon', component: SiReact, tone: 'purple' },
		{ kind: 'emoji', char: '🛌' }
	] as const;
</script>

<span bind:this={wrapper} class="profile-wrapper float-right ml-2 mb-2 w-28 h-44 sm:w-48 sm:h-72">
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

	<span class="orbit" aria-hidden="true">
		{#each orbitItems as item, i}
			<span class="orbit-item" class:is-emoji={item.kind === 'emoji'} style="--i:{i}">
				<span class="orbit-content">
					{#if item.kind === 'icon'}
						<svelte:component this={item.component} size={18} />
					{:else}
						<span class="emoji">{item.char}</span>
					{/if}
				</span>
			</span>
		{/each}
	</span>
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

	.sparkle {
		transform-box: fill-box;
		transform-origin: center;
		color: rgb(168 85 247);
	}
	:global(.dark) .sparkle {
		color: rgb(192 132 252);
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

	/* Orbit overlay sized to the diamond's rendered bounding box.
	   Wrapper aspect 2:3, viewBox aspect 3:4 → SVG letterboxes vertically.
	   Diamond covers the inner 66.67% × 66.67% centered area. */
	.orbit {
		position: absolute;
		left: 16.67%;
		top: 16.67%;
		width: 66.67%;
		height: 66.67%;
		pointer-events: none;
	}

	.orbit-item {
		position: absolute;
		top: 0;
		left: 0;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		offset-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		offset-rotate: 0deg;
		offset-anchor: 50% 50%;
		color: rgb(126 34 206); /* purple-700 */
		animation: orbit 28s linear infinite;
		animation-delay: calc(var(--i) * -3.5s);
	}
	:global(.dark) .orbit-item {
		color: rgb(192 132 252);
	}

	/* Inner element gets its own wobble so the path isn't perfectly linear,
	   plus the staggered fade-in entry. */
	.orbit-content {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transform-origin: center;
		animation:
			wobble 6.4s ease-in-out infinite,
			orbit-in 0.7s ease-out forwards;
		animation-delay:
			calc(var(--i) * -1.1s),
			calc(0.15s + var(--i) * 0.08s);
	}

	.orbit-item.is-emoji {
		font-size: 16px;
		line-height: 1;
	}
	.orbit-item :global(svg) {
		filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.35));
	}
	.emoji {
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
	}

	@media (min-width: 640px) {
		.orbit-item {
			width: 34px;
			height: 34px;
		}
		.orbit-item.is-emoji {
			font-size: 20px;
		}
	}

	@keyframes orbit {
		to {
			offset-distance: 100%;
		}
	}

	@keyframes orbit-in {
		from {
			opacity: 0;
			scale: 0.4;
		}
		to {
			opacity: 0.9;
			scale: 1;
		}
	}

	/* Per-item drift — small translate + rotate so the orbit looks organic,
	   not a stiff polygon trace. */
	@keyframes wobble {
		0% {
			translate: 0 0;
			rotate: -6deg;
		}
		25% {
			translate: 3px -4px;
			rotate: 4deg;
		}
		50% {
			translate: -2px 3px;
			rotate: -3deg;
		}
		75% {
			translate: -4px -2px;
			rotate: 6deg;
		}
		100% {
			translate: 0 0;
			rotate: -6deg;
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
		.sparkle-1,
		.sparkle-2,
		.sparkle-3,
		.orbit-item,
		.orbit-content {
			animation: none;
		}
		.orbit-content {
			opacity: 0.7;
		}
	}
</style>
