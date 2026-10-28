import { decodeSlug } from 'emdash';
import type { Project } from '../data/projects';
import { loadCompanyBySlug, type CompanyPage } from './emdash-content';
import { isUrlSlug } from './to-url-slug';

export async function resolveCompanyPage(
	rawSlug: string | undefined,
	load: (slug: string) => Promise<CompanyPage | null> = loadCompanyBySlug
): Promise<CompanyPage | null> {
	const slug = decodeSlug(rawSlug);
	if (!slug || !isUrlSlug(slug)) return null;
	return load(slug);
}

export function relatedProjectsForCompany(
	companyTechTags: string[],
	projects: Project[]
): Project[] {
	if (companyTechTags.length === 0) return [];
	const tags = new Set(companyTechTags);
	return projects
		.filter((project) => (project.techTags ?? []).some((tag) => tags.has(tag)))
		.sort((left, right) => {
			if (left.isActive && !right.isActive) return -1;
			if (!left.isActive && right.isActive) return 1;
			const leftTime = left.startDate?.getTime() ?? 0;
			const rightTime = right.startDate?.getTime() ?? 0;
			return rightTime - leftTime;
		});
}

export function techChipHref(
	name: string,
	published: Array<{ name: string; slug: string }>
): string | undefined {
	const match = published.find((tech) => tech.name === name);
	if (!match || !isUrlSlug(match.slug)) return undefined;
	return `/tech/${match.slug}/`;
}
