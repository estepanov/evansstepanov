import { isUrlSlug } from './to-url-slug';

export type TechChip = {
	name: string;
	slug: string;
	type?: string;
	proficiencyWeight?: number;
};

export function techChipHref(name: string, published: TechChip[]): string | undefined {
	const match = published.find((tech) => tech.name === name);
	if (!match || !isUrlSlug(match.slug)) return undefined;
	return `/tech/${match.slug}/`;
}
