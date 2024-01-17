import { GameMode } from '@common-types';

export const getLocalStorageKeyForGame = ({ gameLanguage, gameMode }: { gameLanguage: string, gameMode: GameMode }) => {
    return `diffle_${gameLanguage}_mode_${gameMode}'}`;
};

export const getLocalStorageKeyForDailyStamp = ({ gameLanguage }: { gameLanguage: string }) => {
    return `diffle_${gameLanguage}_daily_stamp`;
};

export const getLocalStorageKeyForLastGameMode = ({ gameLanguage }: { gameLanguage: string }) => {
    return `diffle_${gameLanguage}_last_game_mode`;
};
