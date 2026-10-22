/** Svelte action: toggles `is-stuck` when the sticky node pins to the viewport top. */
export function stuckDetect(node: HTMLElement) {
	const sentinel = document.createElement('div');
	sentinel.setAttribute('aria-hidden', 'true');
	sentinel.style.cssText = 'width:1px;height:1px;pointer-events:none;';
	node.parentElement?.insertBefore(sentinel, node);

	const io = new IntersectionObserver(
		(entries) => {
			// Fast scrolling queues several crossings per delivery; only the last is current.
			const entry = entries[entries.length - 1];
			const stuck = !entry.isIntersecting && entry.boundingClientRect.top < 0;
			node.classList.toggle('is-stuck', stuck);
		},
		{ threshold: 0 }
	);
	io.observe(sentinel);
	return {
		destroy: () => {
			io.disconnect();
			sentinel.remove();
		}
	};
}
