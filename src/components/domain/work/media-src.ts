export function mediaSrc(src: string): string {
	if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
		return src;
	}
	return `/${src}`;
}
