import { Affix, AffixStatus, FlatAffixes, UsedLetters } from '@common-types';

import { SUBMIT_ERRORS } from '@const';

import getDoesWordExist, { DoesWordExistErrorType } from '@api/getDoesWordExist';
import compareWords from '@api/utils/compareWords';
import { mergeFlatAffixes } from '@api/helpers';

import { mergeLettersData } from '@utils/statistics';

export interface PatternReport {
  affixes: Affix[],
  wordLetters: {
    correct: UsedLetters,
    incorrect: UsedLetters,
    position: UsedLetters,
  },
  current?: Affix
}

export const temporaryTranslatorPatterns = (word: string, pattern: number[]): PatternReport => {
  const letters = Array.from(word);
  const { length } = pattern;

  const { affixes, wordLetters } = pattern.reduce((stack: PatternReport, value: number, index: number) => {
    const letter = letters[index];
    const { type, text } = stack.current || {};

    const shouldClose = value < 3;

    if (shouldClose) {
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

export interface WordReport {
  isError: boolean,
  type?: string,
  isWon: boolean,
  word: string,
  affixes?: Affix[],
  wordLetters?: {
    correct: UsedLetters,
    incorrect: UsedLetters,
    position: UsedLetters,
  },
  flatAffixes?: FlatAffixes,
}

const getFlatAffixes = (affixes: Affix[]) => {
  const flatAffixes: FlatAffixes = {
    start: '',
    middle: [],
    end: '',
  };

  if (affixes.at(0)?.type === AffixStatus.Correct && affixes.at(0)?.isStart) {
    flatAffixes.start = affixes.at(0)?.text || '';
  }

  if (affixes.at(-1)?.type === AffixStatus.Correct && affixes.at(-1)?.isEnd) {
    flatAffixes.end = affixes.at(-1)?.text || '';
  }

  console.log('affixes', affixes);

  flatAffixes.middle = affixes.filter(affix => affix.type === AffixStatus.Correct
    && affix.isStart !== true
    && affix.isEnd !== true
    && affix.text.length > 1).map(affix => affix.text);

  return flatAffixes;
};

export const getWordReport = async (
  wordToGuess: string,
  wordToSubmit: string,
  { lang, shouldCheckIfExist = true }: { lang: string, shouldCheckIfExist?: boolean },
) => {
  if (shouldCheckIfExist) {
    const doesWordExistReport = await getDoesWordExist(wordToSubmit, lang);

    if (doesWordExistReport.isError) {
      if (doesWordExistReport.errorType === DoesWordExistErrorType.Fetch) {
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

  const flatAffixes = getFlatAffixes(affixes);

  if (start) {
    affixes[0].isStart = true;
  }

  if (end) {
    affixes[affixes.length - 1].isEnd = true;
  }

  const isWon = wordToSubmit === wordToGuess;

  return {
    isError: false, isWon, word: wordToSubmit, result, affixes, wordLetters, flatAffixes,
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
    wordsLetters: {
      correct: UsedLetters,
      incorrect: UsedLetters,
      position: UsedLetters,
    },
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
      middle: [],
      end: '',
    },
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const wordToSubmit of wordsToSubmit) {
    // eslint-disable-next-line no-await-in-loop
    const wordReport = await getWordReport(wordToGuess, wordToSubmit, { lang, shouldCheckIfExist });

    response.results.push(wordReport);

    response.wordsLetters.correct = mergeLettersData(response.wordsLetters.correct, wordReport?.wordLetters?.correct);
    response.wordsLetters.incorrect = mergeLettersData(response.wordsLetters.incorrect, wordReport?.wordLetters?.incorrect);
    response.wordsLetters.position = mergeLettersData(response.wordsLetters.position, wordReport?.wordLetters?.position);

    const flatAffixes = getFlatAffixes(wordReport?.affixes || []);

    response.flatAffixes = mergeFlatAffixes(response.flatAffixes, flatAffixes);
  }

  console.log('response.flatAffixes', response.flatAffixes);

  response.hasError = response.results.some(({ isError }) => isError === true);
  response.isWon = response.results.some(({ isWon }) => isWon === true);

  return response;
};
