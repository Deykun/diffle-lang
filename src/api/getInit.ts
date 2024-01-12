import { GameMode, Pane } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { getNow } from '@utils/date';

export const getInitPane = () => {
    const lastGameMode = localStorage.getItem(LOCAL_STORAGE.LAST_GAME_MODE);

    return !lastGameMode ? Pane.Help : Pane.Game;
};

export const getInitMode = () => {
    const lastGameMode = localStorage.getItem(LOCAL_STORAGE.LAST_GAME_MODE) as GameMode;
    const lastStamp = localStorage.getItem(LOCAL_STORAGE.LAST_DAILY_STAMP);
    const { stamp } = getNow();

    // Player should complete daily game before starting practice 
    const shouldForceDaily = lastGameMode === GameMode.Practice && lastStamp !== stamp;
    const initGameModeFromStored = shouldForceDaily ? GameMode.Daily : lastGameMode;

    if (!initGameModeFromStored) {
        return GameMode.Daily;
    }

    return initGameModeFromStored;
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
