import { describe, it, expect } from 'vitest';
import { isScrollJump } from './stuck-state';

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
