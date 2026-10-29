import { describe, expect, it } from 'vitest';
import { legacyTechPaths } from './legacy-tech-path';

describe('legacyTechPaths', () => {
	it('returns distinct 308 sources for Node.js onto /tech/node-js/', () => {
		const paths = legacyTechPaths('Node.js', 'node-js');
		expect(paths).toContain('/tech/Node.js');
		expect(paths).toContain('/tech/Node.js/');
		expect(paths).toContain(encodeURI('/tech/Node.js'));
		expect(paths).toContain(encodeURI('/tech/Node.js/'));
		expect(paths).not.toContain('/tech/node-js/');
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('never includes a source that already equals the destination', () => {
		const paths = legacyTechPaths('node-js', 'node-js');
		expect(paths).not.toContain('/tech/node-js/');
		expect(paths).toContain('/tech/node-js');
	});

	it('includes encodeURI variants when the name needs encoding', () => {
		const paths = legacyTechPaths('Amazon Web Services', 'amazon-web-services');
		expect(paths).toContain('/tech/Amazon Web Services');
		expect(paths).toContain('/tech/Amazon Web Services/');
		expect(paths).toContain('/tech/Amazon%20Web%20Services');
		expect(paths).toContain('/tech/Amazon%20Web%20Services/');
		expect(paths).not.toContain('/tech/amazon-web-services/');
		expect(new Set(paths).size).toBe(paths.length);
	});
});
