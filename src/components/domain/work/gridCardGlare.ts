/**
 * Fallback driver for the `.active-glare__spot` scroll travel.
 *
 * Browsers with CSS scroll-driven animations get the compositor-driven
 * `animation-timeline: view()` path from `gridCardChrome.css`. Firefox does
 * not ship that feature yet, so the spot would sit frozen at the keyframe
 * start (visibly chopped by the wrapper's `overflow-x: clip`). This action
 * reproduces the same `cover 0% → cover 100%` math in JS and writes
 * `--glare-progress`, which the base transform consumes.
 */

/**
 * Pure cover-range progress: 0 when the subject's top edge enters at the
 * scrollport bottom, 1 when its bottom edge leaves past the scrollport top.
 * Mirrors `animation-range: cover 0% cover 100%`.
 */
export function coverProgress(top: number, height: number, viewportHeight: number): number {
	const span = viewportHeight + height;
	if (span <= 0) return 0;
	return Math.min(1, Math.max(0, (viewportHeight - top) / span));
}

function supportsViewTimeline(): boolean {
	return typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'view()');
}

function prefersReducedMotion(): boolean {
	return (
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

/**
 * Svelte action for the `.active-glare` wrapper: keeps `--glare-progress`
 * in sync with scroll position when the native view() timeline is missing.
 * No-ops where the CSS animation already drives the spot.
 */
export function glareScrollDriver(glare: HTMLElement) {
	if (supportsViewTimeline() || prefersReducedMotion()) return;

	const spot = glare.querySelector<HTMLElement>('.active-glare__spot');
	if (!spot) return;

	let frame = 0;
	const update = () => {
		frame = 0;
		// Only the vertical position matters for the cover range, and the
		// spot's translateY is constant, so reading the transformed rect
		// cannot feed back into the progress it drives.
		const rect = spot.getBoundingClientRect();
		const progress = coverProgress(rect.top, rect.height, window.innerHeight);
		glare.style.setProperty('--glare-progress', progress.toFixed(4));
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	update();
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			glare.style.removeProperty('--glare-progress');
		}
	};
}
