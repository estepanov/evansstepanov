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
		will-change: transform;
	}

	:global(.tech-card:hover) .lattice,
	:global(.tech-card:focus-within) .lattice,
	:global(.tech-hero:hover) .lattice,
	:global(.tech-hero:focus-within) .lattice {
		--lattice-scale: 1.025;
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
		}
	}
</style>
