import { describe, expect, it } from 'vitest';
import { scanPublicJs } from './verify-public-js';

describe('scanPublicJs', () => {
	it('fails a public chunk that contains react-dom', () => {
		const result = scanPublicJs([
			{ path: '/_astro/island.js', content: 'import { createRoot } from "react-dom";' }
		]);

		expect(result.ok).toBe(false);
		expect(result.violations).toEqual([{ path: '/_astro/island.js', marker: 'react-dom' }]);
	});

	it('fails a public chunk that contains from "react"', () => {
		const result = scanPublicJs([
			{ path: '/_astro/page.js', content: 'import { useState } from "react";' }
		]);

		expect(result.ok).toBe(false);
		expect(result.violations).toEqual([{ path: '/_astro/page.js', marker: 'from "react"' }]);
	});

	it('fails a public chunk that contains @emdash-cms/admin', () => {
		const result = scanPublicJs([
			{ path: '/_astro/home.js', content: 'export * from "@emdash-cms/admin";' }
		]);

		expect(result.ok).toBe(false);
		expect(result.violations).toEqual([{ path: '/_astro/home.js', marker: '@emdash-cms/admin' }]);
	});

	it('allows react in a /_emdash/ asset', () => {
		const result = scanPublicJs([
			{
				path: '/_emdash/admin.js',
				content: 'import { useState } from "react"; import "react-dom"; "@emdash-cms/admin";'
			}
		]);

		expect(result.ok).toBe(true);
		expect(result.violations).toEqual([]);
	});

	it('allows react in an admin-named chunk', () => {
		const result = scanPublicJs([
			{
				path: '/_astro/emdash-admin.CI6OnekD.js',
				content: 'from "react"; react-dom; @emdash-cms/admin'
			}
		]);

		expect(result.ok).toBe(true);
		expect(result.violations).toEqual([]);
	});

	it('passes a public svelte chunk with no react or admin markers', () => {
		const result = scanPublicJs([
			{ path: '/_astro/FooterQuote.B1.js', content: 'export function mount() { return 1; }' }
		]);

		expect(result.ok).toBe(true);
		expect(result.violations).toEqual([]);
	});

	it('scans only assets public HTML actually references', () => {
		const result = scanPublicJs(
			[
				{ path: '/_astro/island.js', content: 'export const n = 1;' },
				{
					path: '/_astro/emdash-admin.x.js',
					content: 'from "react"; react-dom; @emdash-cms/admin'
				}
			],
			{
				htmlDocuments: [
					{
						path: '/index.html',
						content: '<script type="module" src="/_astro/island.js"></script>'
					}
				]
			}
		);

		expect(result.ok).toBe(true);
		expect(result.violations).toEqual([]);
	});

	it('fails when public HTML references a chunk that contains react-dom', () => {
		const result = scanPublicJs([{ path: '/_astro/island.js', content: 'import "react-dom";' }], {
			htmlDocuments: [
				{
					path: '/index.html',
					content: '<script type="module" src="/_astro/island.js"></script>'
				}
			]
		});

		expect(result.ok).toBe(false);
		expect(result.violations).toEqual([{ path: '/_astro/island.js', marker: 'react-dom' }]);
	});

	it('does not scan /_emdash/ URLs referenced from public HTML', () => {
		const result = scanPublicJs(
			[
				{ path: '/_astro/island.js', content: 'export const n = 1;' },
				{
					path: '/_emdash/toolbar.js',
					content: 'from "react"; react-dom; @emdash-cms/admin'
				}
			],
			{
				htmlDocuments: [
					{
						path: '/',
						content:
							'<script src="/_astro/island.js"></script><script src="/_emdash/toolbar.js"></script>'
					}
				]
			}
		);

		expect(result.ok).toBe(true);
		expect(result.violations).toEqual([]);
	});

	it('fails when public HTML pulls in an admin-named chunk', () => {
		const result = scanPublicJs(
			[
				{
					path: '/_astro/emdash-admin.CI6OnekD.js',
					content: 'from "react"; react-dom; @emdash-cms/admin'
				}
			],
			{
				htmlDocuments: [
					{
						path: '/index.html',
						content: '<script type="module" src="/_astro/emdash-admin.CI6OnekD.js"></script>'
					}
				]
			}
		);

		expect(result.ok).toBe(false);
		expect(
			result.violations.some((violation) => violation.path.endsWith('emdash-admin.CI6OnekD.js'))
		).toBe(true);
	});

	it('follows public HTML imports into a coupled admin chunk', () => {
		const result = scanPublicJs(
			[
				{
					path: '/_astro/island.js',
					content: 'import{b as r}from"./emdash-admin.CI6OnekD.js";'
				},
				{
					path: '/_astro/emdash-admin.CI6OnekD.js',
					content: 'from "react"; react-dom; @emdash-cms/admin'
				}
			],
			{
				htmlDocuments: [
					{
						path: '/index.html',
						content: '<script type="module" src="/_astro/island.js"></script>'
					}
				]
			}
		);

		expect(result.ok).toBe(false);
		expect(
			result.violations.some((violation) => violation.path.endsWith('emdash-admin.CI6OnekD.js'))
		).toBe(true);
	});
});
