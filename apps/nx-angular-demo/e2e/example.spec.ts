/* eslint-disable playwright/no-conditional-expect */
import { test, expect } from '@playwright/test';

test('should actually test something', async ({ page }) => {
  await page.goto('/');
  const tasks = page.getByRole('link', { name: 'Tasks' })
  await tasks.click();

  await page.getByRole('textbox', { name: 'Title' }).fill('New Task Title');
  await page.getByRole('textbox', { name: 'Details' }).fill('New Task Details');


  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  console.log('done');
  const newTaskCard = page.locator('css=#cdk-drop-list-0 > div:nth-child(1)');

  await expect(newTaskCard).toContainText('New Task Title');
});

test("should fail", async ({ page }) => {
  await expect(page).not.toHaveTitle(/Playwright/);
});

test("should be flaky", async ({ page }) => {
  if (Math.random() > 0.5) {
    await expect(page).toHaveTitle(/Playwright/);
  } else {
    await expect(page).not.toHaveTitle(/Playwright/);
  }
});
