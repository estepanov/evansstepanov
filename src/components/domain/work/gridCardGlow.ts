/** Tracks the pointer as CSS custom properties driving the `.grid-card` spotlight. */
export function handleGlowMove(event: PointerEvent) {
	const target = event.currentTarget as HTMLElement;
	const rect = target.getBoundingClientRect();
	const x = ((event.clientX - rect.left) / rect.width) * 100;
	const y = ((event.clientY - rect.top) / rect.height) * 100;

	target.style.setProperty('--grid-glow-x', `${x}%`);
	target.style.setProperty('--grid-glow-y', `${y}%`);
}

export function handleGlowLeave() {
	// Intentionally do not reset --grid-glow-x/y here: the spotlight ::after
	// transitions opacity but not background-position, so resetting would
	// snap the gradient to the default corner mid-fade. Leaving the last
	// cursor position in place lets it fade out smoothly where it was.
}
