import { GameMode } from '@common-types';

interface LocalStorageInput {
    gameMode: GameMode,
    gameLanguage: string,
};


export const getLocalStorageKeyForStat = ({ gameLanguage, gameMode }: LocalStorageInput) => {
    return `diffle_stats_${gameLanguage}_${gameMode}`;
};
