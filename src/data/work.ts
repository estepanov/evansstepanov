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

/** One position at a company. Tenure current-ness is derived from a missing end date. */
export interface RoleView {
	title: string;
	summary?: string;
	url?: string;
	startDate?: Date;
	endDate?: Date;
	isCurrent: boolean;
	techTags: string[];
}

/** Public company page/card. `summary` is authored on the company entry, never derived from roles. */
export interface CompanyView {
	slug: string;
	name: string;
	url?: string;
	summary: string;
	roles: RoleView[];
	techTags: string[];
	isCurrent: boolean;
	startDate?: Date;
	endDate?: Date;
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
	/** @deprecated Kit grouping still derives this; EmDash views use CompanyView.summary. */
	summary: string;
}
