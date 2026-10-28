import { describe, it, expect } from 'vitest';
import { companyFromRoles, workFromCompanyView } from './company-from-roles';
import { isUrlSlug } from './to-url-slug';

const clearSummary = 'Placeholder company summary for local seed.';

const clearCompany = {
	id: 'clear',
	data: {
		slug: 'clear',
		name: 'CLEAR',
		url: 'https://www.clearme.com',
		summary: clearSummary
	}
};

const staffRole = {
	id: 'role-clear-staff',
	data: {
		title: 'Staff Software Engineer',
		summary: 'Staff role text that must not become the company summary.',
		start_date: new Date('2026-08-01T00:00:00.000Z')
	},
	references: {
		tech: {
			entries: [
				{ data: { name: 'TypeScript', proficiency: 'Expert' } },
				{ data: { name: 'React', proficiency: 'Advanced' } }
			]
		}
	}
};

const seniorRole = {
	id: 'role-clear-senior',
	data: {
		title: 'Senior Software Engineer',
		summary: 'Senior role text that must not become the company summary.',
		start_date: new Date('2023-06-15T00:00:00.000Z'),
		end_date: new Date('2026-08-01T00:00:00.000Z')
	},
	references: {
		tech: {
			entries: [
				{ data: { name: 'React', proficiency: 'Advanced' } },
				{ data: { name: 'Node.js', proficiency: 'Expert' } }
			]
		}
	}
};

describe('companyFromRoles', () => {
	it('builds one CLEAR company from two roles without deriving summary from role text', () => {
		const company = companyFromRoles(clearCompany, [staffRole, seniorRole]);

		expect(company.slug).toBe('clear');
		expect(isUrlSlug(company.slug)).toBe(true);
		expect(company.name).toBe('CLEAR');
		expect(company.url).toBe('https://www.clearme.com');
		expect(company.summary).toBe(clearSummary);
		expect(company.summary).not.toBe(staffRole.data.summary);
		expect(company.summary).not.toBe(seniorRole.data.summary);
		expect(company.roles).toHaveLength(2);
		expect(company.isCurrent).toBe(true);
		expect(company.startDate).toEqual(new Date('2023-06-15T00:00:00.000Z'));
		expect(company.endDate).toBeUndefined();
		expect(company.techTags).toEqual(['Node.js', 'TypeScript', 'React']);
	});

	it('marks current from a missing end_date and unions tech names uniquely', () => {
		const company = companyFromRoles(clearCompany, [seniorRole, staffRole]);

		expect(company.isCurrent).toBe(true);
		expect(company.techTags).toEqual(['Node.js', 'TypeScript', 'React']);
		expect(new Set(company.techTags).size).toBe(company.techTags.length);
	});

	it('lists roles newest-first and keeps each role summary on the role', () => {
		const company = companyFromRoles(clearCompany, [seniorRole, staffRole]);

		expect(company.roles.map((role) => role.title)).toEqual([
			'Staff Software Engineer',
			'Senior Software Engineer'
		]);
		expect(company.roles[0].isCurrent).toBe(true);
		expect(company.roles[0].summary).toBe(staffRole.data.summary);
		expect(company.roles[1].isCurrent).toBe(false);
		expect(company.roles[1].summary).toBe(seniorRole.data.summary);
		expect(company.roles[1].endDate).toEqual(new Date('2026-08-01T00:00:00.000Z'));
	});

	it('uses the latest role end when no role is current', () => {
		const pastCompany = {
			id: 'acme',
			data: {
				slug: 'acme',
				name: 'Acme',
				summary: 'Authored company summary.'
			}
		};
		const company = companyFromRoles(pastCompany, [
			{
				data: {
					title: 'Advisor',
					start_date: new Date('2024-01-01T00:00:00.000Z'),
					end_date: new Date('2024-06-01T00:00:00.000Z')
				}
			},
			{
				data: {
					title: 'Engineer',
					start_date: new Date('2022-01-01T00:00:00.000Z'),
					end_date: new Date('2025-01-01T00:00:00.000Z')
				}
			}
		]);

		expect(company.summary).toBe('Authored company summary.');
		expect(company.isCurrent).toBe(false);
		expect(company.startDate).toEqual(new Date('2022-01-01T00:00:00.000Z'));
		expect(company.endDate).toEqual(new Date('2025-01-01T00:00:00.000Z'));
	});
});

describe('workFromCompanyView', () => {
	it('maps the authored company summary onto the card, not role text', () => {
		const company = companyFromRoles(clearCompany, [staffRole, seniorRole]);
		const work = workFromCompanyView(company);

		expect(work.companySlug).toBe('clear');
		expect(work.companyName).toBe('CLEAR');
		expect(work.title).toBe('Staff Software Engineer');
		expect(work.description).toBe(clearSummary);
		expect(work.description).not.toBe(staffRole.data.summary);
		expect(work.isCurrent).toBe(true);
		expect(work.techTags).toEqual(company.techTags);
	});

	it('falls back to the company name when there are no roles', () => {
		const company = companyFromRoles(clearCompany, []);
		const work = workFromCompanyView(company);

		expect(work.title).toBe('CLEAR');
		expect(work.description).toBe(clearSummary);
	});
});
