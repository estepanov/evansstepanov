import { Client } from "@notionhq/client"
import { NOTION_TOKEN, LANDING_LINKS_NOTION_DB_ID, PROJECTS_NOTION_DB_ID, WORK_NOTION_DB_ID} from '$env/static/private';
import { type Tech, tech } from '../data/tech'
import { type Work } from '../data/work'

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

    const projectsResults = projects.results.map(page => ({
        name: page.properties.Name.title[0].plain_text,
        description: page.properties.Description.rich_text[0].plain_text,
        tags: page.properties.Tags.multi_select.map(tag => tag.name),
        url: page.properties.URL.url,
        source: page.properties.Source.url,
        // media: page.properties.Media.files,
        media: [],
        isActive: page.properties.Active.checkbox
    })) as unknown as Project[]

    const workResults = work.results.map(page => ({
        companyName: page.properties.Company.rich_text[0].plain_text,
        title: page.properties.Position.title[0].plain_text,
        description: page.properties.Summary.rich_text[0].plain_text,
        url: page.properties.URL.url,
        isCurrent: page.properties.Dates.date.end === null,
        startDate: page.properties.Dates.date.start ? new Date(page.properties.Dates.date.start).toUTCString() : undefined,
        endDate: page.properties.Dates.date.end ? new Date(page.properties.Dates.date.end).toUTCString() : undefined,
    })) as unknown as Work[]

    return {
        links: links.results.map(page => ({
            title: page.properties.Name.title[0].plain_text,
            url: page.properties.URL.url,
        })) as unknown as PageLink[],
        tech,
        // sort work by startDate
        work: workResults.sort((a, b) => {
            if (a.startDate && b.startDate) return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            return 0
        }),
        // sort projects by isActive
        projects: projectsResults.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            return 0
        })
    };
}
