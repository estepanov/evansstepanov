const EMDASH_PREFIX = '/_emdash';

/**
 * Location for an unsashed `/_emdash` path. Files (last segment contains `.`)
 * and already-slashed paths are left alone. Query string is preserved.
 */
export function emdashTrailingSlashLocation(url: URL): string | null {
	const { pathname, search } = url;
	if (pathname !== EMDASH_PREFIX && !pathname.startsWith(`${EMDASH_PREFIX}/`)) {
		return null;
	}
	if (pathname.endsWith('/')) {
		return null;
	}
	const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
	if (lastSegment.includes('.')) {
		return null;
	}
	return `${pathname}/${search}`;
}
