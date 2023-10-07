import { GameMode } from '@common-types';

interface LocalStorageInput {
    gameMode: GameMode,
    gameLanguage: string,
    isSpecialCharacters: boolean,
}

export const getLocalStorageKeyForStat = ({ gameLanguage, gameMode, isSpecialCharacters }: LocalStorageInput) => {
    return `diffle_stats_${gameLanguage}_${gameMode}_${isSpecialCharacters ? 'special' : 'en'}`;
};
