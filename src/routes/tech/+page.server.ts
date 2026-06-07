import { TECH_NOTION_DB_ID } from '$env/static/private';
import { TechProficiencyWeight, type Tech } from '../../data/tech'
import { queryNotion } from '../../util/notion'

export async function load(): Promise<{ tech: Tech[] }> {
    const techResults = await queryNotion({
        database_id: TECH_NOTION_DB_ID as string
    });

    const tech = techResults.results
        .filter((page): page is any => 'properties' in page)
        .map(page => ({
            name: page.properties.Name.title[0]?.plain_text,
            type: page.properties.Type.select?.name,
            proficiency: page.properties.Proficiency.select.name,
            proficiencyWeight: TechProficiencyWeight[page.properties.Proficiency.select.name],
            description: page.properties.Description.rich_text[0]?.plain_text ?? undefined,
            url: page.properties.URL.url ?? undefined,
        })) as unknown as Tech[];

    return {
        tech: tech.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight)
    };
}
