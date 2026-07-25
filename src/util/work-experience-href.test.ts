import { describe, expect, it } from 'vitest';
import { workExperienceHref } from './work-experience-href';

describe('workExperienceHref', () => {
	it('returns /work/{slug} for a non-empty slug', () => {
		expect(workExperienceHref('clear')).toBe('/work/clear');
	});

	it('returns null for missing or empty slug', () => {
		expect(workExperienceHref(undefined)).toBeNull();
		expect(workExperienceHref(null)).toBeNull();
		expect(workExperienceHref('')).toBeNull();
		expect(workExperienceHref('   ')).toBeNull();
	});
});
