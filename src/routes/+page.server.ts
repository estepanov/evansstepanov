import { Client } from "@notionhq/client"
import { NOTION_TOKEN, LANDING_LINKS_NOTION_DB_ID, PROJECTS_NOTION_DB_ID, WORK_NOTION_DB_ID, TECH_NOTION_DB_ID} from '$env/static/private';
import { TechProficiencyWeight, type Tech } from '../data/tech'
import { type Work } from '../data/work'
import { formatNotionFiles } from "../util/formate-notion-files";

const notion = new Client({
    auth: NOTION_TOKEN,
  })

export interface PageLink {
    title: string,
    url: string
}

interface Project {
    name: string,
    description: string,
    url: string,
    source: string
    tags?: string[]
    isActive?: boolean
    startDate?: Date,
    endDate?: Date,
    media: string[]
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
    const projectsResults = projects.results.map(page => ({
        name: page.properties.Name.title[0].plain_text,
        description: page.properties.Description.rich_text[0].plain_text,
        tags: page.properties.Tags.multi_select.map(tag => tag.name),
        url: page.properties.URL.url,
        source: page.properties.Source.url,
        media: formatNotionFiles(page.properties.Media.files),
        isActive: page.properties.Active.checkbox,
        startDate: page.properties.Dates.date.start ? new Date(page.properties.Dates.date.start) : undefined,
        endDate: page.properties.Dates.date.end ? new Date(page.properties.Dates.date.end) : undefined
    })) as unknown as Project[]

    const workResults = work.results.map(page => ({
        companyName: page.properties.Company.rich_text[0].plain_text,
        title: page.properties.Position.title[0].plain_text,
        description: page.properties.Summary.rich_text[0].plain_text,
        url: page.properties.URL.url,
        isCurrent: page.properties.Dates.date.end === null,
        startDate: page.properties.Dates.date.start ? new Date(page.properties.Dates.date.start) : undefined,
        endDate: page.properties.Dates.date.end ? new Date(page.properties.Dates.date.end) : undefined,
    })) as unknown as Work[]

    const techResults = tech.results.map(page => {
        return ({
        name: page.properties.Name.title[0].plain_text,
        type: page.properties.Type.select?.name,
        proficiency: page.properties.Proficiency.select.name,
        proficiencyWeight: TechProficiencyWeight[page.properties.Proficiency.select.name],
        description: page.properties.Description.rich_text[0]?.plain_text ?? undefined,
        url: page.properties.URL.url ?? undefined,
    })}) as unknown as Tech[]

    return {
        links: links.results.map(page => ({
            title: page.properties.Name.title[0].plain_text,
            url: page.properties.URL.url,
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
