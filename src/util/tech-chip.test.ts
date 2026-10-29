import { describe, expect, it } from 'vitest';
import { techChipHref } from './tech-chip';

describe('techChipHref', () => {
	it('links by published slug, never by display name', () => {
		expect(techChipHref('Node.js', [{ name: 'Node.js', slug: 'node-js' }])).toBe('/tech/node-js/');
		expect(techChipHref('C++', [{ name: 'C++', slug: 'cpp' }])).toBe('/tech/cpp/');
	});

	it('does not link a name with no published url slug', () => {
		expect(techChipHref('Node.js', [])).toBeUndefined();
		expect(techChipHref('Node.js', [{ name: 'Node.js', slug: 'Node.js' }])).toBeUndefined();
	});

	it('still matches when the published row carries type and proficiencyWeight', () => {
		expect(
			techChipHref('Node.js', [
				{ name: 'Node.js', slug: 'node-js', type: 'Runtime', proficiencyWeight: 3 }
			])
		).toBe('/tech/node-js/');
	});
});
