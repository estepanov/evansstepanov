export interface Work {
	isCurrent?: boolean;
	companyName: string;
	companySlug: string;
	title: string;
	description: string;
	url: string;
	image?: string;
	startDate?: Date;
	endDate?: Date;
	techTags?: string[];
}

export interface Company {
	slug: string;
	companyName: string;
	url?: string;
	roles: Work[];
	techTags: string[];
	isCurrent: boolean;
	startDate?: Date;
	endDate?: Date;
	/** Summary for hero: current role, else latest by startDate */
	summary: string;
}
