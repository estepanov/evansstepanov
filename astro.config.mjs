import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';

export default defineConfig({
	output: 'server',
	trailingSlash: 'always',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		svelte(),
		react(),
		emdash({
			database: sqlite({ url: 'file:./data/emdash.db' }),
			storage: local({
				directory: './data/uploads',
				baseUrl: '/_emdash/api/media/file'
			})
		})
	],
	vite: {
		plugins: [tailwindcss()]
	},
	cache: {
		provider: memoryCache()
	},
	routeRules: {
		'/': {
			maxAge: 86_400,
			swr: 604_800,
			tags: ['pages', 'links', 'companies', 'roles', 'projects', 'tech', 'quotes']
		},
		'/work': { maxAge: 86_400, swr: 604_800, tags: ['companies', 'roles', 'tech'] },
		'/work/[slug]': {
			maxAge: 86_400,
			swr: 604_800,
			tags: ['companies', 'roles', 'projects', 'tech']
		},
		'/tech': { maxAge: 86_400, swr: 604_800, tags: ['tech'] },
		'/tech/[slug]': {
			maxAge: 86_400,
			swr: 604_800,
			tags: ['tech', 'projects', 'companies', 'roles']
		},
		'/bookmarks': { maxAge: 86_400, swr: 604_800, tags: ['bookmarks'] }
	}
});
