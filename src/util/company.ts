import type { Company, Work } from '../data/work';

export function companySlug(name: string): string {
	return name
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function latestStart(roles: Work[]): Date | undefined {
	const dates = roles
		.map((r) => r.startDate)
		.filter((d): d is Date => Boolean(d))
		.map((d) => new Date(d).getTime());
	if (dates.length === 0) return undefined;
	return new Date(Math.max(...dates));
}

function earliestStart(roles: Work[]): Date | undefined {
	const dates = roles
		.map((r) => r.startDate)
		.filter((d): d is Date => Boolean(d))
		.map((d) => new Date(d).getTime());
	if (dates.length === 0) return undefined;
	return new Date(Math.min(...dates));
}

function pickSummary(roles: Work[]): string {
	const current = roles.find((r) => r.isCurrent);
	if (current) return current.description;
	const sorted = [...roles].sort((a, b) => {
		const at = a.startDate ? new Date(a.startDate).getTime() : 0;
		const bt = b.startDate ? new Date(b.startDate).getTime() : 0;
		return bt - at;
	});
	return sorted[0]?.description ?? '';
}

export function groupWorkByCompany(work: Work[]): Company[] {
	const bySlug = new Map<string, Work[]>();

	for (const role of work) {
		const slug = role.companySlug || companySlug(role.companyName);
		const list = bySlug.get(slug) ?? [];
		list.push(role);
		bySlug.set(slug, list);
	}

	const companies: Company[] = [];

	for (const [slug, roles] of bySlug) {
		const sortedRoles = [...roles].sort((a, b) => {
			const at = a.startDate ? new Date(a.startDate).getTime() : 0;
			const bt = b.startDate ? new Date(b.startDate).getTime() : 0;
			return bt - at;
		});

		const isCurrent = sortedRoles.some((r) => r.isCurrent);
		const techSet = new Set<string>();
		for (const r of sortedRoles) {
			for (const t of r.techTags ?? []) techSet.add(t);
		}

		const endDates = sortedRoles
			.map((r) => r.endDate)
			.filter((d): d is Date => Boolean(d));
		const endDate = isCurrent
			? undefined
			: endDates.length
				? new Date(Math.max(...endDates.map((d) => new Date(d).getTime())))
				: undefined;

		companies.push({
			slug,
			companyName: sortedRoles[0].companyName,
			url: sortedRoles.find((r) => r.url)?.url,
			roles: sortedRoles,
			techTags: [...techSet],
			isCurrent,
			startDate: earliestStart(sortedRoles),
			endDate,
			summary: pickSummary(sortedRoles)
		});
	}

	return companies.sort((a, b) => {
		const at = latestStart(a.roles)?.getTime() ?? 0;
		const bt = latestStart(b.roles)?.getTime() ?? 0;
		return bt - at;
	});
}
