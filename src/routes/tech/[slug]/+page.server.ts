import {
	TECH_NOTION_DB_ID,
	PROJECTS_NOTION_DB_ID,
	WORK_NOTION_DB_ID
} from '$env/static/private';
import { type Tech } from '../../../data/tech';
import { type Work } from '../../../data/work';
import { type Project } from '../../../data/projects';
import {
	buildTechIdToName,
	mapProject,
	mapTech,
	mapWork
} from '../../../util/notion-mappers';
import { queryNotion } from '../../../util/notion';
import { error } from '@sveltejs/kit';

export async function load({
	params
}): Promise<{ tech: Tech; allTech: Tech[]; relatedProjects: Project[]; relatedWork: Work[] }> {
	const { slug } = params;

	// Query the tech database to find the tech item by name
	const techResults = await queryNotion({
		database_id: TECH_NOTION_DB_ID as string,
		filter: {
			property: 'Name',
			title: {
				equals: slug
			}
		}
	});

	if (techResults.results.length === 0) {
		throw error(404, 'Tech item not found');
	}

	const techPage = techResults.results[0];
	if (!('properties' in techPage)) {
		throw error(404, 'Tech item not found');
	}
	const techId = techPage.id;

	const [allTech, relatedProjectsResults, relatedWorkResults] = await Promise.all([
		queryNotion({ database_id: TECH_NOTION_DB_ID as string }),
		queryNotion({
			database_id: PROJECTS_NOTION_DB_ID as string,
			filter: { property: 'Tech Tags', relation: { contains: techId } }
		}),
		queryNotion({
			database_id: WORK_NOTION_DB_ID as string,
			filter: { property: 'Tech Tags', relation: { contains: techId } }
		})
	]);

	const techIdToName = buildTechIdToName(
		allTech.results.filter((p): p is typeof p & { properties: object } => 'properties' in p)
	);
	const allTechItems = allTech.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapTech(page as any));

	const tech = mapTech(techPage as any);

	const relatedProjects = relatedProjectsResults.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapProject(page as any, techIdToName));

	const relatedWork = relatedWorkResults.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));

	return {
		tech,
		allTech: allTechItems,
		// sort work by startDate
		relatedWork: relatedWork.sort((a, b) => {
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		}),
		// sort projects by isActive first and then by startDate
		relatedProjects: relatedProjects.sort((a, b) => {
			if (a.isActive && !b.isActive) return -1;
			if (!a.isActive && b.isActive) return 1;
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		})
	};
}
