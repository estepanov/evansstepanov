<script lang="ts">
	export let size: number = 40;
	/** Ring colour. Inherits the surrounding text colour by default, so it works in both themes. */
	export let color: string = 'currentColor';
	/** Accessible name announced while the spinner is on screen. */
	export let label: string = 'Loading';
</script>

<div
	class="spinner"
	role="status"
	aria-label={label}
	style="--spinner-size: {size}px; --spinner-color: {color};"
></div>

<style>
	.spinner {
		/* Scale the ring with the spinner so small sizes don't look chunky. */
		--spinner-thickness: max(2px, calc(var(--spinner-size) / 10));

		width: var(--spinner-size);
		height: var(--spinner-size);
		border-radius: 50%;
		/* Track is derived from the ring colour rather than hardcoded black, which
		   was invisible against the dark theme's background. */
		border: var(--spinner-thickness) solid
			color-mix(in oklab, var(--spinner-color) 20%, transparent);
		border-top-color: var(--spinner-color);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			/* Slowed rather than stopped — a frozen spinner reads as a hung one. */
			animation-duration: 3s;
		}
	}
</style>
