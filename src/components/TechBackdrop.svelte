<script lang="ts">
	import { getTechIcon, type TechIcon as TechIconT } from '../util/tech-icons';
	import TechIcon from './TechIcon.svelte';

	export let tags: string[] = [];

	export let size: number = 40;
	export let rows: number = 8;
	export let cols: number = 8;

	$: icons = (tags.map(getTechIcon).filter(Boolean) as TechIconT[]);
	$: grid = icons.length === 0
		? []
		: Array.from({ length: rows }, (_, r) =>
				Array.from({ length: cols }, (_, c) => icons[(r * 3 + c) % icons.length])
			);
</script>

{#if icons.length > 0}
	<div class="backdrop" aria-hidden="true">
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
		perspective: 900px;
		perspective-origin: 50% 50%;
		color: theme('colors.slate.900');
		opacity: 0.09;
		--mask-mid: 25%;
		--mask-end: 70%;
		transition:
			opacity 600ms cubic-bezier(0.22, 1, 0.36, 1),
			--mask-mid 700ms cubic-bezier(0.22, 1, 0.36, 1),
			--mask-end 700ms cubic-bezier(0.22, 1, 0.36, 1);
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
		opacity: 0.12;
	}

	:global(.tech-card:hover) .backdrop,
	:global(.tech-card:focus-within) .backdrop,
	:global(.tech-hero:hover) .backdrop,
	:global(.tech-hero:focus-within) .backdrop {
		opacity: 0.16;
		--mask-mid: 32%;
		--mask-end: 82%;
	}
	:global(html.dark .tech-card:hover) .backdrop,
	:global(html.dark .tech-card:focus-within) .backdrop,
	:global(html.dark .tech-hero:hover) .backdrop,
	:global(html.dark .tech-hero:focus-within) .backdrop {
		opacity: 0.2;
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
		transform:
			rotateX(var(--lattice-rx, 38deg))
			rotateY(var(--lattice-ry, -28deg))
			rotate(-14deg)
			scale(var(--lattice-scale, 1));
		transform-style: preserve-3d;
		transition: transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global(.tech-card:hover) .lattice,
	:global(.tech-card:focus-within) .lattice,
	:global(.tech-hero:hover) .lattice,
	:global(.tech-hero:focus-within) .lattice {
		--lattice-rx: 42deg;
		--lattice-ry: -30deg;
		--lattice-scale: 1.04;
	}

	.row {
		display: flex;
		gap: 2.25rem;
		justify-content: center;
		transform-style: preserve-3d;
	}

	.cell {
		display: inline-flex;
		flex: 0 0 auto;
		transform: translate3d(0, 0, 0);
		transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: 0ms;
		will-change: transform;
	}

	.cell-inner {
		display: inline-flex;
		transform-origin: center;
		transform: translateZ(0);
		transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: 0ms;
	}

	/*
	 * On enter (hover), each cell waits its turn so the lift reads as a soft
	 * diagonal wave originating from the near corner of the tilted plane.
	 * On exit, the delay resets to 0ms (default rule above) so every cell
	 * settles back in unison — no laggy reverse stagger.
	 */
	:global(.tech-card:hover) .cell,
	:global(.tech-card:focus-within) .cell,
	:global(.tech-hero:hover) .cell,
	:global(.tech-hero:focus-within) .cell,
	:global(.tech-card:hover) .cell-inner,
	:global(.tech-card:focus-within) .cell-inner,
	:global(.tech-hero:hover) .cell-inner,
	:global(.tech-hero:focus-within) .cell-inner {
		transition-delay: calc(35ms * (var(--r, 0) + var(--c, 0)));
	}

	:global(.tech-card:hover) .cell,
	:global(.tech-card:focus-within) .cell,
	:global(.tech-hero:hover) .cell,
	:global(.tech-hero:focus-within) .cell {
		transform: translate3d(0, 0, 28px);
	}

	:global(.tech-card:hover) .cell-inner,
	:global(.tech-card:focus-within) .cell-inner,
	:global(.tech-hero:hover) .cell-inner,
	:global(.tech-hero:focus-within) .cell-inner {
		transform: translateZ(0) scale(1.05);
	}

@media (prefers-reduced-motion: reduce) {
		.lattice {
			transition: none;
		}
		.row,
		.cell,
		.cell-inner {
			transition: none;
			transform: none;
			animation: none;
		}
	}
</style>
