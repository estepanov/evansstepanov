import { Client } from "@notionhq/client"
import { NOTION_TOKEN, LANDING_LINKS_NOTION_DB_ID} from '$env/static/private';

const notion = new Client({
    auth: NOTION_TOKEN,
  })

export interface PageLink {
    title: string,
    url: string
}

interface LoadResults {
    links: PageLink[]
}

export async function load(): Promise<LoadResults> {
    const links = await notion.databases.query({
        database_id: LANDING_LINKS_NOTION_DB_ID as string
    })
    return {
        links: links.results.map(page => ({
            title: page.properties.Name.title[0].plain_text,
            url: page.properties.URL.url,
        })) as unknown as PageLink[]
    };
}
