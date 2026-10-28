import { describe, expect, it } from 'vitest';
import { emdashTrailingSlashLocation } from './emdash-trailing-slash';

function loc(path: string): string | null {
	return emdashTrailingSlashLocation(new URL(path, 'http://localhost:4321'));
}

describe('emdashTrailingSlashLocation', () => {
	it('adds a trailing slash to unsashed /_emdash paths and keeps the query', () => {
		expect(loc('/_emdash/admin')).toBe('/_emdash/admin/');
		expect(loc('/_emdash/admin/setup')).toBe('/_emdash/admin/setup/');
		expect(loc('/_emdash/admin/setup?step=2')).toBe('/_emdash/admin/setup/?step=2');
		expect(loc('/_emdash')).toBe('/_emdash/');
		expect(loc('/_emdash/api/auth/passkey/verify')).toBe('/_emdash/api/auth/passkey/verify/');
	});

	it('leaves slashed paths, files, and non-emdash URLs alone', () => {
		expect(loc('/_emdash/admin/setup/')).toBeNull();
		expect(loc('/_emdash/admin/setup/?step=2')).toBeNull();
		expect(loc('/_emdash/api/media/file/photo.png')).toBeNull();
		expect(loc('/_emdash/admin/app.js')).toBeNull();
		expect(loc('/')).toBeNull();
		expect(loc('/work')).toBeNull();
		expect(loc('/_emdashfoo')).toBeNull();
	});
});
