import { TECH_NOTION_DB_ID } from '$env/static/private';
import { type Tech } from '../../data/tech';
import { mapTech } from '../../util/notion-mappers';
import { queryNotion, isFullPage } from '../../util/notion';

export async function load(): Promise<{ tech: Tech[] }> {
	const techResults = await queryNotion({
		database_id: TECH_NOTION_DB_ID as string
	});

	const tech = techResults.results.filter(isFullPage).map((page) => mapTech(page));

	return {
		tech: tech.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)
	};
}
