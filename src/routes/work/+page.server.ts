import { WORK_NOTION_DB_ID, TECH_NOTION_DB_ID } from '$env/static/private';
import type { Company } from '../../data/work';
import { groupWorkByCompany } from '../../util/company';
import { buildTechIdToName, mapWork } from '../../util/notion-mappers';
import { queryNotion } from '../../util/notion';

export async function load(): Promise<{ companies: Company[] }> {
	const [work, tech] = await Promise.all([
		queryNotion({ database_id: WORK_NOTION_DB_ID as string }),
		queryNotion({ database_id: TECH_NOTION_DB_ID as string })
	]);

	const techIdToName = buildTechIdToName(
		tech.results.filter((p): p is typeof p & { properties: object } => 'properties' in p) as any
	);

	const roles = work.results
		.filter((page): page is typeof page & { properties: object } => 'properties' in page)
		.map((page) => mapWork(page as any, techIdToName));

	return { companies: groupWorkByCompany(roles) };
}
