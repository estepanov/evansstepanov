export const URL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function toUrlSlug(input: string): string {
	const slug = input
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\+/g, '-plus-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (!slug) throw new Error(`Cannot build a url slug from "${input}"`);
	return slug;
}

export function isUrlSlug(input: string): boolean {
	return URL_SLUG_PATTERN.test(input);
}
