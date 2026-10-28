import { decodeSlug } from 'emdash';
import type { Project } from '../data/projects';
import { TECH_TYPE_ORDER, type Tech, type TechType } from '../data/tech';
import type { CompanyView, Work } from '../data/work';
import { workFromCompanyView } from './company-from-roles';
import { loadTechBySlug, type TechPage } from './emdash-content';
import { isUrlSlug } from './to-url-slug';
import { relatedProjectsForCompany } from './work-page';

export async function resolveTechPage(
	rawSlug: string | undefined,
	load: (slug: string) => Promise<TechPage | null> = loadTechBySlug
): Promise<TechPage | null> {
	const slug = decodeSlug(rawSlug);
	if (!slug || !isUrlSlug(slug)) return null;
	return load(slug);
}

export function relatedCompaniesForTech(techName: string, companies: CompanyView[]): Work[] {
	return companies
		.filter((company) => company.roles.some((role) => role.techTags.includes(techName)))
		.map(workFromCompanyView);
}

export function relatedProjectsForTech(techName: string, projects: Project[]): Project[] {
	return relatedProjectsForCompany([techName], projects);
}

export function techDetailHref(slug: string | undefined): string | undefined {
	if (!slug || !isUrlSlug(slug)) return undefined;
	return `/tech/${slug}/`;
}

export function techIndexSections(
	items: Array<Tech & { slug?: string }>
): Array<{ type: TechType; items: Array<Tech & { slug?: string }> }> {
	return TECH_TYPE_ORDER.map((type) => ({
		type,
		items: items
			.filter((item) => item.type === type)
			.slice()
			.sort((left, right) => right.proficiencyWeight - left.proficiencyWeight)
	})).filter((section) => section.items.length > 0);
}
