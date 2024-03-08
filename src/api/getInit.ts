import {
  GameMode, Pane, KeyboardQWERTYMode, CookiesSettingsInterfence, CookiesName,
} from '@common-types';

import { LOCAL_STORAGE, COOKIES_INITIAL_SETTINGS_UNSET, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { getNow } from '@utils/date';
import { getLangFromUrl } from '@utils/lang';
import {
  keepIfInEnum,
} from '@utils/ts';
import {
  getLocalStorageKeyForDailyStamp,
  getLocalStorageKeyForLastGameMode,
  getLocalStorageKeyForGameKeyboardLayout,
} from '@utils/game';

export const getInitCookiesSettings = () => {
  const savedCookies = localStorage.getItem(LOCAL_STORAGE.COOKIES) || '';
  if (savedCookies) {
    try {
      const savedCookiesJSON = JSON.parse(savedCookies) || {};

      const savedKeys = Object.keys(savedCookiesJSON) as CookiesName[];
      const cookiesKeys = Object.values(CookiesName);

      const isInterfaceRight = savedKeys.length === cookiesKeys.length && savedKeys.every(key => cookiesKeys.includes(key));

      if (isInterfaceRight) {
        return savedCookiesJSON as CookiesSettingsInterfence;
      }
    } catch {
      // Cookies policy has been changed
    }
  }

  return COOKIES_INITIAL_SETTINGS_UNSET;
};

export const getInitPane = ({ withUrlParam }: { withUrlParam: boolean } = { withUrlParam: true }) => {
  if (withUrlParam) {
    const urlParams = new URLSearchParams(window.location.search);

    const urlPaneRaw = urlParams.get('p');
    if (urlPaneRaw) {
      const urlPane = keepIfInEnum<Pane>(urlPaneRaw, Pane);
      if (urlPane) {
        return urlPane;
      }
    }
  }

  const langFromUrl = getLangFromUrl();

  if (langFromUrl) {
    const localStorageKeyForLastGameMode = getLocalStorageKeyForLastGameMode({ gameLanguage: langFromUrl });
    const lastGameMode = localStorage.getItem(localStorageKeyForLastGameMode) as GameMode;

    return !lastGameMode ? Pane.Help : Pane.Game;
  }

  // Legacy check
  const localStorageKeyForLastGameMode = getLocalStorageKeyForLastGameMode({ gameLanguage: 'pl' });
  const lastGameMode = localStorage.getItem(localStorageKeyForLastGameMode) as GameMode;

  return !lastGameMode ? Pane.Help : Pane.Game;
};

export const getInitMode = () => {
  const langFromUrl = getLangFromUrl();

  if (langFromUrl) {
    const localStorageKeyForLastGameMode = getLocalStorageKeyForLastGameMode({ gameLanguage: langFromUrl });
    const lastGameMode = localStorage.getItem(localStorageKeyForLastGameMode) as GameMode;

    const localStorageKeyForDailyStamp = getLocalStorageKeyForDailyStamp({ gameLanguage: langFromUrl });
    const lastStamp = localStorage.getItem(localStorageKeyForDailyStamp);

    const { stamp } = getNow();

    // Player should complete daily game before starting practice
    const shouldForceDaily = lastGameMode === GameMode.Practice && lastStamp !== stamp;
    const initGameModeFromStored = shouldForceDaily ? GameMode.Daily : lastGameMode;

    if (initGameModeFromStored) {
      return initGameModeFromStored;
    }
  }

  return GameMode.Daily;
};

export const getInitIsSmallKeyboard = () => {
  if (localStorage.getItem(LOCAL_STORAGE.IS_SMALL_KEYBOARD) === 'true') {
    return true;
  }

  const isWideScreen = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 1024;

  return isWideScreen;
};

export const getInitKeyboardMode = () => {
  const savedMode = keepIfInEnum<KeyboardQWERTYMode>(localStorage.getItem(LOCAL_STORAGE.QWERTY_MODE) || '', KeyboardQWERTYMode);
  if (savedMode) {
    return savedMode;
  }

  return KeyboardQWERTYMode.FROM_LANG;
};

export const getInitKeyboardLayoutIndex = () => {
  const langFromUrl = getLangFromUrl();

  if (langFromUrl) {
    const localStorageKey = getLocalStorageKeyForGameKeyboardLayout({ gameLanguage: langFromUrl });
    const layoutIndex = localStorage.getItem(localStorageKey);

    if (layoutIndex) {
      const layoutIndexNumber = Number(layoutIndex);

      const hasMatchingVariant = SUPPORTED_DICTIONARY_BY_LANG[langFromUrl].keyLinesVariants[Number(layoutIndexNumber)];

      if (hasMatchingVariant) {
        return layoutIndexNumber;
      }
    }
  }

  return 0;
};

export const getInitShouldVibrate = () => {
  // By default returns false
  return localStorage.getItem(LOCAL_STORAGE.SHOULD_VIBRATE) === 'true';
};

export const getInitShouldKeyboardVibrate = () => {
  const shouldVibrateAtAll = getInitShouldVibrate();

  return shouldVibrateAtAll && localStorage.getItem(LOCAL_STORAGE.SHOULD_VIBRATE_KEYBOARD) === 'true';
};

export const getIsEnterSwapped = () => {
  const shouldSwapEnter = localStorage.getItem(LOCAL_STORAGE.SHOULD_SWAP_ENTER) === 'true';

  return shouldSwapEnter;
};

export const getShouldConfirmEnter = () => {
  const shouldBlock = localStorage.getItem(LOCAL_STORAGE.SHOULD_CONFIRM_ENTER) === 'false';

  // By default returns true
  return !shouldBlock;
};

export const getShouldShareWords = () => {
  const shouldBlock = localStorage.getItem(LOCAL_STORAGE.SHOULD_SHARE_WORDS) === 'false';

  // By default returns true
  return !shouldBlock;
};
