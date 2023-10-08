import { GameMode } from '@common-types';

export enum ModeFilter {
    All = 'all',
    Daily = 'daily',
    Practice = 'practice',
}

export enum CharactersFilter {
    All = 'all',
    NoSpecial = 'noSpecial',
    Special = 'onlySpecial',
}
interface LocalStorageInput {
    gameMode: GameMode,
    gameLanguage: string,
    hasSpecialCharacters: boolean,
}

export const getLocalStorageKeyForStat = ({ gameLanguage, gameMode, hasSpecialCharacters }: LocalStorageInput) => {
    return `diffle_stats_${gameLanguage}_${gameMode}_${hasSpecialCharacters ? 'special' : 'no_special'}`;
};

// What should be noted in local storage
//  - lastRecordedWord
//  - lastPlay
//  - legnth of first / second word


// Globally:
//  - used letters
//     - green, yellow, gray
//     - unique letters

// Questions:
//   - should there be a division for special characters and not?

//  What should be rejected:
//   - one word win in stats

// What options should be avaialble:
//  - reset stats (per mode)
//  - export stats
//  - import stats
//  - share stats
 

interface Statistic {
    totals: {
        won: number,
        lost: number,
        letters: number,
        words: number,
        streak: number,
        bestStreak: number,
    },
    letters: {
        keyboardUsed: number,
        correct: number,
        position: number,
        incorrect: number,
    },
    first: {
        games: number,
        letters: number,
    },
    second: {
        games: number,
        letters: number,
    },
    last?: {
        word: string,
        letters: number,
        words: number,
    },
    lost?: {
        word: string,
        wors: number,
    },
}

const EMPTY_STATISTIC = {
    totals: {
        won: 0,
        lost: 0,
        letters: 0,
        words: 0,
        streak: 0,
        bestStreak: 0,
    },
    letters: {
        keyboardUsed: 0,
        correct: 0,
        position: 0,
        incorrect: 0,
    },
    first: {
        games: 0,
        letters: 0,
    },
    second: {
        games: 0,
        letters: 0,
    },
};

const getStatistic= ({ gameLanguage, gameMode, hasSpecialCharacters }: LocalStorageInput): Statistic => {
    const key = getLocalStorageKeyForStat({
        gameLanguage,
        gameMode,
        hasSpecialCharacters,
    });

    const savedState = localStorage.getItem(key);

    if (savedState) {
        const state = JSON.parse(savedState) as Statistic;

        return state;
    }

    return EMPTY_STATISTIC;
}

export saveWinIfNeeded = ({ gameLanguage, gameMode, hasSpecialCharacters }: LocalStorageInput) => {

};

const mergeStatistics = (statistics: Statistic[]): Statistic => {
    return statistics.reduce((stack: Statistic, statistic) => {
        return {
            totals: {
                won: stack.totals.won + statistic.totals.won,
                lost: stack.totals.lost + statistic.totals.lost,
                letters: stack.totals.letters + statistic.totals.letters,
                words: stack.totals.words + statistic.totals.words,
                streak: Math.max(stack.totals.streak, statistic.totals.streak),
                bestStreak: Math.max(stack.totals.bestStreak, statistic.totals.bestStreak),
            },
            letters: {
                keyboardUsed: stack.letters.keyboardUsed + statistic.letters.keyboardUsed,
                correct: stack.letters.correct + statistic.letters.correct,
                position: stack.letters.position + statistic.letters.position,
                incorrect: stack.letters.incorrect + statistic.letters.incorrect,
            },
            first: {
                games: stack.first.games + statistic.first.games,
                letters: stack.first.letters + statistic.first.letters,
            },
            second: {
                games: stack.second.games + statistic.second.games,
                letters: stack.second.letters + statistic.second.letters,
            },
        };
    }, EMPTY_STATISTIC);
};

export const getStatisticForFilter = ({
    modeFilter,
    modeCharactersFilter,
}: { modeFilter: ModeFilter, modeCharactersFilter: CharactersFilter }) => {
    const modesToMerge = [];

    if ([ModeFilter.All, ModeFilter.Daily].includes(modeFilter)) {
        modesToMerge.push(GameMode.Daily);
    }

    if ([ModeFilter.All, ModeFilter.Practice].includes(modeFilter)) {
        modesToMerge.push(GameMode.Practice);
    }

    const arrayOfStatistics = modesToMerge.reduce((stack: Statistic[], modeToMerge) => {
        if ([CharactersFilter.All, CharactersFilter.NoSpecial].includes(modeCharactersFilter)) {
            const statisticToUse = getStatistic({
                gameLanguage: 'pl',
                gameMode: modeToMerge,
                hasSpecialCharacters: false,
            });

            stack.push(statisticToUse);
        }

        if ([CharactersFilter.All, CharactersFilter.Special].includes(modeCharactersFilter)) {
            const statisticToUse = getStatistic({
                gameLanguage: 'pl',
                gameMode: modeToMerge,
                hasSpecialCharacters: true,
            });

            stack.push(statisticToUse);
        }

        return stack;
    }, []);

    return mergeStatistics(arrayOfStatistics);
};
