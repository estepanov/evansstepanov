import type { ContentEntry } from 'emdash';

export interface BookmarkItem {
	id: string;
	title: string;
	url: string;
}

export interface BookmarkTagGroup {
	id: string;
	name: string;
	bookmarks: BookmarkItem[];
}

function dataRecord(entry: ContentEntry): Record<string, unknown> {
	return entry.data as Record<string, unknown>;
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function bookmarkTags(entry: ContentEntry): Array<{ id: string; name: string }> {
	const terms = dataRecord(entry).terms;
	if (!terms || typeof terms !== 'object') return [];
	const list = (terms as Record<string, unknown>).bookmark_tags;
	if (!Array.isArray(list)) return [];

	const tags: Array<{ id: string; name: string }> = [];
	for (const item of list) {
		if (!item || typeof item !== 'object') continue;
		const record = item as Record<string, unknown>;
		const id = asString(record.id);
		const name = asString(record.label);
		if (!id || !name) continue;
		tags.push({ id, name });
	}
	return tags;
}

export function groupBookmarksByTags(entries: ContentEntry[]): BookmarkTagGroup[] {
	const groups = new Map<string, BookmarkTagGroup>();
	for (const entry of entries) {
		const data = dataRecord(entry);
		const bookmark: BookmarkItem = {
			id: entry.id,
			title: asString(data.title),
			url: asString(data.url)
		};
		for (const tag of bookmarkTags(entry)) {
			const group = groups.get(tag.id) ?? { id: tag.id, name: tag.name, bookmarks: [] };
			group.bookmarks.push(bookmark);
			groups.set(tag.id, group);
		}
	}
	return Array.from(groups.values());
}
