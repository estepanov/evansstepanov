import { isScrollJump } from './stuck-state';

/** Svelte action: toggles `is-stuck` when the sticky node pins to the viewport top. */
export function stuckDetect(node: HTMLElement) {
	const sentinel = document.createElement('div');
	sentinel.setAttribute('aria-hidden', 'true');
	sentinel.style.cssText = 'width:1px;height:1px;pointer-events:none;';
	node.parentElement?.insertBefore(sentinel, node);

	let lastScrollY = window.scrollY;

	/* One writer. The 1px sentinel is fully above the viewport exactly when its
	   bottom sits on or above the top edge. The observer and a jump resync both
	   read that live rect, so a batched delivery cannot apply a stale crossing.
	   An instant jump can skip every threshold; only then does scroll resync.
	   Ordinary scrolling stays on the observer. */
	const resync = () => {
		node.classList.toggle('is-stuck', sentinel.getBoundingClientRect().bottom <= 0);
	};

	const onScroll = () => {
		const scrollY = window.scrollY;
		const jumped = isScrollJump(lastScrollY, scrollY, window.innerHeight);
		lastScrollY = scrollY;
		if (jumped) resync();
	};

	const io = new IntersectionObserver(() => resync(), { threshold: 0 });
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
