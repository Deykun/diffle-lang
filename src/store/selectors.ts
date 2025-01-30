import { createSelector } from '@reduxjs/toolkit';

import {
  RootState,
  Dictionary,
  Word as WordType,
  AffixStatus,
  UsedLetters,
  GameStatus,
  LetterReportStatus,
  LetterSubreport,
} from '@common-types';

import { getIsFirstStampInFuture } from '@utils/date';

import { LOCAL_STORAGE, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { getHasSpecialCharacters } from '@utils/normilzeWord';

import { getLetterOccuranceInWord } from './utils/getLetterOccuranceInWord';
import { getKeyboardState } from './utils/getKeyboardState';

export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

export const selectIsWon = (state: RootState) => state.game.status === GameStatus.Won;
export const selectIsLost = (state: RootState) => state.game.status === GameStatus.Lost;
export const selectIsGameEnded = (state: RootState) => state.game.status !== GameStatus.Guessing;

export const selectCookiesPolicyHash = createSelector(
  (state: RootState) => state.app.cookies,
  (cookies): string => {
    return Object.values(cookies).map(isChecked => (isChecked ? 't' : 'f')).join('-');
  },
);

export const selectGameLanguageKeyboardInfo = createSelector(
  (state: RootState) => state.game.language,
  (state: RootState) => state.app.keyboardLayoutIndex,
  (state: RootState) => state.app.isEnterSwapped,
  (gameLanguage, userPrefferedLayout, isEnterSwapped): Dictionary => {
    if (!gameLanguage || !SUPPORTED_DICTIONARY_BY_LANG[gameLanguage]) {
      return {
        code: undefined,
        title: '',
        languages: [],
        keyLinesVariants: [],
        keyLinesToUse: [],
        allowedKeys: [],
        characters: [],
        specialCharacters: [],
        hasSpecialCharacters: false,
        urls: [],
        shareMarker: '',
      };
    }
    const {
      keyLinesVariants,
      ...dictionary
    } = SUPPORTED_DICTIONARY_BY_LANG[gameLanguage];

    let keyLinesToUse = keyLinesVariants[userPrefferedLayout]
      ? keyLinesVariants[userPrefferedLayout].keyLines
      : keyLinesVariants[0].keyLines;

    if (isEnterSwapped) {
      keyLinesToUse = keyLinesToUse.map(line => line.map((keyText) => {
        if (keyText === 'enter') {
          return 'backspace';
        }

        if (keyText === 'backspace') {
          return 'enter';
        }

        return keyText;
      }));
    }

    return {
      ...dictionary,
      keyLinesVariants,
      keyLinesToUse,
    };
  },
);

export const selectHasWordToGuessSpecialCharacters = createSelector(
  selectWordToGuess,
  wordToGuess => getHasSpecialCharacters(wordToGuess),
);

const selectCorrectLetters = (state: RootState) => state.game.letters.correct;
const selectIncorrectLetters = (state: RootState) => state.game.letters.incorrect;
const selectPositionLetters = (state: RootState) => state.game.letters.position;

export const selectGuesses = (state: RootState) => state.game.guesses;

const getLetterState = ({
  letter,
  wordToSubmit,
  wordToGuess,
  correctLetters,
  incorrectLetters,
  positionLetters,
  specialCharacters,
}: {
  letter: string,
  wordToSubmit: string,
  wordToGuess: string,
  correctLetters: UsedLetters,
  incorrectLetters: UsedLetters,
  positionLetters: UsedLetters,
  specialCharacters: string[],
}) => {
  const isSpecialCharacter = specialCharacters.includes(letter);

  if (isSpecialCharacter) {
    const hasWordToGuessSpecialCharacter = wordToGuess && getHasSpecialCharacters(wordToGuess);

    if (!hasWordToGuessSpecialCharacter) {
      // All special characters are marked as incorrect if word to guess dosen't have one
      return AffixStatus.Incorrect;
    }
  }

  if (typeof incorrectLetters[letter] === 'number') {
    const isCorrectSometimes = positionLetters[letter] > 0;
    if (isCorrectSometimes) {
      const occurrencesOfLetterInSubmitedWord = getLetterOccuranceInWord(letter, wordToSubmit);

      const isCorrectSometimesButHereNumberOfOccuranceIsTooHigh = occurrencesOfLetterInSubmitedWord > positionLetters[letter];
      if (isCorrectSometimesButHereNumberOfOccuranceIsTooHigh) {
        return AffixStatus.IncorrectOccurance;
      }
    } else {
      return AffixStatus.Incorrect;
    }
  }

  if (correctLetters[letter]) {
    return AffixStatus.Correct;
  }

  if (positionLetters[letter]) {
    return AffixStatus.Position;
  }

  return AffixStatus.Unknown;
};

export const selectLetterState = (letter: string) => createSelector(
  selectWordToSubmit,
  selectWordToGuess,
  selectGameLanguageKeyboardInfo,
  selectCorrectLetters,
  selectIncorrectLetters,
  selectPositionLetters,
  (wordToSubmit, wordToGuess, { specialCharacters }, correctLetters, incorrectLetters, positionLetters) => {
    return getLetterState({
      letter, wordToSubmit, wordToGuess, correctLetters, incorrectLetters, positionLetters, specialCharacters,
    });
  },
);

export const selectLetterSubreport = (letter: string) => createSelector(
  selectWordToSubmit,
  selectIncorrectLetters,
  selectPositionLetters,
  (wordToSubmit, incorrectLetters, positionLetters): LetterSubreport => {
    const isLimitKnown = typeof incorrectLetters[letter] === 'number';
    const confirmedOccurrence = positionLetters[letter] ?? 0;

    if (confirmedOccurrence === 0) {
      return {
        status: LetterReportStatus.Ignored,
      };
    }

    const typedOccurrence = getLetterOccuranceInWord(letter, wordToSubmit);

    const isLimitOne = isLimitKnown && confirmedOccurrence === 1;
    const isLimitOneAndInRange = isLimitOne && typedOccurrence <= confirmedOccurrence;

    if (isLimitOneAndInRange) {
      return {
        status: LetterReportStatus.Ignored,
      };
    }

    const isLimitUnknownAndConfirmedLessThanOne = !isLimitKnown && confirmedOccurrence === 1;

    if (isLimitUnknownAndConfirmedLessThanOne) {
      return {
        status: LetterReportStatus.Ignored,
      };
    }

    let status = LetterReportStatus.Correct;

    const wasLimitPassed = isLimitKnown && typedOccurrence > confirmedOccurrence;
    if (wasLimitPassed) {
      status = LetterReportStatus.TooManyLetters;
    }

    const wasLimitNotMet = typedOccurrence < confirmedOccurrence;
    if (wasLimitNotMet) {
      status = LetterReportStatus.NotEnoughLetters;
    }

    return {
      status,
      isLimitKnown,
      typedOccurrence,
      confirmedOccurrence,
    };
  },
);

const selectFlatAffixes = (state: RootState) => state.game.flatAffixes;

export const selectWordState = (word: string) => createSelector(
  selectWordToSubmit,
  selectWordToGuess,
  selectGameLanguageKeyboardInfo,
  selectCorrectLetters,
  selectIncorrectLetters,
  selectPositionLetters,
  selectFlatAffixes,
  (wordToSubmit, wordToGuess, { specialCharacters }, correctLetters, incorrectLetters, positionLetters, flatAffixes) => {
    const uniqueLettersInWord = [...new Set(word.split(''))].filter(letter => ![' '].includes(letter));

    const lettersStatusPairs = uniqueLettersInWord.map(
      letter => ({
        letter,
        status: getLetterState({
          letter,
          wordToSubmit,
          wordToGuess,
          correctLetters,
          incorrectLetters,
          positionLetters,
          specialCharacters,
        }),
      }),
    );

    const hasIncorrectLetterTyped = lettersStatusPairs.some(
      ({ status }) => status === AffixStatus.Incorrect,
    );

    if (hasIncorrectLetterTyped) {
      const details = lettersStatusPairs.filter(
        ({ status }) => status === AffixStatus.Incorrect,
      ).map(({ letter }) => letter).join(', ');

      return {
        status: AffixStatus.Incorrect,
        details,
      };
    }

    const hasTypedTooMuch = lettersStatusPairs.some(
      ({ status }) => status === AffixStatus.IncorrectOccurance,
    );

    if (hasTypedTooMuch) {
      const details = lettersStatusPairs.filter(
        ({ status }) => status === AffixStatus.IncorrectOccurance,
      ).map(({ letter }) => letter).join(', ');

      return {
        status: AffixStatus.IncorrectOccurance,
        details,
      };
    }

    const isWrongStart = !wordToSubmit.startsWith(flatAffixes.start);
    if (isWrongStart) {
      return {
        status: AffixStatus.IncorrectStart,
        details: `${flatAffixes.start}•`,
      };
    }

    const isWrongEnd = !wordToSubmit.endsWith(flatAffixes.end);
    if (isWrongEnd) {
      return {
        status: AffixStatus.IncorrectEnd,
        details: `•${flatAffixes.end}`,
      };
    }

    const isWrongMiddle = flatAffixes.middle.some(flatAffix => !wordToSubmit.includes(flatAffix));
    if (isWrongMiddle) {
      return {
        status: AffixStatus.IncorrectMiddle,
        // details: skipped because not used?
      };
    }

    return {
      status: AffixStatus.Unknown,
    };
  },
);

export const selectKeyboardState = createSelector(
  selectWordToGuess,
  selectWordToSubmit,
  selectIncorrectLetters,
  selectPositionLetters,
  selectFlatAffixes,
  (wordToGuess, wordToSubmit, incorrectLetters, positionLetters, flatAffixes) => {
    return getKeyboardState({
      wordToGuess, wordToSubmit, incorrectLetters, positionLetters, flatAffixes,
    });
  },
);

export const selectKeyboardUsagePercentage = createSelector(
  selectGameLanguageKeyboardInfo,
  selectCorrectLetters,
  selectIncorrectLetters,
  selectPositionLetters,
  ({ characters }, correctLetters, incorrectLetters, positionLetters) => {
    const totalNumberOfLetters = characters.length;

    const usedLetters = [...new Set([...Object.keys(correctLetters), ...Object.keys(incorrectLetters), ...Object.keys(positionLetters)])];
    const totalNumberOfUsedLetters = usedLetters.length;

    return Math.round((totalNumberOfUsedLetters / totalNumberOfLetters) * 100);
  },
);

type AffixStackType = {
  incorrectLetters: string[],
  subtotals: {
    correct: number,
    position: number,
    incorrect: number,
    typedKnownIncorrect: number,
  }
};

type GuessesStackInterface = AffixStackType & {
  words: number,
};

export const getWordsAndLetters = (guesses: WordType[], hasWordToGuessSpecialCharacters: boolean) => {
  const { words, subtotals } = guesses.reduce((guessesStack: GuessesStackInterface, { affixes }) => {
    const { subtotals: wordTotals, incorrectLetters: wordIncorrectLetters } = affixes.reduce((affixesStack: AffixStackType, affix) => {
      if (affix.type === AffixStatus.Correct) {
        affixesStack.subtotals.correct += affix.text.length;
      }

      if (affix.type === AffixStatus.Position) {
        affixesStack.subtotals.position += affix.text.length;
      }

      if (affix.type === AffixStatus.Incorrect) {
        // Incorrect affixes are always length = 1
        affixesStack.subtotals.incorrect += 1;

        /*
          The letter can be either correct or incorrect; for example, if it exists in incorrectLetters,
          that means the user knows it occurs only once. In the future, more logic can be implemented
          to signal this better in code and to the end user.
        */
        const typedWhenWasKnownToBeIncorrect = guessesStack.incorrectLetters.includes(affix.text);
        const isSpecialCharacterButWinningWordDonNotHaveThem = !hasWordToGuessSpecialCharacters && getHasSpecialCharacters(affix.text);

        if (typedWhenWasKnownToBeIncorrect || isSpecialCharacterButWinningWordDonNotHaveThem) {
          affixesStack.subtotals.typedKnownIncorrect += 1;
        } else {
          affixesStack.incorrectLetters = [...affixesStack.incorrectLetters, ...affix.text];
        }
      }

      return affixesStack;
    }, {
      subtotals: {
        correct: 0,
        position: 0,
        incorrect: 0,
        typedKnownIncorrect: 0,
      },
      incorrectLetters: [],
    });

    guessesStack.words += 1;
    guessesStack.subtotals.correct += wordTotals.correct;
    guessesStack.subtotals.position += wordTotals.position;
    guessesStack.subtotals.incorrect += wordTotals.incorrect;
    guessesStack.subtotals.typedKnownIncorrect += wordTotals.typedKnownIncorrect;
    guessesStack.incorrectLetters = [...guessesStack.incorrectLetters, ...wordIncorrectLetters];

    return guessesStack;
  }, {
    words: 0,
    incorrectLetters: [],
    subtotals: {
      correct: 0,
      position: 0,
      incorrect: 0,
      typedKnownIncorrect: 0,
    },
  });

  return {
    words,
    letters: subtotals.correct + subtotals.position + subtotals.incorrect,
    subtotals,
  };
};

export const selectGuessesStatsForLetters = createSelector(
  selectGuesses,
  selectHasWordToGuessSpecialCharacters,
  getWordsAndLetters,
);

export const selectIsTodayEasterDay = createSelector(
  (state: RootState) => state.game.today,
  (state: RootState) => state.game.easterEggDays,
  (today, easterEggDays) => {
    const todayWithoutYear = today.split('.').slice(0, 2).join('.');

    const maxDailyStamp = localStorage.getItem(LOCAL_STORAGE.MAX_DAILY_STAMP) || '' as string;
    if (maxDailyStamp) {
      const isMaxDateInFutureAndSomeoneProbablyCheated = getIsFirstStampInFuture(maxDailyStamp, today);

      if (isMaxDateInFutureAndSomeoneProbablyCheated) {
        return false;
      }
    }

    return Boolean(easterEggDays[todayWithoutYear]);
  },
);
