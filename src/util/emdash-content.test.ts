import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('emdash', () => ({
	getEmDashCollection: vi.fn(),
	getEmDashEntry: vi.fn()
}));

import { getEmDashEntry } from 'emdash';
import { loadCompanyBySlug, loadTechBySlug } from './emdash-content';

const getEntry = vi.mocked(getEmDashEntry);

describe('slug rejection', () => {
	beforeEach(() => {
		getEntry.mockReset();
	});

	it('returns null for a tech display name without looking it up', async () => {
		await expect(loadTechBySlug('Node.js')).resolves.toBeNull();
		expect(getEntry).not.toHaveBeenCalled();
	});

	it('returns null for a company display name without looking it up', async () => {
		await expect(loadCompanyBySlug('CLEAR')).resolves.toBeNull();
		expect(getEntry).not.toHaveBeenCalled();
	});

	it('looks up tech by kebab slug, not name', async () => {
		getEntry.mockResolvedValue({
			entry: null,
			cacheHint: {},
			isPreview: false
		});

		await expect(loadTechBySlug('node-js')).resolves.toBeNull();
		expect(getEntry).toHaveBeenCalledWith('tech', 'node-js');
		expect(getEntry).not.toHaveBeenCalledWith('tech', 'Node.js');
	});
});
