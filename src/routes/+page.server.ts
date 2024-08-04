import { Client } from "@notionhq/client"
import { NOTION_TOKEN, LANDING_LINKS_NOTION_DB_ID, PROJECTS_NOTION_DB_ID} from '$env/static/private';
import { type Tech, tech } from '../data/tech'
import { type Work, work } from '../data/work'

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

    return {
        links: links.results.map(page => ({
            title: page.properties.Name.title[0].plain_text,
            url: page.properties.URL.url,
        })) as unknown as PageLink[],
        tech,
        work,
        // sort projects by isActive
        projects: projectsResults.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1
            if (!a.isActive && b.isActive) return 1
            return 0
        })
    };
}
