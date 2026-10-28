import { describe, it, expect } from 'vitest';
import { toUrlSlug, isUrlSlug } from './to-url-slug';

describe('toUrlSlug', () => {
	it('kebabs company names', () => {
		expect(toUrlSlug('Amazon Web Services')).toBe('amazon-web-services');
		expect(toUrlSlug('CLEAR')).toBe('clear');
		expect(toUrlSlug('  Foo & Bar Co. ')).toBe('foo-bar-co');
	});

	it('kebabs tech names', () => {
		expect(toUrlSlug('Node.js')).toBe('node-js');
		expect(toUrlSlug('TypeScript')).toBe('typescript');
		expect(toUrlSlug('C++')).toBe('c-plus-plus');
	});

	it('throws on empty or punctuation-only input', () => {
		expect(() => toUrlSlug('   ')).toThrow(/url slug/i);
		expect(() => toUrlSlug('***')).toThrow(/url slug/i);
	});
});

describe('isUrlSlug', () => {
	it('accepts kebab-case and rejects names', () => {
		expect(isUrlSlug('amazon-web-services')).toBe(true);
		expect(isUrlSlug('Node.js')).toBe(false);
		expect(isUrlSlug('CLEAR')).toBe(false);
		expect(isUrlSlug('')).toBe(false);
	});
});
