import { GameMode } from '@common-types';
import Statistics from '@components/Panes/Statistics/Statistics';

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
    firstWord: {
        letters: number,
    },
    secondWord: {
        letters: number,
    },
    lastGame?: {
        word: string,
        letters: number,
        words: number,
    },
    lastLostGame?: {
        word: string,
        words: number,
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
        keyboardUsagePercentage: 0,
    },
    letters: {
        keyboardUsed: 0,
        correct: 0,
        position: 0,
        incorrect: 0,
    },
    firstWord: {
        letters: 0,
    },
    secondWord: {
        letters: 0,
    },
};

const getStatistic = ({ gameLanguage, gameMode, hasSpecialCharacters }: LocalStorageInput): Statistic => {
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

const saveStatistic = ({ gameLanguage, gameMode, hasSpecialCharacters }: LocalStorageInput, statistics: Statistic) => {
    const key = getLocalStorageKeyForStat({
        gameLanguage,
        gameMode,
        hasSpecialCharacters,
    });

    const statisticToSave = JSON.stringify(statistics);

    localStorage.setItem(key, statisticToSave);
};

export interface SaveGame extends LocalStorageInput {
    wordToGuess: string,
}

export const saveWinIfNeeded = ({
    wordToGuess,
    gameLanguage,
    gameMode,
    hasSpecialCharacters,
    guesses,
    words,
    letters,
    subtotals,
    keyboardUsagePercentage,
}: SaveGame) => {
    if (guesses.length === 1) {
        // Fortunetellers aren't counted
        return;
    }

    const statisticToUpdate = getStatistic({ gameLanguage, gameMode, hasSpecialCharacters });

    const isAlreadySaved = wordToGuess === statisticToUpdate.lastGame?.word;
    if (isAlreadySaved) {
        return;
    }

    const totalGamesStored = statisticToUpdate.totals.won + statisticToUpdate.totals.lost;
    const weightedKeyboardNumerator = (totalGamesStored * statisticToUpdate.letters.keyboardUsed) + keyboardUsagePercentage;

    const weightedKeyboarUsagePercentage = weightedKeyboardNumerator > 0 ? Math.round(weightedKeyboardNumerator / (totalGamesStored + 1)) : 0;

    statisticToUpdate.totals.won += 1;
    statisticToUpdate.totals.letters += letters;
    statisticToUpdate.totals.words += words;
    statisticToUpdate.totals.streak += 1;

    statisticToUpdate.letters.keyboardUsed = weightedKeyboarUsagePercentage;
    statisticToUpdate.letters.correct += subtotals.correct;
    statisticToUpdate.letters.position += subtotals.position;
    statisticToUpdate.letters.incorrect += subtotals.incorrect;

    if (!statisticToUpdate.lastGame) {
        statisticToUpdate.lastGame = { word: 'Hey ;)', letters: 0, words: 0 };
    }
    statisticToUpdate.lastGame.word = wordToGuess;
    statisticToUpdate.lastGame.letters = letters;
    statisticToUpdate.lastGame.words = words;

    if (statisticToUpdate.totals.streak > statisticToUpdate.totals.bestStreak) {
        statisticToUpdate.totals.bestStreak = statisticToUpdate.totals.streak;
    }

    const [firstWord, secondWord] = guesses;

    if (!statisticToUpdate.firstWord) {
        statisticToUpdate.firstWord = { letters: 0 };
    }

    statisticToUpdate.firstWord.letters += firstWord.word.length;

    if (!statisticToUpdate.secondWord) {
        statisticToUpdate.secondWord = { letters: 0 };
    }

    statisticToUpdate.secondWord.letters += secondWord.word.length;

    saveStatistic({ gameLanguage, gameMode, hasSpecialCharacters }, statisticToUpdate);
};

const mergeStatistics = (statistics: Statistic[]): Statistic => {
    return statistics.reduce((stack: Statistic, statistic) => {

        const totalGamesStack = stack.totals.won + stack.totals.lost;
        const totalGameStatToAdd = statistic.totals.won + statistic.totals.lost;

        const weightedKeyboardNumerator = (totalGamesStack * stack.letters.keyboardUsed)
            + (totalGameStatToAdd * statistic.letters.keyboardUsed);

        const weightedKeyboarUsagePercentage = weightedKeyboardNumerator > 0 ? Math.round(weightedKeyboardNumerator / (totalGamesStack + totalGameStatToAdd)) : 0;

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
                keyboardUsed: weightedKeyboarUsagePercentage,
                correct: stack.letters.correct + statistic.letters.correct,
                position: stack.letters.position + statistic.letters.position,
                incorrect: stack.letters.incorrect + statistic.letters.incorrect,
            },
            firstWord: {
                letters: stack.firstWord.letters + statistic.firstWord.letters,
            },
            secondWord: {
                letters: stack.secondWord.letters + statistic.secondWord.letters,
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

export const getStatisticCardDataFromStatistics = (statistic: Statistic) => {
    const totalGames = statistic.totals.won + statistic.totals.lost;

    return {
        totalGames,
        totalWon: statistic.totals.won,
        currentStreak: statistic.totals.streak,
        bestStreak: statistic.totals.bestStreak,
        lettersPerGame: statistic.totals.letters / totalGames,
        wordsPerGame: statistic.totals.words / totalGames,
        lettersPerWord: statistic.totals.letters / statistic.totals.words,
        lettersInFirstWord: statistic.firstWord.letters / totalGames,
        lettersInSecondWord: statistic.secondWord.letters / totalGames,
        lettersCorrect: statistic.letters.correct / totalGames,
        lettersPosition: statistic.letters.position / totalGames,
        lettersIncorrect: statistic.letters.incorrect / totalGames,
        keyboardUsed: statistic.letters.keyboardUsed,
    }
};
