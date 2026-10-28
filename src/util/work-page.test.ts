import { describe, expect, it, vi } from 'vitest';
import type { Project } from '../data/projects';
import type { CompanyPage } from './emdash-content';
import { relatedProjectsForCompany, resolveCompanyPage, techChipHref } from './work-page';

describe('resolveCompanyPage', () => {
	it('returns not found for Node.js without looking up a company', async () => {
		const load = vi.fn();
		await expect(resolveCompanyPage('Node.js', load)).resolves.toBeNull();
		expect(load).not.toHaveBeenCalled();
	});

	it('returns not found for CLEAR without looking up a company', async () => {
		const load = vi.fn();
		await expect(resolveCompanyPage('CLEAR', load)).resolves.toBeNull();
		expect(load).not.toHaveBeenCalled();
	});

	it('returns not found for an unknown url slug', async () => {
		const load = vi.fn().mockResolvedValue(null);
		await expect(resolveCompanyPage('missing-co', load)).resolves.toBeNull();
		expect(load).toHaveBeenCalledWith('missing-co');
	});

	it('loads a published company for clear', async () => {
		const page = {
			company: { slug: 'clear', name: 'CLEAR' },
			cacheHint: {}
		} as CompanyPage;
		const load = vi.fn().mockResolvedValue(page);
		await expect(resolveCompanyPage('clear', load)).resolves.toBe(page);
		expect(load).toHaveBeenCalledWith('clear');
	});
});

describe('relatedProjectsForCompany', () => {
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

	it('returns projects whose tech tags intersect the company tags', () => {
		expect(relatedProjectsForCompany(['TypeScript', 'React'], [other, site])).toEqual([site]);
	});

	it('returns none when there is no intersection', () => {
		expect(relatedProjectsForCompany(['React'], [other])).toEqual([]);
	});
});

describe('techChipHref', () => {
	it('links by published slug, never by display name', () => {
		expect(techChipHref('Node.js', [{ name: 'Node.js', slug: 'node-js' }])).toBe('/tech/node-js/');
	});

	it('does not link a name with no published url slug', () => {
		expect(techChipHref('Node.js', [])).toBeUndefined();
		expect(techChipHref('Node.js', [{ name: 'Node.js', slug: 'Node.js' }])).toBeUndefined();
	});
});
