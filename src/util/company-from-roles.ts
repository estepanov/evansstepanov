import type { CompanyView, RoleView, Work } from '../data/work';
import { TechProficiencyWeight, type TechProficiency } from '../data/tech';
import { isUrlSlug } from './to-url-slug';

export interface CompanyRoleTechSource {
	data: {
		name?: unknown;
		proficiency?: unknown;
	};
}

export interface CompanyRoleSource {
	data: {
		title?: unknown;
		summary?: unknown;
		url?: unknown;
		start_date?: unknown;
		end_date?: unknown;
	};
	references?: {
		tech?: { entries: CompanyRoleTechSource[] };
	};
}

export interface CompanySource {
	id: string;
	data: {
		slug?: unknown;
		name?: unknown;
		url?: unknown;
		summary?: unknown;
	};
}

function asDate(value: unknown): Date | undefined {
	if (value == null || value === '') return undefined;
	const date = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function optionalText(value: unknown): string | undefined {
	const text = asString(value).trim();
	return text ? text : undefined;
}

function proficiencyWeight(value: unknown): number {
	if (typeof value !== 'string') return -1;
	return TechProficiencyWeight[value as TechProficiency] ?? -1;
}

function unionTechTags(roles: CompanyRoleSource[]): string[] {
	const best = new Map<string, number>();
	for (const role of roles) {
		for (const entry of role.references?.tech?.entries ?? []) {
			const name = asString(entry.data.name).trim();
			if (!name) continue;
			const weight = proficiencyWeight(entry.data.proficiency);
			const previous = best.get(name);
			if (previous === undefined || weight > previous) best.set(name, weight);
		}
	}
	return [...best.entries()]
		.sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
		.map(([name]) => name);
}

function roleTechTags(role: CompanyRoleSource): string[] {
	return unionTechTags([role]);
}

function toRoleView(role: CompanyRoleSource): RoleView {
	const endDate = asDate(role.data.end_date);
	return {
		title: asString(role.data.title),
		summary: optionalText(role.data.summary),
		url: optionalText(role.data.url),
		startDate: asDate(role.data.start_date),
		endDate,
		isCurrent: endDate === undefined,
		techTags: roleTechTags(role)
	};
}

function companySlugOf(company: CompanySource): string {
	const fromData = asString(company.data.slug).trim();
	return fromData || company.id;
}

/**
 * Maps one company entry and its roles onto a public view.
 * Summary is authored on the company; tenure / current / tech union come from roles.
 */
export function companyFromRoles(company: CompanySource, roles: CompanyRoleSource[]): CompanyView {
	const slug = companySlugOf(company);
	if (!isUrlSlug(slug)) {
		throw new Error(`Company slug "${slug}" is not a url slug`);
	}

	const sortedRoles = [...roles].sort((left, right) => {
		const leftTime = asDate(left.data.start_date)?.getTime() ?? 0;
		const rightTime = asDate(right.data.start_date)?.getTime() ?? 0;
		return rightTime - leftTime;
	});
	const roleViews = sortedRoles.map(toRoleView);
	const isCurrent = roleViews.some((role) => role.isCurrent);
	const starts = roleViews
		.map((role) => role.startDate)
		.filter((date): date is Date => Boolean(date));
	const ends = roleViews.map((role) => role.endDate).filter((date): date is Date => Boolean(date));

	return {
		slug,
		name: asString(company.data.name),
		url: optionalText(company.data.url),
		summary: asString(company.data.summary),
		roles: roleViews,
		techTags: unionTechTags(sortedRoles),
		isCurrent,
		startDate: starts.length
			? new Date(Math.min(...starts.map((date) => date.getTime())))
			: undefined,
		endDate: isCurrent
			? undefined
			: ends.length
				? new Date(Math.max(...ends.map((date) => date.getTime())))
				: undefined
	};
}

/** Home work card: newest role title (or company name), authored company summary. */
export function workFromCompanyView(company: CompanyView): Work {
	return {
		companyName: company.name,
		companySlug: company.slug,
		title: company.roles[0]?.title || company.name,
		description: company.summary,
		url: company.url ?? '',
		startDate: company.startDate,
		endDate: company.endDate,
		isCurrent: company.isCurrent,
		techTags: company.techTags
	};
}
