export function workExperienceHref(companySlug: string | undefined | null): string | null {
	if (companySlug == null) return null;
	const slug = companySlug.trim();
	if (!slug) return null;
	return `/work/${slug}`;
}
