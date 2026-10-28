import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('emdash', () => ({
	getEmDashCollection: vi.fn(),
	getEmDashEntry: vi.fn()
}));

import { getEmDashCollection, getEmDashEntry } from 'emdash';
import {
	hydrateCollection,
	loadCompanyBySlug,
	loadTechBySlug,
	projectFromEntry,
	publishedCompanyViews,
	publishedTech
} from './emdash-content';

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

describe('publishedCompanyViews', () => {
	const awsCompany = {
		id: 'amazon-web-services',
		data: {
			slug: 'amazon-web-services',
			name: 'Amazon Web Services',
			summary: 'Older tenure.'
		}
	};
	const awsRole = {
		id: 'role-aws',
		data: {
			title: 'SDE',
			start_date: new Date('2020-01-01T00:00:00.000Z'),
			end_date: new Date('2022-01-01T00:00:00.000Z')
		},
		references: { company: { entries: [awsCompany] } }
	};

	it('skips companies whose slug is a display name', () => {
		const named = {
			id: 'CLEAR',
			data: { slug: 'CLEAR', name: 'CLEAR', summary: clearSummary }
		};
		expect(publishedCompanyViews([named], [staffRole])).toEqual([]);
	});

	it('sorts companies by newest role start descending', () => {
		const views = publishedCompanyViews(
			[awsCompany, clearCompany],
			[awsRole, staffRole, seniorRole]
		);
		expect(views.map((company) => company.slug)).toEqual(['clear', 'amazon-web-services']);
	});
});

describe('publishedTech', () => {
	it('skips a display-name slug', () => {
		expect(
			publishedTech({
				id: 'node',
				data: { slug: 'Node.js', name: 'Node.js', type: 'Runtime', proficiency: 'Expert' }
			})
		).toBeUndefined();
	});

	it('maps a kebab slug and the proficiency weight used for sort', () => {
		expect(
			publishedTech({
				id: 'node-js',
				data: { slug: 'node-js', name: 'Node.js', type: 'Runtime', proficiency: 'Expert' }
			})
		).toMatchObject({
			slug: 'node-js',
			name: 'Node.js',
			proficiencyWeight: 3
		});
		expect(
			publishedTech({
				id: 'typescript',
				data: { slug: 'typescript', name: 'TypeScript', proficiency: 'Beginner' }
			})?.proficiencyWeight
		).toBe(0);
	});
});

describe('hydrateCollection', () => {
	beforeEach(() => {
		getEntry.mockReset();
		getCollection.mockReset();
	});

	it('returns the published list without looking up when empty', async () => {
		const published = { entries: [], cacheHint: { tags: ['projects'] } };
		await expect(hydrateCollection('projects', published, { tech: true })).resolves.toBe(published);
		expect(getEntry).not.toHaveBeenCalled();
	});

	it('hydrates each entry with references and merges cache hints', async () => {
		const listed = { id: 'proj-1', data: { name: 'Site' } };
		const hydrated = {
			id: 'proj-1',
			data: { name: 'Site' },
			references: { tech: { entries: [{ data: { name: 'TypeScript' } }] } }
		};
		getEntry.mockResolvedValue({
			entry: hydrated,
			cacheHint: { tags: ['projects:proj-1'] },
			isPreview: false
		});

		const result = await hydrateCollection(
			'projects',
			{ entries: [listed], cacheHint: { tags: ['projects'] } },
			{ tech: true }
		);

		expect(getEntry).toHaveBeenCalledWith('projects', 'proj-1', { references: { tech: true } });
		expect(result.entries).toEqual([hydrated]);
		expect(result.cacheHint.tags).toEqual(['projects', 'projects:proj-1']);
	});
});

describe('projectFromEntry', () => {
	it('maps repeater image urls from src, url, and asset.url', () => {
		const project = projectFromEntry({
			id: 'site',
			data: {
				slug: 'site',
				name: 'Site',
				description: 'Portfolio',
				url: 'https://example.com',
				source: 'https://github.com/x/y',
				is_active: true,
				start_date: new Date('2024-01-01T00:00:00.000Z'),
				media: [
					{ image: { src: '/_emdash/api/media/file/abc' } },
					{ image: { url: 'https://cdn.example/shot.jpg' } },
					{ image: { asset: { url: 'https://cdn.example/asset.png' } } },
					{ image: { alt: 'no published url' } },
					null
				]
			},
			references: {
				tech: { entries: [{ data: { name: 'TypeScript' } }, { data: { name: '  ' } }] }
			}
		});

		expect(project.media).toEqual([
			'/_emdash/api/media/file/abc',
			'https://cdn.example/shot.jpg',
			'https://cdn.example/asset.png'
		]);
		expect(project.name).toBe('Site');
		expect(project.slug).toBe('site');
		expect(project.techTags).toEqual(['TypeScript']);
		expect(project.isActive).toBe(true);
	});

	it('returns an empty media list when the repeater is missing', () => {
		expect(projectFromEntry({ id: 'bare', data: { name: 'Bare' } }).media).toEqual([]);
	});
});
