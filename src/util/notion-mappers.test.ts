import { describe, it, expect } from 'vitest';
import {
	buildTechIdToName,
	mapTech,
	mapWork,
	mapProject,
	resolveTechTags
} from './notion-mappers';

const techPage = {
	id: 'tech-1',
	properties: {
		Name: { title: [{ plain_text: 'TypeScript' }] },
		Type: { select: { name: 'Language' } },
		Proficiency: { select: { name: 'Expert' } },
		Description: { rich_text: [{ plain_text: 'Typed JS' }] },
		URL: { url: 'https://www.typescriptlang.org/' }
	}
};

const workPage = {
	id: 'work-1',
	properties: {
		Company: { rich_text: [{ plain_text: 'CLEAR' }] },
		Position: { title: [{ plain_text: 'Staff Engineer' }] },
		Summary: { rich_text: [{ plain_text: 'Built things' }] },
		URL: { url: 'https://www.clearme.com' },
		'Tech Tags': { relation: [{ id: 'tech-1' }] },
		Dates: { date: { start: '2022-01-15', end: null } }
	}
};

describe('notion mappers', () => {
	it('maps tech and resolves work tech tags + companySlug', () => {
		const idToName = buildTechIdToName([techPage]);
		expect(idToName.get('tech-1')).toBe('TypeScript');

		const tech = mapTech(techPage);
		expect(tech.name).toBe('TypeScript');
		expect(tech.proficiencyWeight).toBe(3);

		const work = mapWork(workPage, idToName);
		expect(work.companyName).toBe('CLEAR');
		expect(work.companySlug).toBe('clear');
		expect(work.isCurrent).toBe(true);
		expect(work.techTags).toEqual(['TypeScript']);
		expect(resolveTechTags([{ id: 'tech-1' }, { id: 'missing' }], idToName)).toEqual([
			'TypeScript'
		]);
	});

	it('maps project media via formatNotionFiles contract', () => {
		const idToName = buildTechIdToName([techPage]);
		const project = mapProject(
			{
				properties: {
					Name: { title: [{ plain_text: 'Site' }] },
					Description: { rich_text: [{ plain_text: 'Portfolio' }] },
					Tags: { multi_select: [{ name: 'web' }] },
					'Tech Tags': { relation: [{ id: 'tech-1' }] },
					URL: { url: 'https://example.com' },
					Source: { url: 'https://github.com/x/y' },
					Media: { files: [] },
					Active: { checkbox: true },
					Dates: { date: { start: '2024-01-01', end: null } }
				}
			},
			idToName
		);
		expect(project.name).toBe('Site');
		expect(project.techTags).toEqual(['TypeScript']);
		expect(project.media).toEqual([]);
		expect(project.isActive).toBe(true);
	});
});
