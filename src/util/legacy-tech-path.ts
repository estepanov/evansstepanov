export function legacyTechPaths(name: string, slug: string): string[] {
	const destination = `/tech/${slug}/`;
	const candidates = [
		`/tech/${name}`,
		`/tech/${name}/`,
		encodeURI(`/tech/${name}`),
		encodeURI(`/tech/${name}/`)
	];
	const paths: string[] = [];
	const seen = new Set<string>();
	for (const path of candidates) {
		if (path === destination || seen.has(path)) continue;
		seen.add(path);
		paths.push(path);
	}
	return paths;
}
