import { describe, expect, it, vi } from 'vitest';
import { TechProficiency, TechType, type Tech } from '../data/tech';
import type { Project } from '../data/projects';
import type { TechPage } from './emdash-content';
import { companyFromRoles } from './company-from-roles';
import { isUrlSlug, URL_SLUG_PATTERN } from './to-url-slug';
import {
	relatedCompaniesForTech,
	relatedProjectsForTech,
	resolveTechPage,
	techDetailHref,
	techIndexSections
} from './tech-page';

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
	references: {
		tech: {
			entries: [{ data: { name: 'TypeScript', proficiency: 'Advanced' } }]
		}
	}
};

describe('resolveTechPage', () => {
	it('returns not found for Node.js without looking up tech', async () => {
		const load = vi.fn();
		await expect(resolveTechPage('Node.js', load)).resolves.toBeNull();
		expect(load).not.toHaveBeenCalled();
	});

	it('returns not found for an uppercase slug without looking up tech', async () => {
		const load = vi.fn();
		await expect(resolveTechPage('CLEAR', load)).resolves.toBeNull();
		expect(load).not.toHaveBeenCalled();
	});

	it('returns not found for an unknown url slug', async () => {
		const load = vi.fn().mockResolvedValue(null);
		await expect(resolveTechPage('missing-tech', load)).resolves.toBeNull();
		expect(load).toHaveBeenCalledWith('missing-tech');
	});

	it('loads published tech for node-js', async () => {
		const page = {
			tech: { slug: 'node-js', name: 'Node.js' },
			cacheHint: {}
		} as TechPage;
		const load = vi.fn().mockResolvedValue(page);
		await expect(resolveTechPage('node-js', load)).resolves.toBe(page);
		expect(load).toHaveBeenCalledWith('node-js');
	});
});

describe('relatedCompaniesForTech', () => {
	const clear = companyFromRoles(clearCompany, [staffRole, seniorRole]);
	const aws = companyFromRoles(awsCompany, [awsRole]);

	it('returns one company card when any role references that tech', () => {
		const cards = relatedCompaniesForTech('Node.js', [clear, aws]);

		expect(cards).toHaveLength(1);
		expect(cards[0].companySlug).toBe('clear');
		expect(isUrlSlug(cards[0].companySlug)).toBe(true);
		expect(cards[0].description).toBe(clearSummary);
		expect(cards[0].description).not.toBe(seniorRole.data.summary);
		expect(cards[0].title).toBe('Staff Software Engineer');
		expect(cards[0].techTags).toEqual(clear.techTags);
		expect(cards[0].techTags).toContain('TypeScript');
	});

	it('returns one card per matching company, not per role', () => {
		const cards = relatedCompaniesForTech('React', [clear, aws]);

		expect(cards).toHaveLength(1);
		expect(cards[0].companySlug).toBe('clear');
	});

	it('returns none when no company role references that tech', () => {
		expect(relatedCompaniesForTech('Python', [clear, aws])).toEqual([]);
	});
});

describe('relatedProjectsForTech', () => {
	const site: Project = {
		name: 'Site',
		description: '',
		url: '',
		source: '',
		media: [],
		techTags: ['TypeScript', 'Astro'],
		isActive: true,
		startDate: new Date('2024-01-01T00:00:00.000Z')
	};
	const other: Project = {
		name: 'Other',
		description: '',
		url: '',
		source: '',
		media: [],
		techTags: ['Python'],
		isActive: false
	};

	it('returns published projects whose tech tags include this tech name', () => {
		expect(relatedProjectsForTech('TypeScript', [other, site])).toEqual([site]);
	});

	it('returns none when no project lists the tech name', () => {
		expect(relatedProjectsForTech('Node.js', [other])).toEqual([]);
	});
});

describe('techDetailHref', () => {
	it('links by kebab slug with a trailing slash', () => {
		const href = techDetailHref('node-js');
		expect(href).toBe('/tech/node-js/');
		const slug = href?.slice('/tech/'.length, -1);
		expect(slug && URL_SLUG_PATTERN.test(slug)).toBe(true);
	});

	it('does not link a display name or uppercase slug', () => {
		expect(techDetailHref('Node.js')).toBeUndefined();
		expect(techDetailHref('CLEAR')).toBeUndefined();
		expect(techDetailHref(undefined)).toBeUndefined();
	});
});

describe('techIndexSections', () => {
	const node: Tech & { slug: string } = {
		slug: 'node-js',
		name: 'Node.js',
		type: TechType.Runtime,
		proficiency: TechProficiency.Expert,
		proficiencyWeight: 3
	};
	const ts: Tech & { slug: string } = {
		slug: 'typescript',
		name: 'TypeScript',
		type: TechType.Language,
		proficiency: TechProficiency.Beginner,
		proficiencyWeight: 0
	};
	const rust: Tech & { slug: string } = {
		slug: 'rust',
		name: 'Rust',
		type: TechType.Language,
		proficiency: TechProficiency.Expert,
		proficiencyWeight: 3
	};
	const untyped: Tech & { slug: string } = {
		slug: 'mystery',
		name: 'Mystery',
		proficiencyWeight: 1
	};

	it('groups by TECH_TYPE_ORDER and omits empty types', () => {
		const sections = techIndexSections([ts, node]);
		expect(sections.map((section) => section.type)).toEqual([TechType.Runtime, TechType.Language]);
		expect(sections[0].items.map((item) => item.slug)).toEqual(['node-js']);
		expect(sections[1].items.map((item) => item.slug)).toEqual(['typescript']);
	});

	it('does not invent an Other category for a missing CMS type', () => {
		const sections = techIndexSections([untyped, node]);
		expect(sections.map((section) => String(section.type).toLowerCase())).not.toContain('other');
		expect(sections.flatMap((section) => section.items.map((item) => item.slug))).toEqual([
			'node-js'
		]);
	});

	it('sorts items in a type by proficiency weight descending', () => {
		const sections = techIndexSections([ts, rust]);
		expect(sections).toHaveLength(1);
		expect(sections[0].items.map((item) => item.slug)).toEqual(['rust', 'typescript']);
	});
});
