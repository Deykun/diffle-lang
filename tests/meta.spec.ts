import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:2001/diffle-lang/';

test('Correct titles for languages', async ({ page }) => {
  const langs = [
    { code: 'cs', title: 'v češtině' },
    { code: 'de', title: 'auf Deutsch' },
    { code: 'pl', title: 'po polsdadssku' },
  ]

  for (const lang of langs) {
    await page.goto(`${BASE_URL}${lang.code}`);
    
    var titlePhrase = new RegExp(lang.title, "g");

    await expect(page).toHaveTitle(titlePhrase);
  }
});
