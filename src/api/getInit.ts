import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { getNow } from '@utils/date';

export const getInitPane = () => {
    const lastGameMode = localStorage.getItem(LOCAL_STORAGE.LAST_GAME_MODE);

    return !lastGameMode ? 'help' : 'game';
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

