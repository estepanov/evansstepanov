import { describe, it, expect } from 'vitest';
import { formatDateRange, getFormattedDate } from './dates';

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

	it('formats a first-of-month ISO start without slipping a month', () => {
		expect(formatDateRange('2026-08-01', undefined, true)).toBe('August 2026 — Present');
	});

	it('formats a first-of-month ISO end without slipping a month', () => {
		expect(formatDateRange('2023-06-15', '2026-08-01')).toBe('June 2023 — August 2026');
	});
});

describe('getFormattedDate', () => {
	// ISO date strings parse as UTC midnight.
	// Reading them back with local-timezone getters rolls a 1st-of-month date into
	// the previous month for every negative-UTC-offset zone.
	it('formats a first-of-month ISO date without slipping a month', () => {
		expect(getFormattedDate(new Date('2026-08-01'))).toBe('August 2026');
	});

	it('formats a first-of-January ISO date without slipping a year', () => {
		expect(getFormattedDate(new Date('2026-01-01'))).toBe('January 2026');
	});

	it('still formats mid-month ISO dates', () => {
		expect(getFormattedDate(new Date('2023-06-15'))).toBe('June 2023');
	});
});
