import { describe, expect, it } from 'vitest';
import { coverProgress } from './gridCardGlare';

describe('coverProgress', () => {
	const viewport = 800;
	const height = 44;

	it('is 0 when the subject top sits at the scrollport bottom (cover 0%)', () => {
		expect(coverProgress(viewport, height, viewport)).toBe(0);
	});

	it('is 1 when the subject bottom exits the scrollport top (cover 100%)', () => {
		expect(coverProgress(-height, height, viewport)).toBe(1);
	});

	it('is 0.5 halfway through the cover range', () => {
		expect(coverProgress((viewport - height) / 2, height, viewport)).toBeCloseTo(0.5, 5);
	});

	it('clamps progress outside the cover range', () => {
		expect(coverProgress(viewport + 400, height, viewport)).toBe(0);
		expect(coverProgress(-height - 400, height, viewport)).toBe(1);
	});

	it('returns 0 for a degenerate span instead of dividing by zero', () => {
		expect(coverProgress(10, 0, 0)).toBe(0);
	});
});
