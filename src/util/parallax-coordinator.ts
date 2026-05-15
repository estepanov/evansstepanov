// Single shared scroll/IO coordinator for TechBackdrop parallax.
//
// Why: previously every card attached its own scroll listener and called
// getBoundingClientRect() on every frame. With ~24 cards that meant ~24
// forced layouts per scroll frame on mobile — the main source of jank and
// (under memory pressure from many GPU layers) crashes.
//
// Approach: one window scroll listener, one IntersectionObserver. We cache
// each card's document-relative top on intersection changes and resize, then
// derive the per-frame parallax value from cached metrics + scrollY — zero
// layout reads per frame.

type Card = {
	el: HTMLElement;
	docTop: number;
	height: number;
	visible: boolean;
};

const cards = new Map<HTMLElement, Card>();
let scrollY = 0;
let vh = 0;
let raf = 0;
let listening = false;
let io: IntersectionObserver | null = null;
let scrollingTimer = 0;

function refreshMetrics(card: Card, rect?: DOMRectReadOnly | DOMRect) {
	const r = rect ?? card.el.getBoundingClientRect();
	card.docTop = r.top + window.scrollY;
	card.height = r.height;
}

function writeParallax() {
	raf = 0;
	for (const card of cards.values()) {
		if (!card.visible) continue;
		const top = card.docTop - scrollY;
		const centerY = top + card.height / 2;
		const denom = vh / 2 + card.height / 2;
		const p = Math.max(-1, Math.min(1, (vh / 2 - centerY) / denom));
		card.el.style.setProperty('--parallax', p.toFixed(3));
	}
}

function schedule() {
	if (!raf) raf = requestAnimationFrame(writeParallax);
}

function onScroll() {
	scrollY = window.scrollY;
	if (!scrollingTimer) {
		for (const c of cards.values()) if (c.visible) c.el.classList.add('parallax-scrolling');
	}
	clearTimeout(scrollingTimer);
	scrollingTimer = window.setTimeout(() => {
		scrollingTimer = 0;
		for (const c of cards.values()) c.el.classList.remove('parallax-scrolling');
	}, 180);
	schedule();
}

function onResize() {
	vh = window.innerHeight || document.documentElement.clientHeight;
	for (const c of cards.values()) refreshMetrics(c);
	schedule();
}

function ensureGlobals() {
	if (listening) return;
	listening = true;
	scrollY = window.scrollY;
	vh = window.innerHeight || document.documentElement.clientHeight;
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize, { passive: true });
	io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				const card = cards.get(e.target as HTMLElement);
				if (!card) continue;
				card.visible = e.isIntersecting;
				if (e.isIntersecting) refreshMetrics(card, e.boundingClientRect);
				else card.el.classList.remove('parallax-scrolling');
			}
			schedule();
		},
		{ rootMargin: '200px 0px' }
	);
}

export function registerParallax(el: HTMLElement) {
	ensureGlobals();
	const card: Card = { el, docTop: 0, height: 0, visible: false };
	cards.set(el, card);
	refreshMetrics(card);
	io!.observe(el);
	return () => {
		io?.unobserve(el);
		cards.delete(el);
		el.classList.remove('parallax-scrolling');
		el.style.removeProperty('--parallax');
	};
}
