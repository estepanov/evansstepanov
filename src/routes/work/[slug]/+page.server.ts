import {
	WORK_NOTION_DB_ID,
	TECH_NOTION_DB_ID,
	PROJECTS_NOTION_DB_ID
} from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Company } from '../../../data/work';
import type { Tech } from '../../../data/tech';
import type { Project } from '../../../data/projects';
import { groupWorkByCompany } from '../../../util/company';
import {
	buildTechIdToName,
	mapProject,
	mapTech,
	mapWork
} from '../../../util/notion-mappers';
import { queryNotion } from '../../../util/notion';

async function loadCompaniesAndTech() {
	const [work, tech] = await Promise.all([
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);
	const techPages = tech.results.filter(
		(p): p is typeof p & { properties: object } => 'properties' in p
	);
	const techIdToName = buildTechIdToName(techPages as any);
	const allTech = techPages.map((p) => mapTech(p as any));
	const roles = work.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));
	return { companies: groupWorkByCompany(roles), allTech, techIdToName, techPages };
}

export async function entries() {
	const { companies } = await loadCompaniesAndTech();
	return companies.map((c) => ({ slug: c.slug }));
}

export async function load({
	params
}): Promise<{ company: Company; allTech: Tech[]; relatedProjects: Project[] }> {
	const { companies, allTech, techIdToName } = await loadCompaniesAndTech();
	const company = companies.find((c) => c.slug === params.slug);
	if (!company) throw error(404, 'Work experience not found');

	const projectsResult = await queryNotion({ database_id: PROJECTS_NOTION_DB_ID as string });
	const companyTagSet = new Set(company.techTags);
	const relatedProjects = projectsResult.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapProject(page as any, techIdToName))
		.filter((p) => (p.techTags ?? []).some((t) => companyTagSet.has(t)))
		.sort((a, b) => {
			if (a.isActive && !b.isActive) return -1;
			if (!a.isActive && b.isActive) return 1;
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		});

	return { company, allTech, relatedProjects };
}
