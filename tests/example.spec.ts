import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001/diffle-lang/';

test('Correct titles for languages', async ({ page }) => {
  const langs = [
    { code: 'cs', title: 'v češtině' },
    { code: 'de', title: 'auf Deutsch' },
    { code: 'pl', title: 'po polsku' },
  ]

  for (const lang of langs) {
    await page.goto(`${BASE_URL}${lang.code}`);
    
    var titlePhrase = new RegExp(lang.title, "g");

    await expect(page).toHaveTitle(titlePhrase);
  }


});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:3001/diffle-lang/');

  // Click the get started link.
  // await page.getByRole('button', { name: 'Diffle' }).click();

  // // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
