import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('emdash', () => ({
	getEmDashCollection: vi.fn(),
	getEmDashEntry: vi.fn()
}));

import { getEmDashCollection, getEmDashEntry } from 'emdash';
import { loadCompanyBySlug, loadTechBySlug } from './emdash-content';

const getCollection = vi.mocked(getEmDashCollection);
const getEntry = vi.mocked(getEmDashEntry);

const clearSummary = 'Placeholder company summary for local seed.';

const clearCompany = {
	id: 'clear',
	data: {
		slug: 'clear',
		id: 'company-clear',
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
		company: { entries: [clearCompany] },
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
		company: { entries: [clearCompany] },
		tech: {
			entries: [
				{ data: { name: 'React', proficiency: 'Advanced' } },
				{ data: { name: 'Node.js', proficiency: 'Expert' } }
			]
		}
	}
};

describe('slug rejection', () => {
	beforeEach(() => {
		getEntry.mockReset();
		getCollection.mockReset();
	});

	it('returns null for a tech display name without looking it up', async () => {
		await expect(loadTechBySlug('Node.js')).resolves.toBeNull();
		expect(getEntry).not.toHaveBeenCalled();
	});

	it('returns null for a company display name without looking it up', async () => {
		await expect(loadCompanyBySlug('CLEAR')).resolves.toBeNull();
		expect(getEntry).not.toHaveBeenCalled();
	});

	it('looks up tech by kebab slug, not name', async () => {
		getEntry.mockResolvedValue({
			entry: null,
			cacheHint: {},
			isPreview: false
		});

		await expect(loadTechBySlug('node-js')).resolves.toBeNull();
		expect(getEntry).toHaveBeenCalledWith('tech', 'node-js');
		expect(getEntry).not.toHaveBeenCalledWith('tech', 'Node.js');
	});
});

describe('loadCompanyBySlug', () => {
	beforeEach(() => {
		getEntry.mockReset();
		getCollection.mockReset();
	});

	it('loads clear with hydrated roles and the authored company summary', async () => {
		getCollection.mockResolvedValue({
			entries: [staffRole, seniorRole],
			cacheHint: { tags: ['roles'] }
		});
		getEntry.mockImplementation(async (collection, slugOrId) => {
			if (collection === 'companies' && slugOrId === 'clear') {
				return { entry: clearCompany, cacheHint: { tags: ['companies:clear'] }, isPreview: false };
			}
			if (collection === 'roles' && slugOrId === staffRole.id) {
				return { entry: staffRole, cacheHint: { tags: ['roles:staff'] }, isPreview: false };
			}
			if (collection === 'roles' && slugOrId === seniorRole.id) {
				return { entry: seniorRole, cacheHint: { tags: ['roles:senior'] }, isPreview: false };
			}
			return { entry: null, cacheHint: {}, isPreview: false };
		});

		const page = await loadCompanyBySlug('clear');

		expect(getEntry).toHaveBeenCalledWith('companies', 'clear');
		expect(getCollection).toHaveBeenCalledWith('roles', { status: 'published' });
		expect(getEntry).toHaveBeenCalledWith('roles', 'role-clear-staff', {
			references: { company: true, tech: true }
		});
		expect(getEntry).toHaveBeenCalledWith('roles', 'role-clear-senior', {
			references: { company: true, tech: true }
		});

		expect(page).not.toBeNull();
		expect(page?.company.summary).toBe(clearSummary);
		expect(page?.company.summary).not.toBe(staffRole.data.summary);
		expect(page?.company.roles.length).toBeGreaterThan(0);
		expect(page?.company.roles.map((role) => role.title)).toEqual([
			'Staff Software Engineer',
			'Senior Software Engineer'
		]);
	});
});
