import { describe, expect, it } from 'vitest';
import { GET } from './health';

describe('GET /api/health', () => {
	it('returns 200 OK', async () => {
		const response = GET();

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('OK');
	});
});
