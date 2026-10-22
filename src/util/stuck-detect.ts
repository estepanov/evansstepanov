import { isScrollJump, isStuckFromSentinel, sentinelIntersectsViewport } from './stuck-state';

/** Svelte action: toggles `is-stuck` when the sticky node pins to the viewport top. */
export function stuckDetect(node: HTMLElement) {
	const sentinel = document.createElement('div');
	sentinel.setAttribute('aria-hidden', 'true');
	sentinel.style.cssText = 'width:1px;height:1px;pointer-events:none;';
	node.parentElement?.insertBefore(sentinel, node);

	let lastScrollY = window.scrollY;

	/* An instant jump (End key, anchor link) can teleport the sentinel from fully
	   below to fully above the viewport in one frame; the observer then sees no
	   threshold crossing and never fires, leaving a pinned bar unfrosted until the
	   next scroll. Such a skip needs a step larger than the viewport, so resync
	   from the live rect exactly then and stay silent on ordinary scrolling. */
	const resync = () => {
		const rect = sentinel.getBoundingClientRect();
		node.classList.toggle(
			'is-stuck',
			isStuckFromSentinel(
				sentinelIntersectsViewport(rect.top, rect.bottom, window.innerHeight),
				rect.top
			)
		);
	};

	const onScroll = () => {
		const scrollY = window.scrollY;
		const jumped = isScrollJump(lastScrollY, scrollY, window.innerHeight);
		lastScrollY = scrollY;
		if (jumped) resync();
	};

	const io = new IntersectionObserver(
		(entries) => {
			// Fast scrolling queues several crossings per delivery; only the last is current.
			const entry = entries[entries.length - 1];
			node.classList.toggle('is-stuck', isStuckFromSentinel(entry.isIntersecting, entry.boundingClientRect.top));
		},
		{ threshold: 0 }
	);
	io.observe(sentinel);
	window.addEventListener('scroll', onScroll, { passive: true });
	return {
		destroy: () => {
			io.disconnect();
			window.removeEventListener('scroll', onScroll);
			sentinel.remove();
		}
	};
}
