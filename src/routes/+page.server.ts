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
import { buildTechIdToName, mapProject, mapTech, mapWork } from '../util/notion-mappers';
import { queryNotion, isFullPage } from '../util/notion';
import { companyHighlights } from '../util/company';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionProperty = PageObjectResponse['properties'][string];

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
	const techIdToName = buildTechIdToName(tech.results.filter(isFullPage));
	const projectsResults = projects.results
		.filter(isFullPage)
		.map((page) => mapProject(page, techIdToName));
	const workResults = work.results.filter(isFullPage).map((page) => mapWork(page, techIdToName));
	const techResults = tech.results.filter(isFullPage).map((page) => mapTech(page));

	return {
		links: links.results
			.filter(isFullPage)
			.map((page) =>
				normalizeExternalLink({
					title: (page.properties.Name as Extract<NotionProperty, { type: 'title' }>).title[0]
						?.plain_text,
					url: (page.properties.URL as Extract<NotionProperty, { type: 'url' }>).url
				})
			)
			.filter((link): link is ExternalLink => Boolean(link)),
		// sort tech by highest proficiencyWeight
		tech: techResults.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight),
		// one entry per company, newest role first — a promotion must not add a card
		work: companyHighlights(workResults),
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
