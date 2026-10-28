export interface Project {
	/** Present on EmDash entries; Storybook fixtures may omit it. */
	slug?: string;
	name: string;
	description: string;
	url: string;
	source: string;
	tags?: string[];
	techTags?: string[];
	isActive?: boolean;
	startDate?: Date;
	endDate?: Date;
	media: string[];
}
