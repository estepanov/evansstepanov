import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Evans Stepanov' })).toBeVisible();
});

test('tech section renders flat category rows', async ({ page }) => {
	await page.goto('/');

	const rows = page.locator('.tech-rows .tech-row');
	expect(await rows.count()).toBeGreaterThan(0);

	// Category label links to its anchor on the full tech page.
	const firstLabel = rows.first().locator('.tech-row__label');
	await expect(firstLabel).toHaveAttribute('href', /^\/tech\/#/);

	// Every item links to its own tech detail page.
	const items = page.locator('.tech-rows .tech-item');
	expect(await items.count()).toBeGreaterThan(0);
	await expect(items.first()).toHaveAttribute('href', /^\/tech\/[^#]/);
});

test('tech section has no card surfaces or proficiency controls', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('.tech-group-card')).toHaveCount(0);
	await expect(page.locator('.tech-tile')).toHaveCount(0);
	await expect(page.locator('.prof-mini__bar')).toHaveCount(0);
	await expect(page.getByRole('button', { name: /proficiency/i })).toHaveCount(0);
});
