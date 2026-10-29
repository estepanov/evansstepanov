import { describe, expect, it } from 'vitest';
import type { ContentEntry } from 'emdash';
import { groupBookmarksByTags } from './bookmarks-page';

function bookmarkEntry(
	id: string,
	title: string,
	url: string,
	tags: Array<{ id: string; label: string }>
): ContentEntry {
	return {
		id,
		data: {
			title,
			url,
			terms: { bookmark_tags: tags }
		}
	} as ContentEntry;
}

describe('groupBookmarksByTags', () => {
	it('returns no groups for an empty list', () => {
		expect(groupBookmarksByTags([])).toEqual([]);
	});

	it('groups a bookmark under its one tag', () => {
		const tools = { id: 'term-tools', label: 'Tools' };
		const entry = bookmarkEntry('bm-1', 'Vite', 'https://vite.dev', [tools]);

		expect(groupBookmarksByTags([entry])).toEqual([
			{
				id: 'term-tools',
				name: 'Tools',
				bookmarks: [{ id: 'bm-1', title: 'Vite', url: 'https://vite.dev' }]
			}
		]);
	});

	it('places a bookmark in each of its two tags', () => {
		const tools = { id: 'term-tools', label: 'Tools' };
		const articles = { id: 'term-articles', label: 'Articles' };
		const entry = bookmarkEntry('bm-2', 'MDN', 'https://developer.mozilla.org', [tools, articles]);

		expect(groupBookmarksByTags([entry])).toEqual([
			{
				id: 'term-tools',
				name: 'Tools',
				bookmarks: [{ id: 'bm-2', title: 'MDN', url: 'https://developer.mozilla.org' }]
			},
			{
				id: 'term-articles',
				name: 'Articles',
				bookmarks: [{ id: 'bm-2', title: 'MDN', url: 'https://developer.mozilla.org' }]
			}
		]);
	});
});
