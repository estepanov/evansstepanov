import { afterEach, describe, expect, it, vi } from 'vitest';
import seed from '../seed/seed.json';
import type { Project } from '../src/data/projects';
import type { Tech } from '../src/data/tech';
import type { Work } from '../src/data/work';
import { companySlug } from '../src/util/company';
import { legacyTechPaths } from '../src/util/legacy-tech-path';
import {
	applyPlan,
	missingNotionEnv,
	planFromMapped,
	redirectsForTech,
	type ImportPlan,
	type PlannedEntry
} from './import-notion';

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

const awsSummary = 'Shipped services on Amazon Web Services.';

function work(partial: Partial<Work> & Pick<Work, 'companyName' | 'title'>): Work {
	return {
		description: 'Role summary',
		url: 'https://example.com',
		companySlug: companySlug(partial.companyName),
		techTags: [],
		startDate: new Date('2018-06-01T00:00:00.000Z'),
		endDate: new Date('2019-12-31T00:00:00.000Z'),
		...partial
	};
}

function emptyMapped() {
	return {
		tech: [] as Tech[],
		work: [] as Work[],
		projects: [] as Array<Project & { mediaUrls: string[] }>,
		links: [] as Array<{ title: string; url: string }>,
		bookmarks: [] as Array<{ title: string; url: string; tags: string[] }>
	};
}

describe('planFromMapped', () => {
	it('slugs AWS to amazon-web-services and copies pickSummary into company.summary', () => {
		const entries = planFromMapped({
			...emptyMapped(),
			work: [
				work({
					companyName: 'Amazon Web Services',
					title: 'SDE',
					description: awsSummary
				})
			]
		});
		const company = entries.find((entry) => entry.collection === 'companies');
		expect(company?.slug).toBe('amazon-web-services');
		expect(company?.data.summary).toBe(awsSummary);
	});

	it('throws on colliding company names', () => {
		expect(() =>
			planFromMapped({
				...emptyMapped(),
				work: [
					work({ companyName: 'Foo Bar', title: 'Eng' }),
					work({ companyName: 'Foo-Bar', title: 'Eng' })
				]
			})
		).toThrow(/collision/i);
	});

	it('points roles at the company slug', () => {
		const entries = planFromMapped({
			...emptyMapped(),
			work: [
				work({
					companyName: 'Amazon Web Services',
					title: 'SDE',
					description: awsSummary
				})
			]
		});
		const role = entries.find((entry) => entry.collection === 'roles');
		expect(role?.references?.company).toEqual(['amazon-web-services']);
	});

	it('preserves project media URLs', () => {
		const mediaUrls = ['https://files.notion.so/photo.png?x=1'];
		const entries = planFromMapped({
			...emptyMapped(),
			projects: [
				{
					name: 'Personal site',
					description: 'Portfolio',
					url: 'https://example.com',
					source: 'https://github.com/example/site',
					media: [],
					mediaUrls
				}
			]
		});
		const project = entries.find((entry) => entry.collection === 'projects');
		expect(project?.mediaUrls).toEqual(mediaUrls);
	});
});

type RecordedCall = {
	method: string;
	url: string;
	json?: unknown;
	form?: boolean;
};

function jsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function contentEnvelope(item: { id: string; slug: string }, rev: string) {
	return { success: true as const, data: { item, _rev: rev } };
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('applyPlan REST', () => {
	it('publishes after create with the returned _rev', async () => {
		const calls: RecordedCall[] = [];
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				const url = String(input);
				const method = (init?.method ?? 'GET').toUpperCase();
				let json: unknown;
				if (typeof init?.body === 'string') json = JSON.parse(init.body);
				calls.push({ method, url, json, form: init?.body instanceof FormData });
				if (method === 'GET' && url.includes('/_emdash/api/content/tech')) {
					return jsonResponse(200, { success: true, data: { items: [] } });
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/tech')) {
					return jsonResponse(
						201,
						contentEnvelope({ id: 'tech-1', slug: 'node-js' }, 'rev-create')
					);
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/tech/tech-1/publish')) {
					return jsonResponse(
						200,
						contentEnvelope({ id: 'tech-1', slug: 'node-js' }, 'rev-published')
					);
				}
				if (method === 'GET' && url.includes('/_emdash/api/redirects')) {
					return jsonResponse(200, { success: true, data: { items: [] } });
				}
				return jsonResponse(500, {
					success: false,
					error: { message: `unhandled ${method} ${url}` }
				});
			})
		);

		await applyPlan(
			{
				dryRun: false,
				missingNotion: [],
				hasEmDashToken: true,
				entries: [
					{
						collection: 'tech',
						slug: 'node-js',
						data: { name: 'Node.js' }
					}
				],
				redirects: [],
				notes: []
			},
			{ EMDASH_TOKEN: 'test-token', EMDASH_URL: 'http://localhost:4321' }
		);

		expect(calls).toContainEqual({
			method: 'POST',
			url: 'http://localhost:4321/_emdash/api/content/tech/tech-1/publish',
			json: { _rev: 'rev-create' },
			form: false
		});
	});

	it('publishes after update with the write _rev', async () => {
		const calls: RecordedCall[] = [];
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				const url = String(input);
				const method = (init?.method ?? 'GET').toUpperCase();
				let json: unknown;
				if (typeof init?.body === 'string') json = JSON.parse(init.body);
				calls.push({ method, url, json, form: init?.body instanceof FormData });
				if (method === 'GET' && url.includes('/_emdash/api/content/companies')) {
					return jsonResponse(200, {
						success: true,
						data: { items: [{ id: 'co-1', slug: 'amazon-web-services' }] }
					});
				}
				if (method === 'PUT' && url.endsWith('/_emdash/api/content/companies/co-1')) {
					return jsonResponse(
						200,
						contentEnvelope({ id: 'co-1', slug: 'amazon-web-services' }, 'rev-update')
					);
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/companies/co-1/publish')) {
					return jsonResponse(
						200,
						contentEnvelope({ id: 'co-1', slug: 'amazon-web-services' }, 'rev-published')
					);
				}
				if (method === 'GET' && url.includes('/_emdash/api/redirects')) {
					return jsonResponse(200, { success: true, data: { items: [] } });
				}
				return jsonResponse(500, {
					success: false,
					error: { message: `unhandled ${method} ${url}` }
				});
			})
		);

		await applyPlan(
			{
				dryRun: false,
				missingNotion: [],
				hasEmDashToken: true,
				entries: [
					{
						collection: 'companies',
						slug: 'amazon-web-services',
						data: { name: 'Amazon Web Services', summary: awsSummary }
					}
				],
				redirects: [],
				notes: []
			},
			{ EMDASH_TOKEN: 'test-token', EMDASH_URL: 'http://localhost:4321' }
		);

		expect(calls).toContainEqual({
			method: 'POST',
			url: 'http://localhost:4321/_emdash/api/content/companies/co-1/publish',
			json: { _rev: 'rev-update' },
			form: false
		});
	});

	it('covers create, media upload, taxonomy terms, and reference ids', async () => {
		const calls: RecordedCall[] = [];
		const mediaUrl = 'https://files.notion.so/hero.png';
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				const url = String(input);
				const method = (init?.method ?? 'GET').toUpperCase();
				let json: unknown;
				if (typeof init?.body === 'string') json = JSON.parse(init.body);
				calls.push({ method, url, json, form: init?.body instanceof FormData });

				if (url === mediaUrl) {
					return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
				}
				if (
					method === 'GET' &&
					/\/_emdash\/api\/content\/(tech|companies|roles|projects)/.test(url)
				) {
					return jsonResponse(200, { success: true, data: { items: [] } });
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/tech')) {
					return jsonResponse(201, contentEnvelope({ id: 'tech-1', slug: 'node-js' }, 'rev-tech'));
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/companies')) {
					return jsonResponse(
						201,
						contentEnvelope({ id: 'co-1', slug: 'amazon-web-services' }, 'rev-co')
					);
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/roles')) {
					return jsonResponse(201, contentEnvelope({ id: 'role-1', slug: 'aws-sde' }, 'rev-role'));
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/media')) {
					return jsonResponse(201, {
						success: true,
						data: { item: { id: 'media-1', url: '/_emdash/api/media/file/hero.png' } }
					});
				}
				if (
					method === 'GET' &&
					url.endsWith('/_emdash/api/taxonomies/project_tags/terms/open-source')
				) {
					return jsonResponse(404, {
						success: false,
						error: { message: "Term 'open-source' not found in taxonomy 'project_tags'" }
					});
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/taxonomies/project_tags/terms')) {
					return jsonResponse(201, {
						success: true,
						data: { term: { id: 'term-1', slug: 'open-source', label: 'Open Source' } }
					});
				}
				if (method === 'POST' && url.endsWith('/_emdash/api/content/projects')) {
					return jsonResponse(
						201,
						contentEnvelope({ id: 'proj-1', slug: 'personal-site' }, 'rev-proj')
					);
				}
				if (method === 'POST' && url.includes('/publish')) {
					const id = url.split('/').at(-2);
					return jsonResponse(200, contentEnvelope({ id: id ?? 'unknown', slug: 'x' }, 'rev-pub'));
				}
				if (method === 'GET' && url.includes('/_emdash/api/redirects')) {
					return jsonResponse(200, { success: true, data: { items: [] } });
				}
				return jsonResponse(500, {
					success: false,
					error: { message: `unhandled ${method} ${url}` }
				});
			})
		);

		const entries: PlannedEntry[] = [
			{ collection: 'tech', slug: 'node-js', data: { name: 'Node.js' } },
			{
				collection: 'companies',
				slug: 'amazon-web-services',
				data: { name: 'Amazon Web Services', summary: awsSummary }
			},
			{
				collection: 'roles',
				slug: 'aws-sde',
				data: { title: 'SDE', summary: awsSummary, start_date: '2018-06-01T00:00:00.000Z' },
				references: { company: ['amazon-web-services'], tech: ['node-js'] }
			},
			{
				collection: 'projects',
				slug: 'personal-site',
				data: { name: 'Personal site', description: 'Portfolio', is_active: true },
				references: { tech: ['node-js'] },
				taxonomies: { project_tags: ['Open Source'] },
				mediaUrls: [mediaUrl]
			}
		];
		const plan: ImportPlan = {
			dryRun: false,
			missingNotion: [],
			hasEmDashToken: true,
			entries,
			redirects: [],
			notes: []
		};

		await applyPlan(plan, { EMDASH_TOKEN: 'test-token', EMDASH_URL: 'http://localhost:4321' });

		const createRole = calls.find(
			(call) => call.method === 'POST' && call.url.endsWith('/_emdash/api/content/roles')
		);
		expect(createRole?.json).toEqual(
			expect.objectContaining({
				slug: 'aws-sde',
				references: { company: ['co-1'], tech: ['tech-1'] }
			})
		);

		const upload = calls.find(
			(call) => call.method === 'POST' && call.url.endsWith('/_emdash/api/media')
		);
		expect(upload?.form).toBe(true);

		const createTerm = calls.find(
			(call) =>
				call.method === 'POST' && call.url.endsWith('/_emdash/api/taxonomies/project_tags/terms')
		);
		expect(createTerm?.json).toEqual({ slug: 'open-source', label: 'Open Source' });

		const createProject = calls.find(
			(call) => call.method === 'POST' && call.url.endsWith('/_emdash/api/content/projects')
		);
		expect(createProject?.json).toEqual(
			expect.objectContaining({
				slug: 'personal-site',
				references: { tech: ['tech-1'] },
				taxonomies: { project_tags: ['open-source'] },
				data: expect.objectContaining({
					media: [{ image: { id: 'media-1', src: '/_emdash/api/media/file/hero.png' } }]
				})
			})
		);

		expect(calls.filter((call) => call.url.endsWith('/publish'))).toHaveLength(4);
	});
});
