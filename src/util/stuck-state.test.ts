import { describe, it, expect } from 'vitest';
import { isScrollJump, isStuckFromSentinel, sentinelIntersectsViewport } from './stuck-state';

describe('isStuckFromSentinel', () => {
	it('reports stuck when the sentinel sits fully above the viewport', () => {
		expect(isStuckFromSentinel(false, -3)).toBe(true);
	});

	it('reports unstuck while the sentinel is still clipped into the top edge', () => {
		// The header pins at top:-1px, so a sentinel with any pixel on screen is not stuck yet.
		expect(isStuckFromSentinel(true, -0.5)).toBe(false);
	});

	it('reports unstuck when the sentinel is below the viewport', () => {
		expect(isStuckFromSentinel(false, 900)).toBe(false);
	});

	it('reports unstuck while the sentinel is on screen', () => {
		expect(isStuckFromSentinel(true, 400)).toBe(false);
	});
});

describe('sentinelIntersectsViewport', () => {
	const height = 800;

	it('treats a span ending exactly at the viewport top as outside', () => {
		expect(sentinelIntersectsViewport(-1, 0, height)).toBe(false);
	});

	it('treats a span straddling the viewport top as inside', () => {
		expect(sentinelIntersectsViewport(-0.5, 0.5, height)).toBe(true);
	});

	it('treats a span straddling the viewport bottom as inside', () => {
		expect(sentinelIntersectsViewport(799.5, 800.5, height)).toBe(true);
	});

	it('treats a span starting exactly at the viewport bottom as outside', () => {
		expect(sentinelIntersectsViewport(800, 801, height)).toBe(false);
	});

	it('treats a span fully above or fully inside as expected', () => {
		expect(sentinelIntersectsViewport(-2, -1, height)).toBe(false);
		expect(sentinelIntersectsViewport(300, 301, height)).toBe(true);
	});
});

describe('isScrollJump', () => {
	const height = 800;

	it('flags an End-key teleport down the page', () => {
		expect(isScrollJump(0, 4200, height)).toBe(true);
	});

	it('flags a teleport back up the page', () => {
		expect(isScrollJump(5000, 300, height)).toBe(true);
	});

	it('flags the minimum skip distance for a 1px sentinel', () => {
		// Skipping needs the sentinel to travel from fully-below (top >= height)
		// to fully-above (top <= -1) in one frame: height + 1 pixels.
		expect(isScrollJump(0, 801, height)).toBe(true);
	});

	it('does not flag a one-viewport PageDown step', () => {
		expect(isScrollJump(0, 800, height)).toBe(false);
	});

	it('does not flag fast but continuous scroll steps', () => {
		expect(isScrollJump(1200, 1900, height)).toBe(false);
	});
});
