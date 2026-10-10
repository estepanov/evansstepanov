import { queryNotion } from '../../util/notion';
import { BOOKMARKS_NOTION_DB_ID } from '$env/static/private';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type BookmarkProperty = PageObjectResponse['properties'][string];
type TitleProperty = Extract<BookmarkProperty, { type: 'title' }>;
type MultiSelectProperty = Extract<BookmarkProperty, { type: 'multi_select' }>;
type UrlProperty = Extract<BookmarkProperty, { type: 'url' }>;

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

	const allLinks: Link[] = links.results
		.filter((result): result is PageObjectResponse => 'properties' in result)
		.map((result) => {
			const name = result.properties.Name as TitleProperty;
			const tags = result.properties.Tags as MultiSelectProperty;
			const url = result.properties.URL as UrlProperty;

			return {
				id: result.id,
				created_time: result.created_time,
				Name: name.title[0].plain_text,
				Tags: tags.multi_select.map((tag) => ({ ...tag, Links: [] })),
				URL: url.url ?? '',
				Links: []
			};
		});

	const tags = Array.from(
		allLinks
			.reduce((accumMap, currentLink) => {
				currentLink.Tags.forEach((tag) => {
					if (!accumMap.has(tag.id)) {
						accumMap.set(tag.id, tag);
					}

					const currentTag = accumMap.get(tag.id);
					if (!currentTag) return;
					const currentLinks = currentTag.Links;
					currentTag.Links = [...currentLinks, currentLink];

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
