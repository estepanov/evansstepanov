import { describe, expect, it } from 'vitest';
import { mediaSrc } from './media-src';

describe('mediaSrc', () => {
	it('prefixes a bare static asset name with /', () => {
		expect(mediaSrc('favicon.png')).toBe('/favicon.png');
	});

	it('leaves root-relative paths unchanged', () => {
		expect(mediaSrc('/static/hero.webp')).toBe('/static/hero.webp');
		expect(mediaSrc('/_emdash/api/media/file/abc123')).toBe('/_emdash/api/media/file/abc123');
	});

	it('leaves http and https URLs unchanged', () => {
		expect(mediaSrc('http://cdn.example.com/a.png')).toBe('http://cdn.example.com/a.png');
		expect(mediaSrc('https://cdn.example.com/b.png')).toBe('https://cdn.example.com/b.png');
	});
});
