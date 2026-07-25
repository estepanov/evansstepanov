import { TechProficiencyWeight, type Tech } from '../data/tech';
import type { Work } from '../data/work';
import type { Project } from '../data/projects';
import { formatNotionFiles } from './formate-notion-files';
import { companySlug } from './company';

type Props = Record<string, any>;

export function buildTechIdToName(
	pages: Array<{ id: string; properties?: Props }>
): Map<string, string> {
	const techIdToName = new Map<string, string>();
	for (const page of pages) {
		if (!page.properties) continue;
		const name = page.properties.Name?.title?.[0]?.plain_text;
		if (name) techIdToName.set(page.id, name);
	}
	return techIdToName;
}

export function resolveTechTags(
	relations: { id: string }[] | undefined,
	techIdToName: Map<string, string>
): string[] {
	return (relations || [])
		.map((r) => techIdToName.get(r.id))
		.filter((n): n is string => Boolean(n));
}

export function mapTech(page: { properties: Props }): Tech {
	const proficiency = page.properties.Proficiency.select.name as keyof typeof TechProficiencyWeight;
	return {
		name: page.properties.Name.title[0].plain_text,
		type: page.properties.Type?.select?.name,
		proficiency,
		proficiencyWeight: TechProficiencyWeight[proficiency],
		description: page.properties.Description?.rich_text?.[0]?.plain_text ?? undefined,
		url: page.properties.URL?.url ?? undefined
	};
}

export function mapWork(page: { properties: Props }, techIdToName: Map<string, string>): Work {
	const companyName = page.properties.Company.rich_text[0].plain_text;
	const date = page.properties.Dates?.date;
	return {
		companyName,
		companySlug: companySlug(companyName),
		title: page.properties.Position.title[0].plain_text,
		description: page.properties.Summary.rich_text[0].plain_text,
		url: page.properties.URL.url,
		techTags: resolveTechTags(page.properties['Tech Tags']?.relation, techIdToName),
		isCurrent: page.properties.Dates.date.end === null,
		startDate: date?.start ? new Date(date.start) : undefined,
		endDate: date?.end ? new Date(date.end) : undefined
	};
}

export function mapProject(
	page: { properties: Props },
	techIdToName: Map<string, string>
): Project {
	const date = page.properties.Dates?.date;
	return {
		name: page.properties.Name.title[0].plain_text,
		description: page.properties.Description.rich_text[0].plain_text,
		tags: page.properties.Tags.multi_select.map((tag: { name: string }) => tag.name),
		techTags: resolveTechTags(page.properties['Tech Tags']?.relation, techIdToName),
		url: page.properties.URL.url,
		source: page.properties.Source.url,
		media: formatNotionFiles(page.properties.Media.files),
		isActive: page.properties.Active.checkbox,
		startDate: date?.start ? new Date(date.start) : undefined,
		endDate: date?.end ? new Date(date.end) : undefined
	};
}
