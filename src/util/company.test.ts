import { describe, it, expect } from 'vitest';
import { companySlug, groupWorkByCompany } from './company';
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
		expect(companies[0].roles.map((r) => r.title)).toEqual([
			'Staff Engineer',
			'Senior Engineer'
		]);
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
