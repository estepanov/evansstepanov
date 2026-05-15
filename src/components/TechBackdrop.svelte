<script lang="ts">
	import { onMount } from 'svelte';
	import { getTechIcon, type TechIcon as TechIconT } from '../util/tech-icons';
	import { registerParallax } from '../util/parallax-coordinator';
	import TechIcon from './TechIcon.svelte';

	export let tags: string[] = [];

	export let size: number = 40;
	export let rows: number = 8;
	export let cols: number = 8;

	// SSR-safe defaults are the *light* version: mobile-first hydration so we
	// never paint a 64-icon grid only to tear it down on a phone. On desktop
	// (verified after mount) we upgrade to the full density.
	let activeRows = 4;
	let activeCols = 4;

	$: icons = tags.map(getTechIcon).filter(Boolean) as TechIconT[];
	$: grid =
		icons.length === 0
			? []
			: Array.from({ length: activeRows }, (_, r) =>
					Array.from({ length: activeCols }, (_, c) => icons[(r * 3 + c) % icons.length])
				);

	let root: HTMLElement | null = null;

	onMount(() => {
		if (!root) return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const coarse = window.matchMedia('(pointer: coarse)').matches;
		const narrow = window.innerWidth < 640;
		const isMobile = narrow || coarse;

		// On phones the lattice is the most expensive part of the page — a
		// large masked, rotated layer per card. Keep the light grid, skip
		// parallax entirely; the static backdrop still reads as a textured
		// accent without the GPU/scroll cost.
		if (!isMobile) {
			activeRows = rows;
			activeCols = cols;
		}

		if (isMobile || reduceMotion) return;
		return registerParallax(root);
	});
</script>

{#if icons.length > 0}
	<div class="backdrop" aria-hidden="true" bind:this={root}>
		<div class="lattice">
			{#each grid as row, r}
				<div class="row" style="--r: {r}">
					{#each row as icon, c (`${r}-${c}`)}
						<span class="cell" style="--c: {c}">
							<span class="cell-inner">
								<TechIcon {icon} {size} />
							</span>
						</span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	@property --mask-mid {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 25%;
	}
	@property --mask-end {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 70%;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;
		pointer-events: none;
		z-index: 0;
		color: theme('colors.slate.900');
		opacity: 0.07;
		--mask-mid: 28%;
		--mask-end: 74%;
		transition:
			opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
			--mask-mid 500ms cubic-bezier(0.22, 1, 0.36, 1),
			--mask-end 500ms cubic-bezier(0.22, 1, 0.36, 1);
		-webkit-mask-image: linear-gradient(
			315deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.7) var(--mask-mid),
			rgba(0, 0, 0, 0) var(--mask-end)
		);
		mask-image: linear-gradient(
			315deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.7) var(--mask-mid),
			rgba(0, 0, 0, 0) var(--mask-end)
		);
	}

	:global(html.dark) .backdrop {
		color: theme('colors.slate.100');
		opacity: 0.1;
	}

	:global(.tech-card:hover) .backdrop,
	:global(.tech-card:focus-within) .backdrop,
	:global(.tech-hero:hover) .backdrop,
	:global(.tech-hero:focus-within) .backdrop {
		opacity: 0.13;
		--mask-mid: 36%;
		--mask-end: 88%;
	}
	:global(html.dark .tech-card:hover) .backdrop,
	:global(html.dark .tech-card:focus-within) .backdrop,
	:global(html.dark .tech-hero:hover) .backdrop,
	:global(html.dark .tech-hero:focus-within) .backdrop {
		opacity: 0.16;
	}

	.lattice {
		position: absolute;
		top: -55%;
		left: -55%;
		right: -55%;
		bottom: -55%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.75rem;
		transform: rotate(-14deg) scale(var(--lattice-scale, 1));
		transform-origin: 50% 50%;
		transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Only promote to its own GPU layer while actively scrolling or hovering —
	 * keeping ~24 always-on composited layers is what crashes mid-range phones. */
	.backdrop:global(.parallax-scrolling) .lattice,
	:global(.tech-card:hover) .lattice,
	:global(.tech-card:focus-within) .lattice,
	:global(.tech-hero:hover) .lattice,
	:global(.tech-hero:focus-within) .lattice {
		will-change: transform, translate;
	}

	:global(.tech-card:hover) .lattice,
	:global(.tech-card:focus-within) .lattice,
	:global(.tech-hero:hover) .lattice,
	:global(.tech-hero:focus-within) .lattice {
		--lattice-scale: 1.025;
	}

	/* Scroll parallax: --parallax is updated from JS (range −1..+1) as the
	 * card moves through the viewport. The icon plane translates opposite
	 * to scroll direction so it reads as a deeper background layer.
	 * Uses the `translate` property to compose cleanly with the lattice's
	 * existing rotate/scale `transform`. */
	.lattice {
		translate: 0 calc(var(--parallax, 0) * 9%);
	}

	.row {
		display: flex;
		gap: 2.25rem;
		justify-content: center;
	}

	.cell {
		display: inline-flex;
		flex: 0 0 auto;
	}

	.cell-inner {
		display: inline-flex;
	}

	@media (prefers-reduced-motion: reduce) {
		.backdrop,
		.lattice {
			transition: opacity 200ms ease;
		}
		.lattice {
			transform: rotate(-14deg);
			animation: none;
		}
	}
</style>
