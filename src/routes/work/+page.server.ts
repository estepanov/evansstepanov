import { WORK_NOTION_DB_ID, TECH_NOTION_DB_ID } from '$env/static/private';
import type { Company } from '../../data/work';
import { groupWorkByCompany } from '../../util/company';
import { buildTechIdToName, isFullPage, mapWork } from '../../util/notion-mappers';
import { queryNotion } from '../../util/notion';

export async function load(): Promise<{ companies: Company[] }> {
	const [work, tech] = await Promise.all([
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);

	const techIdToName = buildTechIdToName(tech.results.filter(isFullPage));

	const roles = work.results.filter(isFullPage).map((page) => mapWork(page, techIdToName));

	return { companies: groupWorkByCompany(roles) };
}
