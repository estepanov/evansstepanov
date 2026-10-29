import { describe, expect, it } from 'vitest';
import seed from '../seed/seed.json';
import { legacyTechPaths } from '../src/util/legacy-tech-path';
import { missingNotionEnv, redirectsForTech } from './import-notion';

describe('missingNotionEnv', () => {
	it('lists every required Notion var when empty', () => {
		expect(missingNotionEnv({})).toEqual([
			'NOTION_TOKEN',
			'TECH_NOTION_DB_ID',
			'WORK_NOTION_DB_ID',
			'PROJECTS_NOTION_DB_ID',
			'LANDING_LINKS_NOTION_DB_ID',
			'BOOKMARKS_NOTION_DB_ID'
		]);
	});
});

describe('redirectsForTech', () => {
	it('308s Node.js sources onto /tech/node-js/', () => {
		const rules = redirectsForTech([{ name: 'Node.js', slug: 'node-js' }]);
		for (const source of legacyTechPaths('Node.js', 'node-js')) {
			expect(rules).toContainEqual({
				source,
				destination: '/tech/node-js/',
				type: 308,
				enabled: true,
				groupName: 'legacy-tech'
			});
		}
		expect(rules.some((rule) => rule.source === '/tech/node-js/')).toBe(false);
	});
});

describe('seed redirects', () => {
	it('covers every Node.js legacy path', () => {
		const redirects = seed.redirects ?? [];
		for (const source of legacyTechPaths('Node.js', 'node-js')) {
			expect(redirects).toContainEqual(
				expect.objectContaining({
					source,
					destination: '/tech/node-js/',
					type: 308
				})
			);
		}
	});
});
