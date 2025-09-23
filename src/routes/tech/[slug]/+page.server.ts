import { Client } from "@notionhq/client"
import { NOTION_TOKEN, TECH_NOTION_DB_ID, PROJECTS_NOTION_DB_ID, WORK_NOTION_DB_ID } from '$env/static/private';
import { TechProficiencyWeight, type Tech } from '../../../data/tech'
import { type Work } from '../../../data/work'
import { type Project } from '../../../data/projects'
import { formatNotionFiles } from '../../../util/formate-notion-files'
import { error } from '@sveltejs/kit';

const notion = new Client({
    auth: NOTION_TOKEN,
})

export async function load({ params }): Promise<{ tech: Tech, relatedProjects: Project[], relatedWork: Work[] }> {
    const { slug } = params;
    
    // Query the tech database to find the tech item by name
    const techResults = await notion.databases.query({
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
    
    const tech: Tech = {
        name: (techPage.properties.Name as any).title[0].plain_text,
        type: (techPage.properties.Type as any).select?.name,
        proficiency: (techPage.properties.Proficiency as any).select.name,
        proficiencyWeight: TechProficiencyWeight[(techPage.properties.Proficiency as any).select.name as keyof typeof TechProficiencyWeight],
        description: (techPage.properties.Description as any).rich_text[0]?.plain_text ?? undefined,
        url: (techPage.properties.URL as any).url ?? undefined,
    };

    // Fetch related projects that have this tech tag
    const relatedProjectsResults = await notion.databases.query({
        database_id: PROJECTS_NOTION_DB_ID as string,
        filter: {
            property: 'Tech Tags',
            relation: {
                contains: techId
            }
        }
    });

    const relatedProjects: Project[] = relatedProjectsResults.results
        .filter((page): page is any => 'properties' in page)
        .map(page => ({
            name: (page.properties.Name as any).title[0].plain_text,
            description: (page.properties.Description as any).rich_text[0].plain_text,
            tags: (page.properties.Tags as any).multi_select.map((tag: any) => tag.name),
            techTags: (page.properties['Tech Tags'] as any)?.relation?.map((relation: any) => relation.id) || [],
            url: (page.properties.URL as any).url,
            source: (page.properties.Source as any).url,
            media: formatNotionFiles((page.properties.Media as any).files),
            isActive: (page.properties.Active as any).checkbox,
            startDate: (page.properties.Dates as any).date.start ? new Date((page.properties.Dates as any).date.start) : undefined,
            endDate: (page.properties.Dates as any).date.end ? new Date((page.properties.Dates as any).date.end) : undefined
        }));

    // Fetch related work that has this tech tag
    const relatedWorkResults = await notion.databases.query({
        database_id: WORK_NOTION_DB_ID as string,
        filter: {
            property: 'Tech Tags',
            relation: {
                contains: techId
            }
        }
    });

    const relatedWork: Work[] = relatedWorkResults.results
        .filter((page): page is any => 'properties' in page)
        .map(page => ({
            companyName: (page.properties.Company as any).rich_text[0].plain_text,
            title: (page.properties.Position as any).title[0].plain_text,
            description: (page.properties.Summary as any).rich_text[0].plain_text,
            url: (page.properties.URL as any).url,
            techTags: (page.properties['Tech Tags'] as any)?.relation?.map((relation: any) => relation.id) || [],
            isCurrent: (page.properties.Dates as any).date.end === null,
            startDate: (page.properties.Dates as any).date.start ? new Date((page.properties.Dates as any).date.start) : undefined,
            endDate: (page.properties.Dates as any).date.end ? new Date((page.properties.Dates as any).date.end) : undefined,
        }));

    return {
        tech,
        // sort work by startDate
        relatedWork: relatedWork.sort((a, b) => {
            if (a.startDate && b.startDate) return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            return 0
        }),
        // sort projects by isActive first and then by startDate
        relatedProjects: relatedProjects.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            if (a.startDate && b.startDate) return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            return 0
        })
    };
}
