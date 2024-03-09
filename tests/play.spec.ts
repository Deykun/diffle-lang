import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:2001/diffle-lang/';
const BASE_URL_EN = `${BASE_URL}en`;

async function acceptRequiredCookies(page: Page) {
  await page.getByTestId('show-cookies-settings').click();

  const settingGA = page.getByTestId('cookie-setting-ga');
  const settingDiffleExt = page.getByTestId('cookie-setting-diffle-external');

  const classNameGA = await settingGA.evaluate(el => el.className)
  if (classNameGA && classNameGA?.includes('button-tile-active')) {
    await settingGA.click();
  }

  const classNameDiffleExt = await settingDiffleExt.evaluate(el => el.className)
  if (classNameDiffleExt && classNameDiffleExt?.includes('button-tile-active')) {
    await settingDiffleExt.click();
  }

  await page.getByTestId('cookies-save-selected').click();
}

test('Should render "Help" and keyboard after clicking "Play"', async ({ page }) => {
  await page.goto(BASE_URL_EN);

  await acceptRequiredCookies(page);

  const playButton = page.getByRole('button', { name: 'Play' });

  await expect(playButton).toBeVisible();

  // Click the get started link.
  await playButton.click();
 
  const keyS = page.getByTestId('key-s');

  await expect(keyS).toBeVisible();
});

async function startTheGame(page: Page) {
  await page.goto(BASE_URL_EN);

  await acceptRequiredCookies(page);

  const playButton = page.getByRole('button', { name: 'Play' });

  await playButton.click();
}

async function typeOnVirtualKeyboardWord(page: Page, text = '') {
  const letters = text.split('');

  for (const letter of letters) {
    const keyForLetter = page.getByTestId(`key-${letter}`);

    await page.waitForTimeout(60);
    
    await keyForLetter.click();
  }
}

test.describe('Typing with virtual keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await startTheGame(page);
  });

  test('Typping by clicking virtual keys should work', async ({ page }) => {
    const affixS = page.getByTestId('affix-s');
    await expect(affixS).not.toBeVisible();

    const keyS = page.getByTestId('key-s');

    await expect(keyS).not.toHaveClass(/typed/);

    await keyS.click();

    await expect(keyS).toHaveClass(/typed/);

    await expect(affixS).toBeVisible();
  });

  test('Typed word should be displayed', async ({ page }) => {
    const wordReset = page.getByTestId('word-reset');
    await expect(wordReset).not.toBeVisible();

    typeOnVirtualKeyboardWord(page, 'reset');

    await expect(wordReset).toBeVisible();

    const affixS = wordReset.getByTestId('affix-s');

    await expect(affixS).toHaveClass(/new/);
  });

  test('Correct word can be submited', async ({ page }) => {
    typeOnVirtualKeyboardWord(page, 'reset');

    const affixS = page.getByTestId('affix-s');

    await expect(affixS).toHaveClass(/new/);

    await page.getByTestId('key-enter').click();

    await page.getByTestId('confirm-word-yes').click();

    /* 
      We find "s" that way because, after submitting, it can become part of a larger affix,
      for example: "best" puts it in affix-es.
    */
    const wordReset = page.getByTestId('word-reset');

    const affixWithS = wordReset.getByText(/s/);
  
    await expect(affixWithS).not.toHaveClass(/new/);
  });

  test('Incorrect word is rejected with toast', async ({ page }) => {
    typeOnVirtualKeyboardWord(page, 'dshjg');

    await page.getByTestId('key-enter').click();

    await page.getByTestId('confirm-word-yes').click();

    const affixH = page.getByTestId('affix-h');

    await expect(page.getByTestId('toast-game-isNotInDictionary')).toBeVisible();

    await expect(affixH).toHaveClass(/new/);
  });
});
