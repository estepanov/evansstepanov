/** Pure state decisions for `stuckDetect`, kept DOM-free so they are unit-testable. */

/** True when the sentinel span overlaps the viewport at all. */
export function sentinelIntersectsViewport(
	top: number,
	bottom: number,
	viewportHeight: number
): boolean {
	return bottom > 0 && top < viewportHeight;
}

/**
 * True when the sticky header is pinned: its sentinel sits fully above the
 * viewport top. Mirrors the IntersectionObserver condition (not intersecting
 * and rect top negative) so both detection paths agree on one definition.
 */
export function isStuckFromSentinel(isIntersecting: boolean, sentinelTop: number): boolean {
	return !isIntersecting && sentinelTop < 0;
}

/**
 * True when one scroll step teleported further than the viewport height — the
 * only case in which a sentinel can cross from fully-below to fully-above (or
 * vice versa) between two frames, so the observer sees no threshold crossing
 * and stays silent. Smaller steps always produce a normal observer callback.
 */
export function isScrollJump(
	previousScrollY: number,
	scrollY: number,
	viewportHeight: number
): boolean {
	return Math.abs(scrollY - previousScrollY) > viewportHeight;
}
