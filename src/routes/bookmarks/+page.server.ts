import { notion } from '../../util/notion';
import { BOOKMARKS_NOTION_DB_ID } from '$env/static/private';

export interface Link {
    id: string,
    created_time: string
    Name: string
    Tags: Tag[]
    URL: string
}

interface Tag {
    id: string
    name: string
    color: string
    Links: Link[]
}

export async function load() {
    const links = await notion.databases.query({
        database_id: BOOKMARKS_NOTION_DB_ID as string
    })

    const allLinks: Link[] = links.results.map(result => ({
        id: result.id,
        created_time: result.created_time,
        Name: result.properties.Name.title[0].plain_text,
        Tags: result.properties.Tags.multi_select,
        URL: result.properties.URL.url,
        Links: []
    }))

    const tags = Array.from(allLinks.reduce((accumMap, currentLink) => {

        currentLink.Tags.forEach((tag) => {
            if(!accumMap.has(tag.id)) {
                accumMap.set(tag.id, tag)
            }


            const currentTag = accumMap.get(tag.id)
            const currentLinks = currentTag?.Links || []
            currentTag.Links = [...currentLinks, currentLink]

            accumMap.set(tag.id, currentTag)
        })

        return accumMap

    }, new Map<string, Tag>()).values());

    return {
        links: allLinks,
        tags: tags,
        lastChecked: new Date().toLocaleDateString()
    };
}
