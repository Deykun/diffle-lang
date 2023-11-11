import { GameMode } from '@common-types';
import { PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

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

export enum LengthFilter {
    All = 'all',
    Short = 'short',
    Long = 'long',
}

interface LocalStorageStatisticInput {
    gameMode: GameMode | ModeFilter,
    gameLanguage: string,
    hasSpecialCharacters: boolean,
    isShort: boolean,
}

export const getLocalStorageKeyForStat = ({ gameLanguage, gameMode, hasSpecialCharacters, isShort }: LocalStorageStatisticInput) => {
    return `diffle_stats_${gameLanguage}_${gameMode}_${hasSpecialCharacters ? 'special' : 'no_special'}_${isShort ? 'short' : 'long'}`;
};

interface LocalStorageStreakInput {
    gameMode: GameMode | ModeFilter,
    gameLanguage: string,
}

export const getLocalStorageKeyForStreak = ({ gameLanguage, gameMode }: LocalStorageStreakInput) => {
    return `diffle_streak_${gameLanguage}_${gameMode}`;
};

export interface Statistic {
    totals: {
        won: number,
        lost: number,
        letters: number,
        words: number,
        rejectedWords: number,
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
        rejectedWords: 0,
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

const getStatisticForKey = (key: string): Statistic => {
    const savedState = localStorage.getItem(key);

    if (savedState) {
        const state = JSON.parse(savedState) as Statistic;

        return state;
    }

    return EMPTY_STATISTIC;
};

const getStatistic = ({ gameLanguage, gameMode, hasSpecialCharacters, isShort }: LocalStorageStatisticInput): Statistic => {
    const key = getLocalStorageKeyForStat({
        gameLanguage,
        gameMode,
        hasSpecialCharacters,
        isShort,
    });

    return getStatisticForKey(key);
};

const saveStatistic = ({ gameLanguage, gameMode, hasSpecialCharacters, isShort }: LocalStorageStatisticInput, statistics: Statistic) => {
    const key = getLocalStorageKeyForStat({
        gameLanguage,
        gameMode,
        hasSpecialCharacters,
        isShort,
    });

    const statisticToSave = JSON.stringify(statistics);

    localStorage.setItem(key, statisticToSave);
};

export interface Streak {
    streak: number,
    bestStreak: number,
}

const EMPTY_STREAK = {
    streak: 0,
    bestStreak: 0,
};

const getStreakForKey = (key: string): Streak => {
    const savedState = localStorage.getItem(key);

    if (savedState) {
        const state = JSON.parse(savedState) as Streak;

        return state;
    }

    return EMPTY_STREAK;
}

const getStreak = ({ gameLanguage, gameMode }: LocalStorageStreakInput) => {
    const key = getLocalStorageKeyForStreak({
        gameLanguage,
        gameMode,
    });

    return getStreakForKey(key);
};

const saveStreak = ({ gameLanguage, gameMode}: LocalStorageStreakInput, streak: Streak) => {
    const key = getLocalStorageKeyForStreak({
        gameLanguage,
        gameMode,
    });

    const streakToSave = JSON.stringify(streak);

    localStorage.setItem(key, streakToSave);
};

export interface SaveGame extends LocalStorageStatisticInput {
    wordToGuess: string,
}

export const saveWinIfNeeded = ({
    wordToGuess,
    gameLanguage,
    gameMode,
    hasSpecialCharacters,
    guesses,
    words,
    rejectedWords,
    letters,
    subtotals,
    keyboardUsagePercentage,
}: SaveGame) => {
    if (guesses.length === 1) {
        // Fortunetellers aren't counted
        return;
    }

    const isShort = wordToGuess.length <= PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS;

    const statisticToUpdate = getStatistic({ gameLanguage, gameMode, hasSpecialCharacters, isShort });
    const streakToUpdate = getStreak({ gameLanguage, gameMode });

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
    statisticToUpdate.totals.rejectedWords += rejectedWords.length;

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

    const [firstWord, secondWord] = guesses;

    if (!statisticToUpdate.firstWord) {
        statisticToUpdate.firstWord = { letters: 0 };
    }

    statisticToUpdate.firstWord.letters += firstWord.word.length;

    if (!statisticToUpdate.secondWord) {
        statisticToUpdate.secondWord = { letters: 0 };
    }

    statisticToUpdate.secondWord.letters += secondWord.word.length;

    saveStatistic({ gameLanguage, gameMode, hasSpecialCharacters, isShort }, statisticToUpdate);

    streakToUpdate.streak += 1;

    if (streakToUpdate.streak > streakToUpdate.bestStreak) {
        streakToUpdate.bestStreak = streakToUpdate.streak;
    }

    saveStreak({ gameLanguage, gameMode }, streakToUpdate);
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
                rejectedWords: stack.totals.rejectedWords + statistic.totals.rejectedWords,
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

interface KeyForFilters {
    gameLanguage: 'pl',
    keyModeFilter: ModeFilter,
    keyCharactersFilter: CharactersFilter,
    keyLengthFilter: LengthFilter,
    key: string,
}

const KEYS_FOR_FILTERS = [ModeFilter.Daily, ModeFilter.Practice].reduce((stack: KeyForFilters[], keyModeFilter) => {
    [CharactersFilter.NoSpecial, CharactersFilter.Special].forEach(keyCharactersFilter => {
        const hasSpecialCharacters = keyCharactersFilter === CharactersFilter.Special;
        [LengthFilter.Short, LengthFilter.Long].forEach(keyLengthFilter => {
            const isShort = keyLengthFilter === LengthFilter.Short;

            const key = getLocalStorageKeyForStat({
                gameLanguage: 'pl',
                gameMode: keyModeFilter,
                hasSpecialCharacters,
                isShort,
            });

            stack.push({
                gameLanguage: 'pl',
                keyModeFilter,
                keyCharactersFilter,
                keyLengthFilter,
                key,
            })
        })
    });

    return stack;
}, []);

export const getStatisticForFilter = ({
    modeFilter,
    charactersFilter,
    lengthFilter,
}: { modeFilter: ModeFilter, charactersFilter: CharactersFilter, lengthFilter: LengthFilter }) => {
    const keysToUse = KEYS_FOR_FILTERS.filter(({
        keyModeFilter,
        keyCharactersFilter,
        keyLengthFilter,
    }) => {
        const isStrictModeFilter = [ModeFilter.Daily, ModeFilter.Practice].includes(modeFilter);
        if (isStrictModeFilter && keyModeFilter !== modeFilter) {
            return false;
        }

        const isStrictCharacterFilter = [CharactersFilter.NoSpecial, CharactersFilter.Special].includes(charactersFilter);
        if (isStrictCharacterFilter && keyCharactersFilter !== charactersFilter) {
            return false;
        }

        const isStrictLengthFilter = [LengthFilter.Short, LengthFilter.Long].includes(lengthFilter);
        if (isStrictLengthFilter && keyLengthFilter !== lengthFilter) {
            return false;
        }

        return true;
    }).map(({ key }) => key);

    const arrayOfStatistics = keysToUse.map(keyToUse => getStatisticForKey(keyToUse));

    return mergeStatistics(arrayOfStatistics);
};

export const getStreakForFilter = ({
    modeFilter,
}: { modeFilter: ModeFilter, charactersFilter: CharactersFilter, lengthFilter: LengthFilter }): Streak => {
    const isStrictModeFilter = [ModeFilter.Daily, ModeFilter.Practice].includes(modeFilter);

    if (isStrictModeFilter) {
        return getStreak({ gameLanguage: 'pl', gameMode: modeFilter });
    }

    return EMPTY_STREAK;
};

export interface StatisticForCard {
    totalGames: number,
    totalWon: number,
    rejectedWordsPerGame: number,
    lettersPerGame: number,
    wordsPerGame: number,
    lettersPerWord: number,
    lettersInFirstWord: number,
    lettersInSecondWord: number,
    lettersCorrect: number,
    lettersPosition: number,
    lettersIncorrect: number,
    keyboardUsed: number,
}

export const getStatisticCardDataFromStatistics = (statistic: Statistic): StatisticForCard => {
    const totalGames = statistic.totals.won + statistic.totals.lost;

    return {
        totalGames,
        totalWon: statistic.totals.won,
        rejectedWordsPerGame: statistic.totals.rejectedWords / totalGames,
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
