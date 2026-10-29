import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const FORBIDDEN_PUBLIC_JS_MARKERS = [
	'from "react"',
	'@emdash-cms/admin',
	'react-dom'
] as const;

export type PublicJsViolation = {
	path: string;
	marker: string;
};

export type PublicJsScanResult = {
	ok: boolean;
	violations: PublicJsViolation[];
};

export type ClientAsset = {
	path: string;
	content: string;
};

export type HtmlDocument = {
	path: string;
	content: string;
};

export type ScanPublicJsOptions = {
	htmlDocuments?: HtmlDocument[];
};

const CLIENT_ASSET_REF =
	/(?:(?:src|href)=["']([^"']+\.js)["']|from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s*["']([^"']+)["']|["'](\/_astro\/[^"']+\.js)["'])/g;

const FORBIDDEN_PUBLIC_CHUNK_PREFIXES = ['emdash-admin', 'react'] as const;

function normalizePath(assetPath: string): string {
	return assetPath.replaceAll('\\', '/');
}

function basename(assetPath: string): string {
	const normalized = normalizePath(assetPath);
	return normalized.slice(normalized.lastIndexOf('/') + 1);
}

export function isExemptClientPath(assetPath: string): boolean {
	return isEmdashUrl(assetPath);
}

export function forbiddenPublicChunkMarker(assetPath: string): string | undefined {
	const name = basename(assetPath);
	for (const prefix of FORBIDDEN_PUBLIC_CHUNK_PREFIXES) {
		if (name === `${prefix}.js` || name.startsWith(`${prefix}.`)) return prefix;
	}
	return undefined;
}

export function isEmdashUrl(assetPath: string): boolean {
	return normalizePath(assetPath).includes('/_emdash/');
}

function markersIn(content: string): string[] {
	return FORBIDDEN_PUBLIC_JS_MARKERS.filter((marker) => content.includes(marker));
}

export function extractClientAssetRefs(source: string): string[] {
	const refs: string[] = [];
	for (const match of source.matchAll(CLIENT_ASSET_REF)) {
		const ref = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5];
		if (ref) refs.push(ref);
	}
	return refs;
}

function resolveAssetRef(
	ref: string,
	fromPath: string,
	assets: Map<string, ClientAsset>
): string | undefined {
	const normalized = normalizePath(ref).split('?')[0] ?? ref;
	if (isEmdashUrl(normalized)) return undefined;
	if (assets.has(normalized)) return normalized;

	const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
	if (assets.has(withSlash)) return withSlash;

	if (normalized.startsWith('.')) {
		const fromDir = normalizePath(fromPath).slice(0, normalizePath(fromPath).lastIndexOf('/') + 1);
		const resolved = path.posix.normalize(`${fromDir}${normalized}`);
		if (assets.has(resolved)) return resolved;
		const asRoot = resolved.startsWith('/') ? resolved : `/${resolved}`;
		if (assets.has(asRoot)) return asRoot;
	}

	const byName = basename(normalized);
	for (const assetPath of assets.keys()) {
		if (basename(assetPath) === byName) return assetPath;
	}
	return undefined;
}

function collectReferencedAssets(
	htmlDocuments: HtmlDocument[],
	assets: Map<string, ClientAsset>
): Set<string> {
	const referenced = new Set<string>();
	const queue: string[] = [];

	for (const document of htmlDocuments) {
		if (isEmdashUrl(document.path)) continue;
		for (const ref of extractClientAssetRefs(document.content)) {
			const resolved = resolveAssetRef(ref, document.path, assets);
			if (resolved && !referenced.has(resolved)) {
				referenced.add(resolved);
				queue.push(resolved);
			}
		}
	}

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) continue;
		const asset = assets.get(current);
		if (!asset) continue;
		for (const ref of extractClientAssetRefs(asset.content)) {
			const resolved = resolveAssetRef(ref, current, assets);
			if (resolved && !referenced.has(resolved)) {
				referenced.add(resolved);
				queue.push(resolved);
			}
		}
	}

	return referenced;
}

function assetIndex(assets: ClientAsset[]): Map<string, ClientAsset> {
	const index = new Map<string, ClientAsset>();
	for (const asset of assets) {
		index.set(normalizePath(asset.path), asset);
	}
	return index;
}

export function scanPublicJs(
	assets: ClientAsset[],
	options?: ScanPublicJsOptions
): PublicJsScanResult {
	const index = assetIndex(assets);
	const htmlDocuments = options?.htmlDocuments;
	const targets = htmlDocuments
		? collectReferencedAssets(htmlDocuments, index)
		: new Set(
				assets
					.filter((asset) => !isExemptClientPath(asset.path))
					.map((asset) => normalizePath(asset.path))
			);

	const violations: PublicJsViolation[] = [];
	for (const assetPath of targets) {
		const asset = index.get(assetPath);
		if (!asset) continue;
		if (!htmlDocuments && isExemptClientPath(asset.path)) continue;
		if (htmlDocuments) {
			const forbiddenChunk = forbiddenPublicChunkMarker(asset.path);
			if (forbiddenChunk) {
				violations.push({ path: asset.path, marker: forbiddenChunk });
			}
		}
		for (const marker of markersIn(asset.content)) {
			violations.push({ path: asset.path, marker });
		}
	}

	return { ok: violations.length === 0, violations };
}

async function listFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(fullPath)));
		} else if (entry.isFile()) {
			files.push(fullPath);
		}
	}
	return files;
}

function toClientUrl(filePath: string, clientDir: string): string {
	const relative = normalizePath(path.relative(clientDir, filePath));
	return relative.startsWith('/') ? relative : `/${relative}`;
}

function hashedClientBasename(filename: string): string {
	return filename.replace(/\.[A-Za-z0-9_-]+\.js$/, '').replace(/\.js$/, '');
}

async function srcComponentNames(rootDir: string): Promise<Set<string>> {
	const names = new Set<string>(['client.svelte']);
	try {
		for (const filePath of await listFiles(path.join(rootDir, 'src'))) {
			names.add(path.parse(filePath).name);
		}
	} catch {
		// Source tree is missing when scanning a copied dist-only checkout.
	}
	return names;
}

function isPublicClientEntry(assetPath: string, srcNames: Set<string>): boolean {
	const name = hashedClientBasename(basename(assetPath));
	return srcNames.has(name);
}

export async function scanDistClientAssets(
	distDir: string = path.join(process.cwd(), 'dist'),
	rootDir: string = process.cwd()
): Promise<PublicJsScanResult> {
	const clientDir = path.join(distDir, 'client');
	const files = await listFiles(clientDir);
	const jsFiles = files.filter((filePath) => filePath.endsWith('.js'));
	const htmlFiles = files.filter((filePath) => filePath.endsWith('.html'));

	const assets: ClientAsset[] = await Promise.all(
		jsFiles.map(async (filePath) => ({
			path: toClientUrl(filePath, clientDir),
			content: await readFile(filePath, 'utf8')
		}))
	);

	const htmlDocuments: HtmlDocument[] = await Promise.all(
		htmlFiles.map(async (filePath) => ({
			path: toClientUrl(filePath, clientDir),
			content: await readFile(filePath, 'utf8')
		}))
	);

	const srcNames = await srcComponentNames(rootDir);
	for (const asset of assets) {
		if (!isPublicClientEntry(asset.path, srcNames)) continue;
		htmlDocuments.push({
			path: asset.path,
			content: `<script type="module" src="${asset.path}"></script>`
		});
	}

	if (htmlDocuments.length === 0) {
		return scanPublicJs(assets);
	}

	return scanPublicJs(assets, { htmlDocuments });
}

async function main(): Promise<void> {
	const result = await scanDistClientAssets();
	if (result.ok) {
		console.log('Public JS isolation: OK');
		return;
	}

	console.error('Public JS isolation failed:');
	for (const violation of result.violations) {
		console.error(`  ${violation.path} contains ${violation.marker}`);
	}
	process.exitCode = 1;
}

if (process.argv[1] && path.basename(process.argv[1]).startsWith('verify-public-js')) {
	void main();
}
