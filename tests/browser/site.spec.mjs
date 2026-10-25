import {test, expect} from '@playwright/test';
import {readdirSync, existsSync} from 'node:fs';
const apps = readdirSync('apps').filter(slug => existsSync(`apps/${slug}/index.html`));
for (const slug of apps) {
  test(`${slug}: navigation, rendering and HTML download`, async ({page}, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.location().url.startsWith('http://127.0.0.1:3000')) errors.push(msg.text());
    });
    await page.route('https://**/*', route => route.abort());
    await page.goto('/');
    const link = page.locator(`a[href="apps/${slug}/"]`).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/apps/${slug}/(?:[?#].*)?$`));
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(750);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({path: testInfo.outputPath(`${slug}.png`), fullPage: true});
    const home = page.locator('a[href="../../"], a[href="/"], a[href="../../index.html"]').first();
    await home.click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto(`/apps/${slug}/${slug}.html`);
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
}
