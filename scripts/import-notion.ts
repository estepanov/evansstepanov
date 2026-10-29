import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Client } from '@notionhq/client';
import seed from '../seed/seed.json';
import type { Project } from '../src/data/projects';
import type { Tech } from '../src/data/tech';
import type { Work } from '../src/data/work';
import { groupWorkByCompany } from '../src/util/company';
import { legacyTechPaths } from '../src/util/legacy-tech-path';
import {
	buildTechIdToName,
	isFullPage,
	mapProject,
	mapTech,
	mapWork
} from '../src/util/notion-mappers';
import { toUrlSlug, uniqueUrlSlugs } from '../src/util/to-url-slug';

const NOTION_ENV_KEYS = [
	'NOTION_TOKEN',
	'TECH_NOTION_DB_ID',
	'WORK_NOTION_DB_ID',
	'PROJECTS_NOTION_DB_ID',
	'LANDING_LINKS_NOTION_DB_ID',
	'BOOKMARKS_NOTION_DB_ID'
] as const;

export type RedirectRule = {
	source: string;
	destination: string;
	type: 308;
	enabled: true;
	groupName: 'legacy-tech';
};

export type PlannedEntry = {
	collection: string;
	slug: string;
	data: Record<string, unknown>;
	references?: Record<string, string[]>;
	taxonomies?: Record<string, string[]>;
	mediaUrls?: string[];
};

export type ImportPlan = {
	dryRun: boolean;
	missingNotion: string[];
	hasEmDashToken: boolean;
	entries: PlannedEntry[];
	redirects: RedirectRule[];
	notes: string[];
};

type NotionFile = {
	file?: { url?: string };
	external?: { url?: string };
};

type BookmarkRow = {
	title: string;
	url: string;
	tags: string[];
};

type LinkRow = {
	title: string;
	url: string;
};

type ProjectWithMedia = Project & { mediaUrls: string[] };

export function missingNotionEnv(env: NodeJS.Dict<string>): string[] {
	return NOTION_ENV_KEYS.filter((key) => !env[key]?.trim());
}

export function redirectsForTech(tech: Array<{ name: string; slug: string }>): RedirectRule[] {
	const rules: RedirectRule[] = [];
	const seen = new Set<string>();
	for (const item of tech) {
		const destination = `/tech/${item.slug}/`;
		for (const source of legacyTechPaths(item.name, item.slug)) {
			if (seen.has(source)) continue;
			seen.add(source);
			rules.push({
				source,
				destination,
				type: 308,
				enabled: true,
				groupName: 'legacy-tech'
			});
		}
	}
	return rules;
}

export function seedTechEntries(
	seedFile: typeof seed = seed
): Array<{ name: string; slug: string }> {
	return (seedFile.content.tech ?? []).flatMap((entry) => {
		const slug = entry.slug;
		const name = entry.data?.name;
		if (!slug || !name) return [];
		return [{ slug, name }];
	});
}

function iso(value: Date | undefined): string | undefined {
	return value ? value.toISOString() : undefined;
}

function notionMediaUrls(files: NotionFile[] | undefined): string[] {
	if (!files) return [];
	const urls: string[] = [];
	for (const file of files) {
		const url = file.file?.url ?? file.external?.url;
		if (url) urls.push(url);
	}
	return urls;
}

function roleSlug(role: Work): string {
	const start = role.startDate ? role.startDate.toISOString().slice(0, 10) : 'undated';
	return toUrlSlug(`${role.companyName} ${role.title} ${start}`);
}

function filenameFromUrl(url: string): string {
	try {
		const pathname = new URL(url).pathname;
		const last = pathname.split('/').filter(Boolean).pop() ?? 'media';
		return decodeURIComponent(last);
	} catch {
		return 'media';
	}
}

async function queryAll(client: Client, databaseId: string) {
	const results: Awaited<ReturnType<Client['databases']['query']>>['results'] = [];
	let cursor: string | undefined;
	do {
		const page = await client.databases.query({
			database_id: databaseId,
			start_cursor: cursor,
			page_size: 100
		});
		results.push(...page.results);
		cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
	} while (cursor);
	return results.filter(isFullPage);
}

export function planFromMapped(input: {
	tech: Tech[];
	work: Work[];
	projects: ProjectWithMedia[];
	links: LinkRow[];
	bookmarks: BookmarkRow[];
}): PlannedEntry[] {
	uniqueUrlSlugs(input.tech.map((item) => item.name));
	uniqueUrlSlugs(input.work.map((role) => role.companyName));
	uniqueUrlSlugs(input.projects.map((project) => project.name));
	uniqueUrlSlugs(input.work.map(roleSlug));
	uniqueUrlSlugs(input.links.map((link) => link.title));
	uniqueUrlSlugs(input.bookmarks.map((bookmark) => bookmark.title));
	uniqueUrlSlugs(input.projects.flatMap((project) => project.tags ?? []));
	uniqueUrlSlugs(input.bookmarks.flatMap((bookmark) => bookmark.tags));

	const entries: PlannedEntry[] = [];

	for (const item of input.tech) {
		const slug = toUrlSlug(item.name);
		entries.push({
			collection: 'tech',
			slug,
			data: {
				name: item.name,
				...(item.type ? { type: item.type } : {}),
				...(item.proficiency ? { proficiency: item.proficiency } : {}),
				...(item.description ? { description: item.description } : {}),
				...(item.url ? { url: item.url } : {})
			}
		});
	}

	const techSlugByName = new Map(input.tech.map((item) => [item.name, toUrlSlug(item.name)]));
	const companies = groupWorkByCompany(input.work);

	for (const company of companies) {
		entries.push({
			collection: 'companies',
			slug: company.slug,
			data: {
				name: company.companyName,
				summary: company.summary,
				...(company.url ? { url: company.url } : {})
			}
		});
	}

	for (const role of input.work) {
		const company = companies.find((item) => item.companyName === role.companyName);
		if (!company) {
			throw new Error(`No company planned for role "${role.title}" at "${role.companyName}"`);
		}
		if (!role.startDate) {
			throw new Error(`Role "${role.title}" at "${role.companyName}" is missing a start date`);
		}
		const techSlugs = (role.techTags ?? [])
			.map((name) => techSlugByName.get(name))
			.filter((slug): slug is string => Boolean(slug));
		entries.push({
			collection: 'roles',
			slug: roleSlug(role),
			data: {
				title: role.title,
				summary: role.description,
				start_date: role.startDate.toISOString(),
				...(iso(role.endDate) ? { end_date: iso(role.endDate) } : {}),
				...(role.url ? { url: role.url } : {})
			},
			references: {
				company: [company.slug],
				tech: techSlugs
			}
		});
	}

	for (const project of input.projects) {
		const techSlugs = (project.techTags ?? [])
			.map((name) => techSlugByName.get(name))
			.filter((slug): slug is string => Boolean(slug));
		entries.push({
			collection: 'projects',
			slug: toUrlSlug(project.name),
			data: {
				name: project.name,
				description: project.description,
				is_active: Boolean(project.isActive),
				...(project.url ? { url: project.url } : {}),
				...(project.source ? { source: project.source } : {}),
				...(iso(project.startDate) ? { start_date: iso(project.startDate) } : {}),
				...(iso(project.endDate) ? { end_date: iso(project.endDate) } : {})
			},
			references: { tech: techSlugs },
			taxonomies: project.tags?.length ? { project_tags: project.tags } : undefined,
			mediaUrls: project.mediaUrls
		});
	}

	for (const link of input.links) {
		entries.push({
			collection: 'links',
			slug: toUrlSlug(link.title),
			data: { title: link.title, url: link.url }
		});
	}

	for (const bookmark of input.bookmarks) {
		entries.push({
			collection: 'bookmarks',
			slug: toUrlSlug(bookmark.title),
			data: { title: bookmark.title, url: bookmark.url },
			taxonomies: bookmark.tags.length ? { bookmark_tags: bookmark.tags } : undefined
		});
	}

	return entries;
}

async function loadNotion(env: NodeJS.Dict<string>): Promise<{
	tech: Tech[];
	work: Work[];
	projects: ProjectWithMedia[];
	links: LinkRow[];
	bookmarks: BookmarkRow[];
}> {
	const client = new Client({ auth: env.NOTION_TOKEN });
	const [techPages, workPages, projectPages, linkPages, bookmarkPages] = await Promise.all([
		queryAll(client, env.TECH_NOTION_DB_ID as string),
		queryAll(client, env.WORK_NOTION_DB_ID as string),
		queryAll(client, env.PROJECTS_NOTION_DB_ID as string),
		queryAll(client, env.LANDING_LINKS_NOTION_DB_ID as string),
		queryAll(client, env.BOOKMARKS_NOTION_DB_ID as string)
	]);

	const techIdToName = buildTechIdToName(techPages);
	const tech = techPages.map(mapTech);
	const work = workPages.map((page) => mapWork(page, techIdToName));
	const projects = projectPages.map((page) => {
		const mapped = mapProject(page, techIdToName);
		const media = page.properties.Media;
		const files = media && media.type === 'files' ? (media.files as NotionFile[]) : [];
		return { ...mapped, mediaUrls: notionMediaUrls(files) };
	});
	const links = linkPages.flatMap((page) => {
		const name = page.properties.Name;
		const url = page.properties.URL;
		if (name?.type !== 'title' || url?.type !== 'url' || !url.url) return [];
		const title = name.title[0]?.plain_text?.trim();
		if (!title) return [];
		return [{ title, url: url.url }];
	});
	const bookmarks = bookmarkPages.flatMap((page) => {
		const name = page.properties.Name;
		const url = page.properties.URL;
		const tags = page.properties.Tags;
		if (name?.type !== 'title' || url?.type !== 'url' || !url.url) return [];
		const title = name.title[0]?.plain_text?.trim();
		if (!title) return [];
		const tagNames = tags?.type === 'multi_select' ? tags.multi_select.map((tag) => tag.name) : [];
		return [{ title, url: url.url, tags: tagNames }];
	});

	return { tech, work, projects, links, bookmarks };
}

export async function buildPlan(
	env: NodeJS.Dict<string>,
	options: { apply: boolean }
): Promise<ImportPlan> {
	const missingNotion = missingNotionEnv(env);
	const hasEmDashToken = Boolean(env.EMDASH_TOKEN?.trim());
	const notes: string[] = [];
	let entries: PlannedEntry[] = [];
	let techForRedirects = seedTechEntries();

	if (missingNotion.length === 0) {
		const mapped = await loadNotion(env);
		entries = planFromMapped(mapped);
		techForRedirects = mapped.tech.map((item) => ({
			name: item.name,
			slug: toUrlSlug(item.name)
		}));
	} else {
		notes.push(
			`Notion credentials missing (${missingNotion.join(', ')}). Content upsert skipped; redirects use seed tech.`
		);
	}

	if (!hasEmDashToken) {
		notes.push('EMDASH_TOKEN missing. Live REST writes skipped.');
	}

	if (!options.apply) {
		notes.push('Dry-run (pass --apply to write).');
	}

	return {
		dryRun: !options.apply,
		missingNotion,
		hasEmDashToken,
		entries,
		redirects: redirectsForTech(techForRedirects),
		notes
	};
}

function logPlan(plan: ImportPlan): void {
	const counts = plan.entries.reduce<Record<string, number>>((accum, entry) => {
		accum[entry.collection] = (accum[entry.collection] ?? 0) + 1;
		return accum;
	}, {});
	console.log('Notion → EmDash import plan');
	console.log(`  mode: ${plan.dryRun ? 'dry-run' : 'apply'}`);
	console.log(`  EMDASH_TOKEN: ${plan.hasEmDashToken ? 'present' : 'missing'}`);
	console.log(`  entries: ${JSON.stringify(counts)}`);
	console.log(`  redirects: ${plan.redirects.length}`);
	for (const rule of plan.redirects) {
		console.log(`    ${rule.type} ${rule.source} → ${rule.destination}`);
	}
	for (const entry of plan.entries) {
		const media = entry.mediaUrls?.length ? ` media=${entry.mediaUrls.length}` : '';
		console.log(`    upsert ${entry.collection}/${entry.slug}${media}`);
	}
	for (const note of plan.notes) {
		console.log(`  note: ${note}`);
	}
}

type EmDashEnvelope<T> =
	{ success: true; data: T } | { success: false; error: { message: string } };

class EmDashApi {
	constructor(
		private readonly baseUrl: string,
		private readonly token: string
	) {}

	private async request<T>(method: string, pathname: string, body?: unknown): Promise<T> {
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.token}`
		};
		let payload: BodyInit | undefined;
		if (body instanceof FormData) {
			payload = body;
		} else if (body !== undefined) {
			headers['Content-Type'] = 'application/json';
			payload = JSON.stringify(body);
		}
		const response = await fetch(`${this.baseUrl}${pathname}`, { method, headers, body: payload });
		const json = (await response.json()) as EmDashEnvelope<T>;
		if (!json.success) {
			const error = new Error(
				`${method} ${pathname} failed (${response.status}): ${json.error?.message ?? 'unknown'}`
			) as Error & { status: number };
			error.status = response.status;
			throw error;
		}
		return json.data;
	}

	async get<T>(pathname: string): Promise<T> {
		return this.request<T>('GET', pathname);
	}

	async post<T>(pathname: string, body?: unknown): Promise<T> {
		return this.request<T>('POST', pathname, body);
	}

	async put<T>(pathname: string, body?: unknown): Promise<T> {
		return this.request<T>('PUT', pathname, body);
	}

	async listAll<T extends { id: string }>(
		pathname: string,
		itemsKey: 'items' = 'items'
	): Promise<T[]> {
		const items: T[] = [];
		let cursor: string | undefined;
		do {
			const query = cursor ? `?limit=100&cursor=${encodeURIComponent(cursor)}` : '?limit=100';
			const page = await this.get<{ items: T[]; nextCursor?: string }>(`${pathname}${query}`);
			items.push(...page[itemsKey]);
			cursor = page.nextCursor;
		} while (cursor);
		return items;
	}
}

type ContentItem = {
	id: string;
	slug?: string | null;
	_rev?: string;
	data?: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asContentItem(data: unknown): ContentItem {
	const record = asRecord(data);
	const nested = asRecord(record.item);
	const item = typeof nested.id === 'string' ? nested : record;
	const id = typeof item.id === 'string' ? item.id : undefined;
	if (!id) throw new Error('Content response missing id');
	const slug = typeof item.slug === 'string' || item.slug === null ? item.slug : undefined;
	const rev =
		typeof record._rev === 'string'
			? record._rev
			: typeof item._rev === 'string'
				? item._rev
				: undefined;
	return { id, slug, _rev: rev, data: asRecord(item.data) };
}

function asTermId(data: unknown): string {
	const record = asRecord(data);
	const term = asRecord(record.term);
	const id =
		typeof term.id === 'string' ? term.id : typeof record.id === 'string' ? record.id : undefined;
	if (!id) throw new Error('Term response missing id');
	return id;
}

function asMediaItem(data: unknown): { id: string; url?: string } {
	const record = asRecord(data);
	const item = asRecord(record.item);
	const source = typeof item.id === 'string' ? item : record;
	const id = typeof source.id === 'string' ? source.id : undefined;
	if (!id) throw new Error('Media response missing id');
	return { id, url: typeof source.url === 'string' ? source.url : undefined };
}

async function ensureTerm(api: EmDashApi, taxonomy: string, label: string): Promise<string> {
	const slug = toUrlSlug(label);
	try {
		const existing = await api.get<unknown>(`/_emdash/api/taxonomies/${taxonomy}/terms/${slug}`);
		return asTermId(existing);
	} catch (error) {
		if ((error as { status?: number }).status !== 404) throw error;
	}
	const created = await api.post<unknown>(`/_emdash/api/taxonomies/${taxonomy}/terms`, {
		slug,
		label
	});
	return asTermId(created);
}

async function uploadMedia(api: EmDashApi, url: string): Promise<{ id: string; url?: string }> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download media ${url}: ${response.status}`);
	}
	const bytes = Buffer.from(await response.arrayBuffer());
	const form = new FormData();
	form.set('file', new Blob([bytes]), filenameFromUrl(url));
	form.set('deduplicate', 'true');
	return asMediaItem(await api.post<unknown>('/_emdash/api/media', form));
}

async function upsertEntry(
	api: EmDashApi,
	entry: PlannedEntry,
	idByCollectionSlug: Map<string, ContentItem>
): Promise<string> {
	const key = `${entry.collection}:${entry.slug}`;
	const existing = idByCollectionSlug.get(key);
	const data = { ...entry.data };
	if (entry.mediaUrls?.length) {
		const media = [];
		for (const url of entry.mediaUrls) {
			const uploaded = await uploadMedia(api, url);
			media.push({ image: { id: uploaded.id, src: uploaded.url } });
		}
		data.media = media;
	}
	const references = entry.references
		? Object.fromEntries(
				Object.entries(entry.references).map(([field, slugs]) => [
					field,
					slugs.map((slug) => {
						const targetCollection = field === 'company' ? 'companies' : 'tech';
						const resolved = idByCollectionSlug.get(`${targetCollection}:${slug}`);
						if (!resolved) {
							throw new Error(`Missing ${targetCollection} id for slug "${slug}"`);
						}
						return resolved.id;
					})
				])
			)
		: undefined;
	const taxonomies = entry.taxonomies
		? Object.fromEntries(
				await Promise.all(
					Object.entries(entry.taxonomies).map(async ([taxonomy, labels]) => {
						await Promise.all(labels.map((label) => ensureTerm(api, taxonomy, label)));
						return [taxonomy, labels.map(toUrlSlug)] as const;
					})
				)
			)
		: undefined;

	const written = existing
		? asContentItem(
				await api.put<unknown>(`/_emdash/api/content/${entry.collection}/${existing.id}`, {
					data,
					slug: entry.slug,
					_rev: existing._rev,
					...(references ? { references } : {}),
					...(taxonomies ? { taxonomies } : {})
				})
			)
		: asContentItem(
				await api.post<unknown>(`/_emdash/api/content/${entry.collection}`, {
					data,
					slug: entry.slug,
					...(references ? { references } : {}),
					...(taxonomies ? { taxonomies } : {})
				})
			);
	if (!written._rev) {
		throw new Error(`Missing _rev after writing ${entry.collection}/${entry.slug}`);
	}
	await api.post(`/_emdash/api/content/${entry.collection}/${written.id}/publish`, {
		_rev: written._rev
	});
	idByCollectionSlug.set(key, { ...written, slug: entry.slug });
	return written.id;
}

export async function applyPlan(plan: ImportPlan, env: NodeJS.Dict<string>): Promise<void> {
	const token = env.EMDASH_TOKEN?.trim();
	if (!token) {
		throw new Error('EMDASH_TOKEN is required for --apply');
	}
	const api = new EmDashApi(env.EMDASH_URL?.trim() || 'http://localhost:4321', token);
	const collections = [...new Set(plan.entries.map((entry) => entry.collection))];
	const idByCollectionSlug = new Map<string, ContentItem>();
	for (const collection of collections) {
		const items = await api.listAll<ContentItem>(`/_emdash/api/content/${collection}`);
		for (const item of items) {
			if (item.slug) idByCollectionSlug.set(`${collection}:${item.slug}`, item);
		}
	}

	const order = ['tech', 'companies', 'roles', 'projects', 'links', 'bookmarks'];
	const sorted = [...plan.entries].sort(
		(left, right) => order.indexOf(left.collection) - order.indexOf(right.collection)
	);
	for (const entry of sorted) {
		await upsertEntry(api, entry, idByCollectionSlug);
		console.log(`wrote ${entry.collection}/${entry.slug}`);
	}

	const existing = await api.listAll<{ id: string; source: string }>(`/_emdash/api/redirects`);
	const existingSources = new Set(existing.map((item) => item.source));
	for (const rule of plan.redirects) {
		if (existingSources.has(rule.source)) {
			console.log(`skip redirect ${rule.source} (exists)`);
			continue;
		}
		await api.post('/_emdash/api/redirects', rule);
		console.log(`wrote redirect ${rule.source} → ${rule.destination}`);
	}
}

function parseArgs(argv: string[]): { apply: boolean } {
	return { apply: argv.includes('--apply') };
}

export async function runImport(
	env: NodeJS.Dict<string> = process.env,
	argv: string[] = process.argv.slice(2)
): Promise<ImportPlan> {
	const options = parseArgs(argv);
	const plan = await buildPlan(env, options);
	logPlan(plan);
	const canWrite =
		options.apply && plan.hasEmDashToken && (plan.entries.length > 0 || plan.redirects.length > 0);
	if (options.apply && !plan.hasEmDashToken) {
		throw new Error('Refusing --apply without EMDASH_TOKEN');
	}
	if (canWrite && plan.missingNotion.length > 0) {
		console.log('Applying redirects only (no Notion content).');
	}
	if (canWrite) {
		await applyPlan(plan, env);
	}
	return plan;
}

const invokedDirectly =
	process.argv[1] !== undefined && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (invokedDirectly) {
	runImport().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
