import { describe, it, expect } from 'vitest';
import { formatDateRange } from './dates';

describe('formatDateRange', () => {
	it('returns empty string when start is missing', () => {
		expect(formatDateRange(undefined, new Date(2024, 0, 1))).toBe('');
	});

	it('formats a ranged tenure', () => {
		expect(formatDateRange(new Date(2020, 0, 15), new Date(2021, 11, 1))).toBe(
			'January 2020 — December 2021'
		);
	});

	it('appends Present when isCurrent', () => {
		expect(formatDateRange(new Date(2022, 2, 1), new Date(2024, 0, 1), true)).toBe(
			'March 2022 — Present'
		);
	});

	it('treats start-only as Present', () => {
		expect(formatDateRange(new Date(2022, 5, 1), undefined)).toBe('June 2022 — Present');
		expect(formatDateRange('2022-06-15', undefined, false)).toBe('June 2022 — Present');
	});
});
