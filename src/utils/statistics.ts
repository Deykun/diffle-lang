import { GameMode, UsedLetters } from '@common-types';

import { WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS, SUPPORTED_LANGS } from '@const';

import { convertMillisecondsToTime } from './date';
import { getHasSpecialCharacters } from './normilzeWord';

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

type LocalStorageStatisticInput = {
  gameMode: GameMode | ModeFilter,
  gameLanguage: string,
  hasSpecialCharacters: boolean,
  isShort: boolean,
};

export const getLocalStorageKeyForStat = ({
  gameLanguage, gameMode, hasSpecialCharacters, isShort,
}: LocalStorageStatisticInput) => {
  return `diffle_stats_${gameLanguage}_${gameMode}_${hasSpecialCharacters ? 'special' : 'no_special'}_${isShort ? 'short' : 'long'}`;
};

type LocalStorageStreakInput = {
  gameMode?: GameMode | ModeFilter,
  gameLanguage: string,
};

export const getLocalStorageKeyForStreak = ({ gameLanguage, gameMode }: LocalStorageStreakInput) => {
  return `diffle_streak_${gameLanguage}_${gameMode || ModeFilter.All}`;
};

export type Statistic = {
  meta: string[],
  totals: {
    won: number,
    lost: number,
    letters: number,
    words: number,
    rejectedWords: number,
    durationMS: number,
  },
  medianData: {
    letters: {
      [key: number]: number,
    },
    words: {
      [key: number]: number,
    },
    rejectedWords: {
      [key: number]: number,
    },
  },
  letters: {
    keyboardUsed: number,
    correct: number,
    position: number,
    incorrect: number,
    typedKnownIncorrect: number,
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
    rejectedWords: number,
    durationMS: number,
  },
  lastLostGame?: {
    word: string,
    words: number,
  },
};

const EMPTY_STATISTIC = {
  meta: ['empty'],
  totals: {
    won: 0,
    lost: 0,
    letters: 0,
    words: 0,
    rejectedWords: 0,
    keyboardUsagePercentage: 0,
    durationMS: 0,
  },
  medianData: {
    letters: {},
    words: {},
    rejectedWords: {},
  },
  letters: {
    keyboardUsed: 0,
    correct: 0,
    position: 0,
    incorrect: 0,
    typedKnownIncorrect: 0,
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

    if (!state.medianData?.rejectedWords) {
      state.medianData.rejectedWords = {};
    }

    return state;
  }

  return JSON.parse(JSON.stringify(EMPTY_STATISTIC));
};

export const getStatisticParamsForWord = (word: string) => {
  const isShort = word.length <= WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS;
  const hasSpecialCharacters = getHasSpecialCharacters(word);

  return {
    isShort,
    hasSpecialCharacters,
  };
};

export const getStatistic = ({
  gameLanguage, gameMode, hasSpecialCharacters, isShort,
}: LocalStorageStatisticInput): Statistic => {
  const key = getLocalStorageKeyForStat({
    gameLanguage,
    gameMode,
    hasSpecialCharacters,
    isShort,
  });

  return getStatisticForKey(key);
};

export const saveStatistic = ({
  gameLanguage, gameMode, hasSpecialCharacters, isShort,
}: LocalStorageStatisticInput, statistics: Statistic) => {
  const key = getLocalStorageKeyForStat({
    gameLanguage,
    gameMode,
    hasSpecialCharacters,
    isShort,
  });

  const statisticToSave = JSON.stringify({
    ...statistics,
    meta: [key || 'unknown'],
  });

  localStorage.setItem(key, statisticToSave);
};

export const removeStatisticsByGameMode = ({ gameLanguage, gameMode }: { gameLanguage: string, gameMode: ModeFilter }) => {
  const keysToRemove = getStatisticFiltersForKeys(gameLanguage, {
    modeFilter: gameMode,
    lengthFilter: LengthFilter.All,
    charactersFilter: CharactersFilter.All,
  });

  keysToRemove.forEach((keyToRemove) => {
    localStorage.removeItem(keyToRemove);
  });

  // If we remove Daily filter mode all should be equal to Practice (same is aplied for the opposite)
  const streakModeToSetAsAll = gameMode === ModeFilter.Daily ? ModeFilter.Practice : ModeFilter.Daily;

  const streakToUseForAll = getStreak({ gameLanguage, gameMode: streakModeToSetAsAll });

  saveStreak({ gameLanguage, gameMode: ModeFilter.All }, streakToUseForAll);

  const keyOfStreakToRemove = getLocalStorageKeyForStreak({ gameLanguage, gameMode });
  localStorage.removeItem(keyOfStreakToRemove);
};

export type Streak = {
  wonStreak: number,
  lostStreak: number,
  bestStreak: number,
  worstStreak: number,
};

const EMPTY_STREAK = {
  wonStreak: 0,
  lostStreak: 0,
  bestStreak: 0,
  worstStreak: 0,
};

const getStreakForKey = (key: string): Streak => {
  const savedState = localStorage.getItem(key);

  if (savedState) {
    const state = JSON.parse(savedState) as Streak;

    return state;
  }

  return JSON.parse(JSON.stringify(EMPTY_STREAK));
};

export const getStreak = ({ gameLanguage, gameMode }: LocalStorageStreakInput) => {
  const key = getLocalStorageKeyForStreak({
    gameLanguage,
    gameMode,
  });

  return getStreakForKey(key);
};

export const saveStreak = ({ gameLanguage, gameMode }: LocalStorageStreakInput, streak: Streak) => {
  const key = getLocalStorageKeyForStreak({
    gameLanguage,
    gameMode,
  });

  const streakToSave = JSON.stringify(streak);

  localStorage.setItem(key, streakToSave);
};

export type SaveGame = LocalStorageStatisticInput & {
  wordToGuess: string,
};

const mergeStatistics = (statistics: Statistic[]): Statistic => {
  return statistics.reduce((stack: Statistic, statistic) => {
    const totalGamesStack = stack.totals.won + stack.totals.lost;
    const totalGameStatToAdd = statistic.totals.won + statistic.totals.lost;

    const weightedKeyboardNumerator = (totalGamesStack * stack.letters.keyboardUsed)
            + (totalGameStatToAdd * statistic.letters.keyboardUsed);

    const weightedKeyboarUsagePercentage = weightedKeyboardNumerator > 0
      ? Math.round(weightedKeyboardNumerator / (totalGamesStack + totalGameStatToAdd))
      : 0;

    const uniqueMedianDataLetters = [...new Set([
      ...Object.keys(stack.medianData.letters),
      ...Object.keys(statistic.medianData.letters),
    ])].map(Number);

    const medianDataLetters = uniqueMedianDataLetters.reduce((medianStack: { [key: number]: number }, key: number) => {
      medianStack[key] = (stack.medianData.letters[key] ?? 0) + (statistic.medianData.letters[key] ?? 0);

      return medianStack;
    }, {});

    const uniqueMedianDataWords = [...new Set([
      ...Object.keys(stack.medianData.words),
      ...Object.keys(statistic.medianData.words),
    ])].map(Number);

    const medianDataWords = uniqueMedianDataWords.reduce((medianStack: { [key: number]: number }, key: number) => {
      medianStack[key] = (stack.medianData.words[key] ?? 0) + (statistic.medianData.words[key] ?? 0);

      return medianStack;
    }, {});

    const uniqueMedianDataRejectedWords = [...new Set([
      ...Object.keys(stack.medianData.rejectedWords),
      ...Object.keys(statistic.medianData.rejectedWords || []), // if someone didn't have it saved earlier
    ])].map(Number);

    const medianDataRejectedWords = uniqueMedianDataRejectedWords.reduce((medianStack: { [key: number]: number }, key: number) => {
      medianStack[key] = (stack.medianData.rejectedWords[key] ?? 0) + (statistic.medianData.rejectedWords[key] ?? 0);

      return medianStack;
    }, {});

    return {
      meta: [...stack.meta, ...statistic.meta],
      totals: {
        won: stack.totals.won + statistic.totals.won,
        lost: stack.totals.lost + statistic.totals.lost,
        letters: stack.totals.letters + statistic.totals.letters,
        words: stack.totals.words + statistic.totals.words,
        rejectedWords: stack.totals.rejectedWords + statistic.totals.rejectedWords,
        durationMS: stack.totals.durationMS + statistic.totals.durationMS,
      },
      medianData: {
        letters: medianDataLetters,
        words: medianDataWords,
        rejectedWords: medianDataRejectedWords,
      },
      letters: {
        keyboardUsed: weightedKeyboarUsagePercentage,
        correct: stack.letters.correct + statistic.letters.correct,
        position: stack.letters.position + statistic.letters.position,
        incorrect: stack.letters.incorrect + statistic.letters.incorrect,
        typedKnownIncorrect: stack.letters.typedKnownIncorrect + statistic.letters.typedKnownIncorrect,
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

type KeyForFilters = {
  gameLanguage: string,
  keyModeFilter: ModeFilter,
  keyCharactersFilter: CharactersFilter,
  keyLengthFilter: LengthFilter,
  key: string,
};

const KEYS_FOR_FILTERS = [ModeFilter.Daily, ModeFilter.Practice].reduce((stack: KeyForFilters[], keyModeFilter) => {
  [CharactersFilter.NoSpecial, CharactersFilter.Special].forEach((keyCharactersFilter) => {
    const hasSpecialCharacters = keyCharactersFilter === CharactersFilter.Special;
    [LengthFilter.Short, LengthFilter.Long].forEach((keyLengthFilter) => {
      const isShort = keyLengthFilter === LengthFilter.Short;

      SUPPORTED_LANGS.forEach((gameLanguage) => {
        const key = getLocalStorageKeyForStat({
          gameLanguage,
          gameMode: keyModeFilter,
          hasSpecialCharacters,
          isShort,
        });

        stack.push({
          gameLanguage,
          keyModeFilter,
          keyCharactersFilter,
          keyLengthFilter,
          key,
        });
      });
    });
  });

  return stack;
}, []);

export type Filters = {
  gameLanguage?: string,
  modeFilter: ModeFilter,
  charactersFilter: CharactersFilter,
  lengthFilter: LengthFilter,
};

export const getStatisticFiltersForKeys = (
  gameLanguage: string,
  {
    modeFilter,
    charactersFilter,
    lengthFilter,
  }: Filters,
) => {
  const keysToUse = KEYS_FOR_FILTERS.filter(({
    gameLanguage: filterLanguage,
    keyModeFilter,
    keyCharactersFilter,
    keyLengthFilter,
  }) => {
    if (filterLanguage !== gameLanguage) {
      return false;
    }

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

  return keysToUse;
};

export const getStatisticForFilter = (
  gameLanguage: string,
  {
    modeFilter,
    charactersFilter,
    lengthFilter,
  }: Filters,
) => {
  const keysToUse = getStatisticFiltersForKeys(gameLanguage, {
    modeFilter,
    charactersFilter,
    lengthFilter,
  });

  const arrayOfStatistics = keysToUse.map(keyToUse => getStatisticForKey(keyToUse));

  return mergeStatistics(arrayOfStatistics);
};

export const getStreakForFilter = (
  gameLanguage: string,
  {
    modeFilter,
  }: { modeFilter: ModeFilter | GameMode },
): Streak => {
  return getStreak({ gameLanguage, gameMode: modeFilter });
};

export type StatisticDataForCard = {
  totalGames: number,
  totalWon: number,
  totalLost: number,
  rejectedWordsPerGame: number,
  rejectedWordsWorstWonInGame: number,
  lettersPerGame: number,
  maxLettersInGame: number,
  averageLettersPerGame: number,
  wordsPerGame: number,
  maxWordsInGame: number,
  averageWordsPerGame: number,
  timePerGame: {
    hours: number,
    minutes: number,
    seconds: number,
  },
  totalTime: {
    hours: number,
    minutes: number,
    seconds: number,
  },
  lettersPerWord: number,
  lettersInFirstWord: number,
  lettersInSecondWord: number,
  lettersCorrect: number,
  lettersPosition: number,
  lettersIncorrect: number,
  lettersTypedKnownIncorrect: number,
  keyboardUsed: number,
};

const getMedianFromMedianData = (medianData: { [value: number]: number }) => {
  const totalDataInMedian = Object.values(medianData).reduce((stack, totalForValue) => stack + totalForValue, 0);
  const medianIndex = Math.floor(totalDataInMedian / 2);
  const shouldUseAverage = totalDataInMedian % 2 === 0;

  const sortedData = Object.entries(medianData).sort(([valueA], [valueB]) => Number(valueA) - Number(valueB));

  let currenIndex = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sortedData.length; i++) {
    const [value, total] = sortedData[i];

    currenIndex += total;

    if (medianIndex < currenIndex) {
      if (shouldUseAverage) {
        const previousValue = Number(sortedData[i - 1]?.[0]);

        if (previousValue) {
          return (Number(value) + previousValue) / 2;
        }
      }

      return Number(value);
    }
  }

  // It shouldn't be possible
  return 0;
};

const getMaxFromFromMedianData = (medianData: { [value: number]: number }) => {
  return Object.keys(medianData).map(value => Number(value)).sort((a, b) => a - b).at(-1) ?? 0;
};

export const getStatisticCardDataFromStatistics = (statistic: Statistic): StatisticDataForCard => {
  const totalGames = statistic.totals.won + statistic.totals.lost;
  const totalWon = statistic.totals.won;
  const totalLost = statistic.totals.lost;

  const averageLettersPerGame = statistic.totals.letters / totalWon; // Lost games are not included in detailed games

  return {
    totalGames,
    totalWon,
    totalLost,
    rejectedWordsPerGame: getMedianFromMedianData(statistic.medianData.rejectedWords),
    rejectedWordsWorstWonInGame: getMaxFromFromMedianData(statistic.medianData.rejectedWords),
    lettersPerGame: getMedianFromMedianData(statistic.medianData.letters),
    maxLettersInGame: getMaxFromFromMedianData(statistic.medianData.letters),
    averageLettersPerGame,
    wordsPerGame: getMedianFromMedianData(statistic.medianData.words),
    maxWordsInGame: getMaxFromFromMedianData(statistic.medianData.words),
    averageWordsPerGame: statistic.totals.words / totalWon,
    timePerGame: convertMillisecondsToTime(statistic.totals.durationMS / totalWon),
    totalTime: convertMillisecondsToTime(statistic.totals.durationMS),
    lettersPerWord: statistic.totals.letters / statistic.totals.words,
    lettersInFirstWord: statistic.firstWord.letters / totalWon,
    lettersInSecondWord: statistic.secondWord.letters / totalWon,
    lettersCorrect: (statistic.letters.correct / totalWon) / averageLettersPerGame,
    lettersPosition: (statistic.letters.position / totalWon) / averageLettersPerGame,
    lettersIncorrect: (statistic.letters.incorrect / totalWon) / averageLettersPerGame,
    lettersTypedKnownIncorrect: (statistic.letters.typedKnownIncorrect / totalWon) / averageLettersPerGame,
    keyboardUsed: statistic.letters.keyboardUsed,
  };
};

export const mergeLettersData = (lettersA: UsedLetters, lettersB: UsedLetters = {}, params?: { isIncorrect?: boolean }) => {
  const uniqueLetters = [...new Set([
    ...Object.keys(lettersA),
    ...Object.keys(lettersB),
  ])].filter(Boolean);

  if (params?.isIncorrect) {
    return uniqueLetters.reduce((lettersStack: UsedLetters, letter) => {
      if (typeof lettersA[letter] === 'number') {
        if (typeof lettersB[letter] === 'number') {
          lettersStack[letter] = Math.min(lettersA[letter], lettersB[letter]);
        } else {
          lettersStack[letter] = lettersA[letter];
        }
      } else {
        lettersStack[letter] = lettersB[letter];
      }

      return lettersStack;
    }, {});
  }

  const mergedLettersData = uniqueLetters.reduce((lettersStack: UsedLetters, letter) => {
    lettersStack[letter] = Math.max((lettersA[letter] ?? 0), (lettersB[letter] ?? 0));

    return lettersStack;
  }, {});

  return mergedLettersData;
};
