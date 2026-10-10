import { queryNotion } from '../../util/notion';
import { BOOKMARKS_NOTION_DB_ID } from '$env/static/private';

export interface Link {
	id: string;
	created_time: string;
	Name: string;
	Tags: Tag[];
	URL: string;
}

interface Tag {
	id: string;
	name: string;
	color: string;
	Links: Link[];
}

export async function load() {
	const links = await queryNotion({
		database_id: BOOKMARKS_NOTION_DB_ID as string
	});

	const allLinks: Link[] = links.results.flatMap((result) => {
		if (!('properties' in result)) return [];

		const name = result.properties.Name;
		const tags = result.properties.Tags;
		const url = result.properties.URL;
		if (name?.type !== 'title' || tags?.type !== 'multi_select' || url?.type !== 'url') {
			return [];
		}

		return [
			{
				id: result.id,
				created_time: result.created_time,
				Name: name.title[0]?.plain_text ?? '',
				Tags: tags.multi_select.map((tag) => ({ ...tag, Links: [] as Link[] })),
				URL: url.url ?? '',
				Links: [] as Link[]
			}
		];
	});

	const tags = Array.from(
		allLinks
			.reduce((accumMap, currentLink) => {
				currentLink.Tags.forEach((tag) => {
					const currentTag = accumMap.get(tag.id) ?? { ...tag, Links: [] };
					currentTag.Links = [...currentTag.Links, currentLink];
					accumMap.set(tag.id, currentTag);
				});

				return accumMap;
			}, new Map<string, Tag>())
			.values()
	);

	return {
		links: allLinks,
		tags: tags,
		lastChecked: new Date().toLocaleDateString()
	};
}
