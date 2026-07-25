import {
	LANDING_LINKS_NOTION_DB_ID,
	PROJECTS_NOTION_DB_ID,
	WORK_NOTION_DB_ID,
	TECH_NOTION_DB_ID
} from '$env/static/private';
import { type Tech } from '../data/tech';
import { type Work } from '../data/work';
import { type Project } from '../data/projects';
import { normalizeExternalLink, type ExternalLink } from '../util/links';
import {
	buildTechIdToName,
	mapProject,
	mapTech,
	mapWork
} from '../util/notion-mappers';
import { queryNotion } from '../util/notion';

interface LoadResults {
	links: ExternalLink[];
	work: Work[];
	tech: Tech[];
	projects: Project[];
}

export async function load(): Promise<LoadResults> {
	const [links, projects, work, tech] = await Promise.all([
		queryNotion({ database_id: LANDING_LINKS_NOTION_DB_ID as string }),
		queryNotion({ database_id: PROJECTS_NOTION_DB_ID as string }),
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);
	const techIdToName = buildTechIdToName(
		tech.results.filter((p): p is typeof p & { properties: object } => 'properties' in p)
	);
	const projectsResults = projects.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapProject(page as any, techIdToName));
	const workResults = work.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));
	const techResults = tech.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapTech(page as any));

	return {
		links: links.results
			.filter((page): page is any => 'properties' in page)
			.map((page) =>
				normalizeExternalLink({
					title: (page.properties.Name as any).title[0]?.plain_text,
					url: (page.properties.URL as any).url
				})
			)
			.filter((link): link is ExternalLink => Boolean(link)),
		// sort tech by highest proficiencyWeight
		tech: techResults.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight),
		// sort work by startDate
		work: workResults.sort((a, b) => {
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		}),
		// sort projects by isActive first and then by startDate
		projects: projectsResults.sort((a, b) => {
			if (a.isActive && !b.isActive) return -1;
			if (!a.isActive && b.isActive) return 1;
			if (a.startDate && b.startDate)
				return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return 0;
		})
	};
}
