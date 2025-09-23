import { Client } from "@notionhq/client"
import { NOTION_TOKEN, LANDING_LINKS_NOTION_DB_ID, PROJECTS_NOTION_DB_ID, WORK_NOTION_DB_ID, TECH_NOTION_DB_ID} from '$env/static/private';
import { TechProficiencyWeight, type Tech } from '../data/tech'
import { type Work } from '../data/work'
import { type Project } from '../data/projects'
import { formatNotionFiles } from "../util/formate-notion-files";

const notion = new Client({
    auth: NOTION_TOKEN,
  })

export interface PageLink {
    title: string,
    url: string
}


interface LoadResults {
    links: PageLink[]
    work: Work[]
    tech: Tech[]
    projects: Project[]
}

export async function load(): Promise<LoadResults> {
    const links = await notion.databases.query({
        database_id: LANDING_LINKS_NOTION_DB_ID as string
    })
    const projects = await notion.databases.query({
        database_id: PROJECTS_NOTION_DB_ID as string
    })
    const work = await notion.databases.query({
        database_id: WORK_NOTION_DB_ID as string
    })
    const tech = await notion.databases.query({
        database_id: TECH_NOTION_DB_ID as string
    })
// console.log(projects.results.map(p => p.properties.Media.files[0]))
    const projectsResults = projects.results
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
        })) as unknown as Project[]

    const workResults = work.results
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
        })) as unknown as Work[]

    const techResults = tech.results
        .filter((page): page is any => 'properties' in page)
        .map(page => {
            return ({
                name: (page.properties.Name as any).title[0].plain_text,
                type: (page.properties.Type as any).select?.name,
                proficiency: (page.properties.Proficiency as any).select.name,
                proficiencyWeight: TechProficiencyWeight[(page.properties.Proficiency as any).select.name as keyof typeof TechProficiencyWeight],
                description: (page.properties.Description as any).rich_text[0]?.plain_text ?? undefined,
                url: (page.properties.URL as any).url ?? undefined,
            })
        }) as unknown as Tech[]

    return {
        links: links.results
            .filter((page): page is any => 'properties' in page)
            .map(page => ({
                title: (page.properties.Name as any).title[0].plain_text,
                url: (page.properties.URL as any).url,
            })) as unknown as PageLink[],
        // sort tech by highest proficiencyWeight
        tech: techResults.sort((a, b) => b.proficiencyWeight - a.proficiencyWeight),
        // sort work by startDate
        work: workResults.sort((a, b) => {
            if (a.startDate && b.startDate) return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            return 0
        }),
        // sort projects by isActive first and then by startDate
        projects: projectsResults.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            if (a.startDate && b.startDate) return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            return 0
        })
    };
}
