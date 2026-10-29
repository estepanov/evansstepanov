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

	// Every item links to its own tech detail page by url slug.
	const items = page.locator('.tech-rows .tech-item');
	expect(await items.count()).toBeGreaterThan(0);
	const hrefs = await items.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
	for (const href of hrefs) {
		expect(href).toMatch(/^\/tech\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/);
	}
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

test('home work section shows one card per company', async ({ page }) => {
	await page.goto('/');

	const workSection = page.locator('section').filter({
		has: page.getByRole('heading', { name: 'Work', exact: true })
	});
	const hrefs = await workSection
		.locator('.landing-grid a[href^="/work/"]')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href')));

	expect(hrefs.length).toBeGreaterThan(0);
	expect(new Set(hrefs).size).toBe(hrefs.length);
});

test('work index shows every role at a company', async ({ page }) => {
	await page.goto('/work');

	const clear = page.locator('.timeline-item').filter({ hasText: 'CLEAR' }).first();
	await expect(clear.getByText('Staff Software Engineer')).toBeVisible();
	await expect(clear.getByText('Senior Software Engineer')).toBeVisible();
	await expect(clear.getByText('August 2026 — Present')).toBeVisible();
	await expect(clear.getByText('June 2023 — August 2026')).toBeVisible();
});

test('live items show the orbit status indicator', async ({ page }) => {
	await page.goto('/work');

	const clear = page.locator('.timeline-item').filter({ hasText: 'CLEAR' }).first();
	await expect(clear.locator('.status--orbit .status__ring')).toBeAttached();
	await expect(clear.locator('.status--orbit .status__sat')).toBeAttached();

	await page.goto('/');

	const card = page.locator('.landing-grid li').filter({ hasText: 'CLEAR' }).first();
	await expect(card.locator('.status--orbit .status__ring')).toBeAttached();
	await expect(card.locator('.status--orbit .status__sat')).toBeAttached();
});

test('links section keeps a two-column grid on desktop when it has multiple links', async ({
	page
}) => {
	await page.goto('/');

	const section = page
		.locator('section')
		.filter({ has: page.getByRole('heading', { name: 'Links', exact: true }) });
	const list = section.locator('ul');
	const count = await list.locator('li').count();
	expect(count).toBeGreaterThan(0);

	const columns = await list.evaluate(
		(el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
	);

	// A single link would leave a hollow second column, so it centers as one
	// column; two or more fill the two-column grid and must keep it.
	if (count >= 2) {
		expect(columns).toBe(2);
	} else {
		expect(columns).toBe(1);
	}
});

test('work timeline centers the current indicator on the company name line', async ({ page }) => {
	await page.goto('/work');

	const item = page.locator('.timeline-item').filter({ hasText: 'CLEAR' }).first();
	const link = item.locator('a[href^="/work/"]').first();
	const status = item.locator('.status').first();

	const linkBox = await link.boundingBox();
	const statusBox = await status.boundingBox();
	expect(linkBox).not.toBeNull();
	expect(statusBox).not.toBeNull();

	const linkCenter = linkBox!.y + linkBox!.height / 2;
	const statusCenter = statusBox!.y + statusBox!.height / 2;
	expect(Math.abs(statusCenter - linkCenter)).toBeLessThanOrEqual(1);
});
