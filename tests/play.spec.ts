import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:2001/diffle-lang/';
const BASE_URL_EN = `${BASE_URL}en`;

test('Should render "Help" and keyboard after clicking "Play"', async ({ page }) => {
  await page.goto(BASE_URL_EN);
  await page.getByTestId('accept-all-cookies').click();

  const playButton = page.getByRole('button', { name: 'Play' });

  await expect(playButton).toBeVisible();

  // Click the get started link.
  await playButton.click();
 
  const keyS = page.getByTestId('key-s');

  await expect(keyS).toBeVisible();
});

async function startTheGame(page: Page) {
  await page.goto(BASE_URL_EN);
  await page.getByTestId('accept-all-cookies').click();

  const playButton = page.getByRole('button', { name: 'Play' });

  await playButton.click();
}

async function typeOnVirtualKeyboardWord(page: Page, text = '') {
  const letters = text.split('');

  for (const letter of letters) {
    const keyForLetter = page.getByTestId(`key-${letter}`);
    
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
  
    await expect(affixS).not.toHaveClass(/new/);
  });

  test('Incorrect word is rejected with toast', async ({ page }) => {
    typeOnVirtualKeyboardWord(page, 'dshjgs');

    await page.getByTestId('key-enter').click();

    await page.getByTestId('confirm-word-yes').click();

    const affixH = page.getByTestId('affix-h');

    await expect(page.getByTestId('toast-game-isNotInDictionary')).toBeVisible();

    await expect(affixH).toHaveClass(/new/);
  });
});
