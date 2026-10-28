import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const themeSource = readFileSync(
	fileURLToPath(new URL('./theme.svelte.ts', import.meta.url)),
	'utf8'
);

describe('theme.svelte.ts', () => {
	it('does not import $app', () => {
		expect(themeSource).not.toMatch(/\$app\//);
	});
});
