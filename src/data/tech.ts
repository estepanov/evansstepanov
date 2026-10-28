export enum TechProficiency {
	Beginner = 'Beginner',
	Intermediate = 'Intermediate',
	Advanced = 'Advanced',
	Expert = 'Expert'
}

export const TechProficiencyWeight = {
	[TechProficiency.Beginner]: 0,
	[TechProficiency.Intermediate]: 1,
	[TechProficiency.Advanced]: 2,
	[TechProficiency.Expert]: 3
};

export enum TechType {
	Runtime = 'Runtime',
	Language = 'Language',
	Framework = 'Framework',
	Library = 'Library',
	Database = 'Database',
	Data = 'Data',
	Cloud = 'Cloud',
	DevOps = 'DevOps',
	AI = 'AI'
}

/** Home-row order; matches the tech `type` select options. */
export const TECH_TYPE_ORDER: TechType[] = [
	TechType.Runtime,
	TechType.Language,
	TechType.Framework,
	TechType.Library,
	TechType.Database,
	TechType.Data,
	TechType.Cloud,
	TechType.DevOps,
	TechType.AI
];

export interface Tech {
	/** Public `/tech/{slug}` id. Storybook fixtures may omit it. */
	slug?: string;
	name: string;
	/** Missing CMS type is a hole — do not invent a category. */
	type?: TechType;
	proficiency?: TechProficiency;
	proficiencyWeight: number;
	description?: string;
	url?: string;
	image?: string;
}
