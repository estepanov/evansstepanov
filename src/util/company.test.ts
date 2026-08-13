import { describe, it, expect } from 'vitest';
import { companySlug, groupWorkByCompany, companyHighlights } from './company';
import type { Work } from '../data/work';

const role = (partial: Partial<Work> & Pick<Work, 'companyName' | 'title'>): Work => ({
	description: 'Summary',
	url: 'https://example.com',
	companySlug: companySlug(partial.companyName),
	techTags: [],
	...partial
});

describe('companySlug', () => {
	it('kebab-cases and strips punctuation', () => {
		expect(companySlug('Amazon Web Services')).toBe('amazon-web-services');
		expect(companySlug('CLEAR')).toBe('clear');
		expect(companySlug('  Foo & Bar Co. ')).toBe('foo-bar-co');
	});
});

describe('groupWorkByCompany', () => {
	it('merges roles at the same company onto one page', () => {
		const work: Work[] = [
			role({
				companyName: 'CLEAR',
				title: 'Staff Engineer',
				startDate: new Date('2022-01-01'),
				isCurrent: true,
				techTags: ['TypeScript', 'React']
			}),
			role({
				companyName: 'CLEAR',
				title: 'Senior Engineer',
				startDate: new Date('2020-01-01'),
				endDate: new Date('2021-12-31'),
				isCurrent: false,
				techTags: ['React', 'Node']
			}),
			role({
				companyName: 'AWS',
				title: 'SDE',
				startDate: new Date('2018-06-01'),
				endDate: new Date('2019-12-31'),
				isCurrent: false,
				techTags: ['Java']
			})
		];

		const companies = groupWorkByCompany(work);
		expect(companies.map((c) => c.slug)).toEqual(['clear', 'aws']);
		expect(companies[0].roles.map((r) => r.title)).toEqual(['Staff Engineer', 'Senior Engineer']);
		expect(companies[0].isCurrent).toBe(true);
		expect(companies[0].techTags.sort()).toEqual(['Node', 'React', 'TypeScript']);
		expect(companies[0].startDate).toEqual(new Date('2020-01-01'));
		expect(companies[0].endDate).toBeUndefined();
	});

	it('sorts companies by latest role startDate descending', () => {
		const work: Work[] = [
			role({
				companyName: 'Old Co',
				title: 'Eng',
				startDate: new Date('2015-01-01'),
				endDate: new Date('2016-01-01')
			}),
			role({
				companyName: 'New Co',
				title: 'Eng',
				startDate: new Date('2023-01-01'),
				isCurrent: true
			})
		];
		expect(groupWorkByCompany(work).map((c) => c.slug)).toEqual(['new-co', 'old-co']);
	});
});

describe('companyHighlights', () => {
	const clearRoles = (): Work[] => [
		role({
			companyName: 'CLEAR',
			title: 'Senior Software Engineer',
			description: 'Senior summary',
			startDate: new Date('2023-06-15'),
			endDate: new Date('2026-08-01'),
			isCurrent: false,
			techTags: ['TypeScript']
		}),
		role({
			companyName: 'CLEAR',
			title: 'Staff Software Engineer',
			description: 'Staff summary',
			startDate: new Date('2026-08-01'),
			isCurrent: true,
			techTags: ['React']
		})
	];

	it('collapses roles at one company to a single entry titled with the newest role', () => {
		const highlights = companyHighlights(clearRoles());

		expect(highlights).toHaveLength(1);
		expect(highlights[0].title).toBe('Staff Software Engineer');
		expect(highlights[0].companyName).toBe('CLEAR');
		expect(highlights[0].companySlug).toBe('clear');
	});

	it('describes the company with the current role summary', () => {
		// The current role is deliberately NOT the newest-started one, so
		// company.summary ('Staff summary') and roles[0].description
		// ('Advisor summary') differ and the assertion can only pass if the
		// highlight sources its description from the company summary.
		const work: Work[] = [
			role({
				companyName: 'CLEAR',
				title: 'Staff Software Engineer',
				description: 'Staff summary',
				startDate: new Date('2026-08-01'),
				isCurrent: true
			}),
			role({
				companyName: 'CLEAR',
				title: 'Advisor',
				description: 'Advisor summary',
				startDate: new Date('2026-09-01'),
				isCurrent: false
			})
		];

		expect(companyHighlights(work)[0].description).toBe('Staff summary');
	});

	it('spans the full company tenure rather than the newest role start', () => {
		const highlight = companyHighlights(clearRoles())[0];

		expect(highlight.startDate).toEqual(new Date('2023-06-15'));
		expect(highlight.endDate).toBeUndefined();
		expect(highlight.isCurrent).toBe(true);
	});

	it('unions tech tags across every role at the company', () => {
		expect([...companyHighlights(clearRoles())[0].techTags!].sort()).toEqual([
			'React',
			'TypeScript'
		]);
	});

	it('passes single-role companies through and orders companies newest first', () => {
		const work: Work[] = [
			role({
				companyName: 'Old Co',
				title: 'Engineer',
				startDate: new Date('2015-01-01'),
				endDate: new Date('2016-01-01')
			}),
			role({
				companyName: 'New Co',
				title: 'Staff Engineer',
				startDate: new Date('2023-01-01'),
				isCurrent: true
			})
		];

		const highlights = companyHighlights(work);

		expect(highlights.map((h) => h.title)).toEqual(['Staff Engineer', 'Engineer']);
		expect(highlights[1].endDate).toEqual(new Date('2016-01-01'));
	});
});
