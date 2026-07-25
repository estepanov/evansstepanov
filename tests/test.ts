import { expect, test } from '@playwright/test';

test('index page has expected title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Evans Stepanov');
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

test('work index lists companies and links to detail', async ({ page }) => {
	await page.goto('/work');
	const companyLinks = page.locator('a[href^="/work/"]');
	expect(await companyLinks.count()).toBeGreaterThan(0);
	const href = await companyLinks.first().getAttribute('href');
	expect(href).toMatch(/^\/work\/[a-z0-9-]+\/?$/);
	await companyLinks.first().click();
	// Site uses trailingSlash: 'always'
	await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('home work cards link to work detail without nested details controls', async ({ page }) => {
	await page.goto('/');

	const workSection = page.locator('section').filter({
		has: page.getByRole('heading', { name: 'Work', exact: true })
	});
	const workCardLink = workSection.locator('.landing-grid a[href^="/work/"]').first();

	await expect(workCardLink).toBeVisible();
	await expect(workSection.getByRole('button', { name: /details/i })).toHaveCount(0);

	const href = await workCardLink.getAttribute('href');
	expect(href).toMatch(/^\/work\/[a-z0-9-]+\/?$/);

	await workCardLink.click();
	await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
