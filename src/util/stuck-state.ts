/**
 * True when one scroll step teleported further than the viewport height — the
 * only case in which a 1px sentinel can cross from fully-below to fully-above
 * (or vice versa) between two frames, so the observer sees no threshold
 * crossing and stays silent. Smaller steps always produce an observer callback.
 */
export function isScrollJump(
	previousScrollY: number,
	scrollY: number,
	viewportHeight: number
): boolean {
	return Math.abs(scrollY - previousScrollY) > viewportHeight;
}
