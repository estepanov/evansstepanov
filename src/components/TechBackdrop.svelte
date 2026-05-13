<script lang="ts">
	import { getTechIcon, type TechIcon as TechIconT } from '../util/tech-icons';
	import TechIcon from './TechIcon.svelte';

	export let tags: string[] = [];

	export let size: number = 40;
	export let rows: number = 5;
	export let cols: number = 6;

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
				<div class="row" data-dir={r % 2 === 0 ? 'l' : 'r'}>
					{#each row as icon, c (`${r}-${c}`)}
						<span class="cell">
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
		top: -35%;
		left: -35%;
		right: -35%;
		bottom: -35%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.75rem;
		transform: rotate(-14deg);
		transform-style: preserve-3d;
	}

	.row {
		display: flex;
		gap: 2.25rem;
		justify-content: center;
		transform: translate3d(var(--row-shift, 0), 0, 0);
		transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
		transform-style: preserve-3d;
		will-change: transform;
	}

	.row[data-dir='l'] {
		--row-shift: calc(-1 * var(--tech-shift, 0px));
	}
	.row[data-dir='r'] {
		--row-shift: var(--tech-shift, 0px);
	}

	.cell {
		display: inline-flex;
		flex: 0 0 auto;
		transform: translate3d(0, 0, 0);
		transition: transform 950ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}

	.cell-inner {
		display: inline-flex;
		transform-origin: center;
	}

	@keyframes cell-breath {
		0%,
		100% {
			transform: rotate(-2.5deg) translateY(1px) scale(0.97);
		}
		50% {
			transform: rotate(2.5deg) translateY(-2px) scale(1.03);
		}
	}

	:global(.tech-card:hover) .cell-inner,
	:global(.tech-card:focus-within) .cell-inner,
	:global(.tech-hero:hover) .cell-inner,
	:global(.tech-hero:focus-within) .cell-inner {
		animation: cell-breath 4.8s ease-in-out infinite;
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 1) .cell-inner,
	:global(.tech-card:focus-within) .cell:nth-child(5n + 1) .cell-inner,
	:global(.tech-hero:hover) .cell:nth-child(5n + 1) .cell-inner,
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 1) .cell-inner {
		animation-duration: 5.3s;
		animation-delay: -0.4s;
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 2) .cell-inner,
	:global(.tech-card:focus-within) .cell:nth-child(5n + 2) .cell-inner,
	:global(.tech-hero:hover) .cell:nth-child(5n + 2) .cell-inner,
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 2) .cell-inner {
		animation-duration: 4.2s;
		animation-delay: -1.1s;
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 3) .cell-inner,
	:global(.tech-card:focus-within) .cell:nth-child(5n + 3) .cell-inner,
	:global(.tech-hero:hover) .cell:nth-child(5n + 3) .cell-inner,
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 3) .cell-inner {
		animation-duration: 5.7s;
		animation-delay: -2.2s;
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 4) .cell-inner,
	:global(.tech-card:focus-within) .cell:nth-child(5n + 4) .cell-inner,
	:global(.tech-hero:hover) .cell:nth-child(5n + 4) .cell-inner,
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 4) .cell-inner {
		animation-duration: 4.6s;
		animation-delay: -0.9s;
	}
	:global(.tech-card:hover) .cell:nth-child(5n) .cell-inner,
	:global(.tech-card:focus-within) .cell:nth-child(5n) .cell-inner,
	:global(.tech-hero:hover) .cell:nth-child(5n) .cell-inner,
	:global(.tech-hero:focus-within) .cell:nth-child(5n) .cell-inner {
		animation-duration: 5.1s;
		animation-delay: -1.6s;
	}

	:global(.tech-card:hover) .cell:nth-child(5n + 1),
	:global(.tech-card:focus-within) .cell:nth-child(5n + 1) {
		transform: translate3d(0, 0, 36px);
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 2),
	:global(.tech-card:focus-within) .cell:nth-child(5n + 2) {
		transform: translate3d(0, 0, 10px);
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 3),
	:global(.tech-card:focus-within) .cell:nth-child(5n + 3) {
		transform: translate3d(0, 0, 58px) scale(1.04);
	}
	:global(.tech-card:hover) .cell:nth-child(5n + 4),
	:global(.tech-card:focus-within) .cell:nth-child(5n + 4) {
		transform: translate3d(0, 0, 22px);
	}
	:global(.tech-card:hover) .cell:nth-child(5n),
	:global(.tech-card:focus-within) .cell:nth-child(5n) {
		transform: translate3d(0, 0, 46px) scale(1.02);
	}

	:global(.tech-hero:hover) .cell:nth-child(5n + 1),
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 1) {
		transform: translate3d(0, 0, 36px);
	}
	:global(.tech-hero:hover) .cell:nth-child(5n + 2),
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 2) {
		transform: translate3d(0, 0, 10px);
	}
	:global(.tech-hero:hover) .cell:nth-child(5n + 3),
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 3) {
		transform: translate3d(0, 0, 58px) scale(1.04);
	}
	:global(.tech-hero:hover) .cell:nth-child(5n + 4),
	:global(.tech-hero:focus-within) .cell:nth-child(5n + 4) {
		transform: translate3d(0, 0, 22px);
	}
	:global(.tech-hero:hover) .cell:nth-child(5n),
	:global(.tech-hero:focus-within) .cell:nth-child(5n) {
		transform: translate3d(0, 0, 46px) scale(1.02);
	}

@media (prefers-reduced-motion: reduce) {
		.row,
		.cell,
		.cell-inner {
			transition: none;
			transform: none;
			animation: none;
		}
	}
</style>
