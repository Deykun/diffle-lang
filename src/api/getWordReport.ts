import {
  Affix, AffixStatus, FlatAffixes, UsedLetters, UsedLettersByType,
} from '@common-types';

import { SUBMIT_ERRORS } from '@const';

import getDoesWordExist, { DoesWordExistErrorTypes } from '@api/getDoesWordExist';
import compareWords from '@api/utils/compareWords';
import { mergeFlatAffixes } from '@api/helpers';

import { mergeLettersData } from '@utils/statistics';

export type PatternReport = {
  affixes: Affix[],
  wordLetters: UsedLettersByType,
  current?: Affix
};

export const temporaryTranslatorPatterns = (word: string, pattern: number[]): PatternReport => {
  const letters = Array.from(word);
  const { length } = pattern;

  const { affixes, wordLetters } = pattern.reduce((stack: PatternReport, value: number, index: number) => {
    const letter = letters[index];
    const shouldClose = value < 3;

    if (shouldClose) {
      const { type, text } = stack.current || {};

      if (type && text) {
        stack.affixes.push({ type, text });
        stack.current = { type: AffixStatus.Unknown, text: '' };
      }
    }

    if (value === 2 || value === 3) {
      const { text } = stack.current || {};

      stack.current = ({ type: AffixStatus.Correct, text: `${text}${letter}` });

      stack.wordLetters.correct[letter] = stack.wordLetters.correct[letter] ? stack.wordLetters.correct[letter] + 1 : 1;
      /*
        All discovered letters from the winning word are added to the position counter (correct position is a position too),
        which tells us how many occurrences of the letter are in the word.
      */
      stack.wordLetters.position[letter] = stack.wordLetters.position[letter] ? stack.wordLetters.position[letter] + 1 : 1;
    }

    if (value === 1) {
      stack.affixes.push({ type: AffixStatus.Position, text: letter });

      stack.wordLetters.position[letter] = stack.wordLetters.position[letter] ? stack.wordLetters.position[letter] + 1 : 1;
    }

    if (value === 0) {
      stack.affixes.push({ type: AffixStatus.Incorrect, text: letter });

      stack.wordLetters.incorrect[letter] = stack.wordLetters.incorrect[letter] ? stack.wordLetters.incorrect[letter] + 1 : 1;
    }

    const isLast = index + 1 === length;

    if (isLast && stack.current?.type) {
      stack.affixes.push(stack.current);
    }

    return stack;
  }, {
    affixes: [],
    wordLetters: {
      correct: {},
      incorrect: {},
      position: {},
    },
    current: { type: AffixStatus.Unknown, text: '' },
  });

  return { affixes, wordLetters };
};

export type WordReport = {
  isError: boolean,
  type?: string,
  isWon: boolean,
  word: string,
  affixes?: Affix[],
  wordLetters?: UsedLettersByType,
  flatAffixes?: FlatAffixes,
};

const getFlatAffixes = (affixes: Affix[]) => {
  const flatAffixes: FlatAffixes = {
    start: '',
    notStart: [],
    middle: [],
    correctOrders: [],
    notCorrectOrders: [],
    notEnd: [],
    end: '',
    needsALetterBetween: [],
  };

  if (affixes.length === 0) {
    return flatAffixes;
  }

  const firstAffix = affixes[0];
  const lastAffix = affixes[affixes.length - 1];

  if (firstAffix.type === AffixStatus.Correct && firstAffix.isStart) {
    flatAffixes.start = firstAffix.text;
  } else if (!firstAffix.isStart) {
    flatAffixes.notStart.push(firstAffix.text[0]);
  }

  if (lastAffix.type === AffixStatus.Correct && lastAffix.isEnd) {
    flatAffixes.end = lastAffix.text;
  } else if (!lastAffix.isEnd) {
    flatAffixes.notEnd.push(lastAffix.text[lastAffix.text.length - 1]);
  }

  flatAffixes.middle = affixes.filter(affix => affix.type === AffixStatus.Correct
    && affix.isStart !== true
    && affix.isEnd !== true
    && affix.text.length > 1).map(affix => affix.text);

  const order = affixes.filter(affix => affix.type === AffixStatus.Correct).map(({ text }) => text);
  if (order.length >= 2) {
    flatAffixes.correctOrders = [order];
  }

  const hasWrongPosition = affixes.some(affix => affix.type === AffixStatus.Position);
  if (hasWrongPosition) {
    const notCorrectOrder = affixes.filter(
      affix => [AffixStatus.Position, AffixStatus.Correct].includes(affix.type),
    ).map(({ text }) => text);
    if (notCorrectOrder.length >= 2) {
      flatAffixes.notCorrectOrders = [notCorrectOrder];
    }
  }

  const needsALetterBetween = affixes.reduce((stack: string[][], affix, index) => {
    if (index > 0) {
      if (affix.type === AffixStatus.Correct) {
        const previousAffix = affixes[index - 1];
        if (previousAffix.type === AffixStatus.Correct) {
          stack.push([previousAffix.text, affix.text]);
        }
      }
    }

    return stack;
  }, []);

  flatAffixes.needsALetterBetween = needsALetterBetween;

  return flatAffixes;
};

const getAffixesWithErrorMarkersForIncorrect = ({ affixes, wordIndex, wordsLetters }: {
  affixes: Affix[],
  wordIndex?: number,
  wordsLetters?: UsedLettersByType,
}) => {
  if (typeof wordIndex !== 'number' || !wordsLetters) {
    return affixes;
  }

  return affixes.map((affix) => {
    if (affix.type !== AffixStatus.Incorrect) {
      return affix;
    }

    const hasLetterConfirmedAsIncorrect = typeof wordsLetters.incorrect[affix.text] === 'number';

    if (hasLetterConfirmedAsIncorrect && wordIndex > wordsLetters.incorrect[affix.text]) {
      affix.subtype = 'typed-incorrect';
    }

    return affix;
  });
};

export const getWordReport = async (
  wordToGuess: string,
  wordToSubmit: string,
  {
    lang,
    wordIndex,
    wordsLetters,
    shouldCheckIfExist = true,
  }: {
    lang: string,
    wordIndex?: number,
    wordsLetters?: UsedLettersByType,
    shouldCheckIfExist?: boolean
  },
) => {
  if (shouldCheckIfExist) {
    const doesWordExistReport = await getDoesWordExist(wordToSubmit, lang);

    if (doesWordExistReport.isError) {
      if (doesWordExistReport.errorType === DoesWordExistErrorTypes.Fetch) {
        return {
          isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_FETCH_ERROR,
        };
      }

      // Too short the same massage as
      return {
        isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_DOES_NOT_EXIST,
      };
    }

    if (!doesWordExistReport.doesWordExist) {
      return {
        isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_DOES_NOT_EXIST,
      };
    }
  }

  const result = compareWords(wordToGuess, wordToSubmit);

  const { pattern, start, end } = result;

  const { affixes, wordLetters } = temporaryTranslatorPatterns(wordToSubmit, pattern);

  if (typeof wordIndex === 'number') {
    // It replaces incorrect value with index of the word when it occured it is adjust
    wordLetters.incorrect = Object.keys(wordLetters.incorrect).reduce((stack: UsedLetters, letter) => {
      stack[letter] = wordIndex;

      return stack;
    }, {});
  }

  if (start) {
    affixes[0].isStart = true;
  }

  if (end) {
    affixes[affixes.length - 1].isEnd = true;
  }

  const affixesWithSubtypes = getAffixesWithErrorMarkersForIncorrect({ affixes, wordIndex, wordsLetters });

  const flatAffixes = getFlatAffixes(affixes);

  const isWon = wordToSubmit === wordToGuess;

  return {
    isError: false, isWon, word: wordToSubmit, result, affixes: affixesWithSubtypes, wordLetters, flatAffixes,
  };
};

export default getWordReport;

export const getWordReportForMultipleWords = async (
  wordToGuess: string,
  wordsToSubmit: string[],
  { lang, shouldCheckIfExist = true }: { lang: string, shouldCheckIfExist?: boolean },
) => {
  const response: {
    hasError: boolean,
    isWon: boolean,
    results: WordReport[],
    wordsLetters: UsedLettersByType,
    flatAffixes: FlatAffixes,
  } = {
    hasError: false,
    isWon: false,
    results: [],
    wordsLetters: {
      correct: {},
      incorrect: {},
      position: {},
    },
    flatAffixes: {
      start: '',
      notStart: [],
      middle: [],
      correctOrders: [],
      notCorrectOrders: [],
      notEnd: [],
      end: '',
      needsALetterBetween: [],
    },
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const [wordIndex, wordToSubmit] of wordsToSubmit.entries()) {
    // eslint-disable-next-line no-await-in-loop
    const wordReport = await getWordReport(
      wordToGuess,
      wordToSubmit,
      {
        wordIndex, lang, wordsLetters: response.wordsLetters, shouldCheckIfExist,
      },
    );

    response.results.push(wordReport);

    response.wordsLetters.correct = mergeLettersData(response.wordsLetters.correct, wordReport?.wordLetters?.correct);
    response.wordsLetters.incorrect = mergeLettersData(
      response.wordsLetters.incorrect,
      wordReport?.wordLetters?.incorrect,
      { isIncorrect: true },
    );
    response.wordsLetters.position = mergeLettersData(response.wordsLetters.position, wordReport?.wordLetters?.position);

    const flatAffixes = getFlatAffixes(wordReport?.affixes || []);

    response.flatAffixes = mergeFlatAffixes(response.flatAffixes, flatAffixes);
  }

  response.hasError = response.results.some(({ isError }) => isError === true);
  response.isWon = response.results.some(({ isWon }) => isWon === true);

  return response;
};
