import { getEmDashCollection, getEmDashEntry, type CacheHint, type ContentEntry } from 'emdash';
import type { Project } from '../data/projects';
import {
	TECH_TYPE_ORDER,
	TechProficiency,
	TechProficiencyWeight,
	type Tech,
	type TechType
} from '../data/tech';
import type { CompanyView } from '../data/work';
import { companyFromRoles } from './company-from-roles';
import { isUrlSlug } from './to-url-slug';

export type PublishedCollection =
	'quotes' | 'links' | 'bookmarks' | 'tech' | 'projects' | 'companies' | 'roles';

export interface CompanyPage {
	company: CompanyView;
	cacheHint: CacheHint;
}

export interface TechPage {
	tech: Tech & { slug: string };
	cacheHint: CacheHint;
}

export function mergeCacheHints(...hints: CacheHint[]): CacheHint {
	const tags = [...new Set(hints.flatMap((hint) => hint.tags ?? []))];
	const lastModified = hints
		.map((hint) => hint.lastModified)
		.filter((date): date is Date => date instanceof Date)
		.sort((left, right) => right.getTime() - left.getTime())[0];
	return { tags, lastModified };
}

function dataRecord(entry: ContentEntry): Record<string, unknown> {
	return entry.data as Record<string, unknown>;
}

function entrySlug(entry: ContentEntry): string {
	const slug = dataRecord(entry).slug;
	return typeof slug === 'string' && slug ? slug : entry.id;
}

function parseTechType(value: unknown): TechType | undefined {
	return TECH_TYPE_ORDER.find((type) => type === value);
}

function parseProficiency(value: unknown): TechProficiency | undefined {
	switch (value) {
		case TechProficiency.Beginner:
		case TechProficiency.Intermediate:
		case TechProficiency.Advanced:
		case TechProficiency.Expert:
			return value;
		default:
			return undefined;
	}
}

export function publishedTech(entry: ContentEntry): (Tech & { slug: string }) | undefined {
	const slug = entrySlug(entry);
	if (!isUrlSlug(slug)) return undefined;
	return toTechView(entry, slug);
}

export async function hydrateCollection(
	name: 'roles' | 'projects',
	published: { entries: ContentEntry[]; cacheHint: CacheHint },
	references: { company?: true; tech?: true }
): Promise<{ entries: ContentEntry[]; cacheHint: CacheHint }> {
	if (published.entries.length === 0) return published;
	const hints: CacheHint[] = [published.cacheHint];
	const entries: ContentEntry[] = [];
	const results = await Promise.all(
		published.entries.map((entry) => getEmDashEntry(name, entry.id, { references }))
	);
	for (const result of results) {
		if (result.error) throw result.error;
		if (result.cacheHint) hints.push(result.cacheHint);
		if (result.entry) entries.push(result.entry);
	}
	return { entries, cacheHint: mergeCacheHints(...hints) };
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function asDate(value: unknown): Date | undefined {
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value === 'string' && value) {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? undefined : date;
	}
	return undefined;
}

function publishedImageUrl(value: unknown): string | undefined {
	if (typeof value === 'string' && value.trim()) return value.trim();
	if (!value || typeof value !== 'object') return undefined;
	const record = value as Record<string, unknown>;
	if ('image' in record) return publishedImageUrl(record.image);
	if (typeof record.url === 'string' && record.url.trim()) return record.url.trim();
	if (typeof record.src === 'string' && record.src.trim()) return record.src.trim();
	const asset = record.asset;
	if (asset && typeof asset === 'object') {
		const nestedUrl = (asset as Record<string, unknown>).url;
		if (typeof nestedUrl === 'string' && nestedUrl.trim()) return nestedUrl.trim();
	}
	return undefined;
}

function projectMedia(data: Record<string, unknown>): string[] {
	if (!Array.isArray(data.media)) return [];
	const urls: string[] = [];
	for (const item of data.media) {
		const url = publishedImageUrl(item);
		if (url) urls.push(url);
	}
	return urls;
}

export function projectFromEntry(entry: ContentEntry): Project {
	const data = dataRecord(entry);
	const slug = asString(data.slug) || entry.id;
	const techTags = (entry.references?.tech?.entries ?? [])
		.map((tech) => asString(dataRecord(tech).name).trim())
		.filter(Boolean);
	return {
		slug: isUrlSlug(slug) ? slug : undefined,
		name: asString(data.name),
		description: asString(data.description),
		url: asString(data.url),
		source: asString(data.source),
		isActive: data.is_active === true,
		startDate: asDate(data.start_date),
		endDate: asDate(data.end_date),
		media: projectMedia(data),
		techTags
	};
}

export function publishedCompanyViews(
	companies: ContentEntry[],
	roles: ContentEntry[]
): CompanyView[] {
	const views: CompanyView[] = [];
	for (const company of companies) {
		const slug = entrySlug(company);
		if (!isUrlSlug(slug)) continue;
		views.push(
			companyFromRoles(
				company,
				roles.filter((role) => roleBelongsToCompany(role, company))
			)
		);
	}
	return views.sort((left, right) => {
		const leftTime = left.roles[0]?.startDate?.getTime() ?? 0;
		const rightTime = right.roles[0]?.startDate?.getTime() ?? 0;
		return rightTime - leftTime;
	});
}

function toTechView(entry: ContentEntry, requestedSlug: string): Tech & { slug: string } {
	const data = dataRecord(entry);
	const slugCandidate = typeof data.slug === 'string' ? data.slug : requestedSlug;
	const slug = isUrlSlug(slugCandidate) ? slugCandidate : requestedSlug;
	const proficiency = parseProficiency(data.proficiency);
	const description = typeof data.description === 'string' ? data.description : undefined;
	const url = typeof data.url === 'string' && data.url ? data.url : undefined;
	return {
		slug,
		name: typeof data.name === 'string' ? data.name : '',
		type: parseTechType(data.type),
		proficiency,
		proficiencyWeight: proficiency ? TechProficiencyWeight[proficiency] : 0,
		description,
		url
	};
}

function asId(value: unknown): string | undefined {
	return typeof value === 'string' && value ? value : undefined;
}

function roleBelongsToCompany(role: ContentEntry, company: ContentEntry): boolean {
	const linked = role.references?.company?.entries ?? [];
	if (linked.length === 0) return false;
	const companySlug = entrySlug(company);
	const companyDbId = asId(dataRecord(company).id);
	return linked.some((entry) => {
		const linkedSlug = entrySlug(entry);
		const linkedDbId = asId(dataRecord(entry).id);
		return (
			entry.id === company.id ||
			linkedSlug === companySlug ||
			(companyDbId !== undefined && (entry.id === companyDbId || linkedDbId === companyDbId))
		);
	});
}

export async function loadPublished(
	name: PublishedCollection
): Promise<{ entries: ContentEntry[]; cacheHint: CacheHint }> {
	const { entries, error, cacheHint } = await getEmDashCollection(name, {
		status: 'published'
	});
	if (error) throw error;
	return { entries, cacheHint };
}

export async function loadHomePage(): Promise<{ entry: ContentEntry; cacheHint: CacheHint }> {
	const { entry, error, cacheHint } = await getEmDashEntry('pages', 'home');
	if (error) throw error;
	if (!entry) throw new Error('Published pages entry "home" was not found');
	return { entry, cacheHint };
}

export async function loadCompanyBySlug(slug: string): Promise<CompanyPage | null> {
	if (!isUrlSlug(slug)) return null;

	const { entry, error, cacheHint } = await getEmDashEntry('companies', slug);
	if (error) throw error;
	if (!entry) return null;

	const publishedRoles = await loadPublished('roles');
	const roleHints: CacheHint[] = [publishedRoles.cacheHint];
	const matchingRoles: ContentEntry[] = [];

	const hydratedRoles = await Promise.all(
		publishedRoles.entries.map((role) =>
			getEmDashEntry('roles', role.id, {
				references: { company: true, tech: true }
			})
		)
	);

	for (const hydrated of hydratedRoles) {
		if (hydrated.error) throw hydrated.error;
		if (hydrated.cacheHint) roleHints.push(hydrated.cacheHint);
		if (hydrated.entry && roleBelongsToCompany(hydrated.entry, entry)) {
			matchingRoles.push(hydrated.entry);
		}
	}

	return {
		company: companyFromRoles(entry, matchingRoles),
		cacheHint: mergeCacheHints(cacheHint, ...roleHints)
	};
}

export async function loadTechBySlug(slug: string): Promise<TechPage | null> {
	if (!isUrlSlug(slug)) return null;

	const { entry, error, cacheHint } = await getEmDashEntry('tech', slug);
	if (error) throw error;
	if (!entry) return null;

	return { tech: toTechView(entry, slug), cacheHint };
}
