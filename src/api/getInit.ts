import { GameMode, Pane } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { getNow } from '@utils/date';
import { getLangFromUrl } from '@utils/lang';
import {
    getLocalStorageKeyForDailyStamp,
    getLocalStorageKeyForLastGameMode,
 } from '@utils/game';

export const getInitPane = () => {
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
