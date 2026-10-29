import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, memoryCache } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';
import { d1, r2 } from '@emdash-cms/cloudflare';

const srcLib = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/lib');
const isCloudflare = process.env.ADAPTER === 'cloudflare';

export default defineConfig({
	output: 'server',
	trailingSlash: 'always',
	publicDir: 'static',
	adapter: isCloudflare ? cloudflare() : node({ mode: 'standalone' }),
	integrations: [
		svelte(),
		react(),
		emdash({
			database: isCloudflare ? d1({ binding: 'DB' }) : sqlite({ url: 'file:./data/emdash.db' }),
			storage: isCloudflare
				? r2({ binding: 'MEDIA' })
				: local({
						directory: './data/uploads',
						baseUrl: '/_emdash/api/media/file'
					}),
			middleware: {
				outer: './src/outer-middleware.ts'
			},
			...(isCloudflare ? { toolbar: 'client' } : {})
		})
	],
	vite: {
		ssr: isCloudflare ? undefined : { noExternal: ['cookie'] },
		plugins: [
			tailwindcss(),
			...(!isCloudflare
				? [
						{
							name: 'emdash-env-chunks',
							enforce: 'post',
							outputOptions(opts) {
								const envName = this.environment?.name ?? 'ssr';
								if (envName !== 'client') return;
								const groups = [
									{
										name: 'clsx',
										test: /node_modules[\\/]clsx(?:[\\/]|$)/,
										priority: 40
									},
									{
										name: 'react',
										test: /node_modules[\\/](?:react|react-dom|scheduler)(?:[\\/]|$)|preload-helper|modulepreload-polyfill/,
										priority: 30
									},
									{
										name: 'emdash-admin',
										test: /node_modules[\\/](?:@emdash-cms|emdash)(?:[\\/]|$)/,
										priority: 10
									}
								];
								opts.manualChunks = (id) => {
									if (/node_modules[\\/](?:react|react-dom|scheduler)(?:[\\/]|$)/.test(id)) {
										return 'react';
									}
									if (id.includes('preload-helper') || id.includes('modulepreload-polyfill')) {
										return 'react';
									}
									if (/node_modules[\\/]clsx(?:[\\/]|$)/.test(id)) return 'clsx';
									if (
										id.includes('node_modules/@emdash-cms') ||
										/node_modules[\\/]emdash(?:[\\/]|$)/.test(id)
									) {
										return 'emdash-admin';
									}
								};
								opts.codeSplitting = { groups };
							}
						}
					]
				: [])
		],
		resolve: {
			alias: {
				$lib: srcLib
			}
		}
	},
	cache: {
		provider: isCloudflare ? cacheCloudflare() : memoryCache()
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
