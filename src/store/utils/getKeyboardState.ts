import { AffixStatus, WordStatus, FlatAffixes, UsedLetters } from '@common-types';

import { getHasSpecialCharacters } from '@utils/normilzeWord';

import { getLetterOccuranceInWord } from './getLetterOccuranceInWord';

const getIsTextMatchingOrder = (text: string, order: string[]) => {
  const {
    isMatching,
  } = order.reduce((stack, subtext) => {
    if (!stack.restString.includes(subtext)) {
      return {
        restString: '',
        isMatching: false,
      };
    }

    const [, ...rest] = stack.restString.split(subtext);
    stack.restString = rest.join(subtext);

    return stack;
  }, {
    restString: text,
    isMatching: true,
  });

  return isMatching;
};

const PADDING_CHARACTER = '–';

export const getKeyboardState = ({
  wordToGuess,
  wordToSubmit,
  incorrectLetters,
  positionLetters,
  flatAffixes,
}: {
  wordToGuess: string,
  wordToSubmit: string,
  incorrectLetters: UsedLetters,
  positionLetters: UsedLetters,
  flatAffixes: FlatAffixes,
}): {
  status: AffixStatus | WordStatus,
  details?: string,
  detailsStatus?: 'expected' | 'unexpected',
} => {
  if (!wordToSubmit || !wordToSubmit.replaceAll(' ', '')) {
    return {
      status: AffixStatus.Unknown,
    };
  }

  const uniqueWordLetters = [...(new Set(wordToSubmit.split('')))].filter(letter => letter !== ' ');

  const incorrectTyppedLetters = uniqueWordLetters.filter((uniqueLetter) => {
    const isIncorrect = typeof incorrectLetters[uniqueLetter] === 'number';
    if (!isIncorrect) {
      return false;
    }

    const isCorrectSometimes = positionLetters[uniqueLetter] > 0;
    if (isCorrectSometimes) {
      const occurrencesOfLetterInSubmitWord = getLetterOccuranceInWord(uniqueLetter, wordToSubmit);

      return occurrencesOfLetterInSubmitWord > positionLetters[uniqueLetter];
    }

    return true;
  });

  const hasIncorrectLetterTyped = incorrectTyppedLetters.length > 0;
  if (hasIncorrectLetterTyped) {
    return {
      status: AffixStatus.Incorrect,
      details: incorrectTyppedLetters.join(', '),
      detailsStatus: 'unexpected',
    };
  }

  const hasWordToGuessSpecialCharacters = wordToGuess && getHasSpecialCharacters(wordToGuess);
  const hasWordToSubmitSpecialCharacters = wordToSubmit && getHasSpecialCharacters(wordToSubmit);
  const specialCharacterTypedWhenNotNeeded = !hasWordToGuessSpecialCharacters && hasWordToSubmitSpecialCharacters;
  if (specialCharacterTypedWhenNotNeeded) {
    const uniqueSpecialCharactersTyped = [...new Set(wordToSubmit.split('').filter(letter => getHasSpecialCharacters(letter)))];

    return {
      status: AffixStatus.Incorrect,
      details: uniqueSpecialCharactersTyped.join(', '),
      detailsStatus: 'unexpected',
    };
  }

  if (flatAffixes) {
    const isWrongStart = !wordToSubmit.startsWith(flatAffixes.start.slice(0, wordToSubmit.length));
    if (isWrongStart) {
      return {
        status: AffixStatus.IncorrectStart,
        details: `${flatAffixes.start}${PADDING_CHARACTER}`,
        detailsStatus: 'expected',
      };
    }

    if (flatAffixes.notStart.includes(wordToSubmit[0])) {
      return {
        status: AffixStatus.IncorrectStart,
        details: `${wordToSubmit[0]}${PADDING_CHARACTER}`,
        detailsStatus: 'unexpected',
      };
    }
  }

  const uniqueRequiredLetters = Object.keys(positionLetters);

  const { missingRequiredLetters, totalPresent, totalRequired } = uniqueRequiredLetters.reduce((
    stack: {
      totalPresent: number,
      totalRequired: number,
      missingRequiredLetters: {
        [letter: string]: number,
      }
    },
    uniqueLetter,
  ) => {
    const occurrencesOfLetterInSubmitWord = getLetterOccuranceInWord(uniqueLetter, wordToSubmit);

    const missingLettersTotal = positionLetters[uniqueLetter] <= occurrencesOfLetterInSubmitWord
      ? 0
      : Math.min(positionLetters[uniqueLetter], positionLetters[uniqueLetter] - occurrencesOfLetterInSubmitWord);

    stack.totalPresent += positionLetters[uniqueLetter] - missingLettersTotal;
    stack.totalRequired += positionLetters[uniqueLetter];

    stack.missingRequiredLetters[uniqueLetter] = missingLettersTotal;

    return stack;
  }, { missingRequiredLetters: {}, totalPresent: 0, totalRequired: 0 });

  const areAllRequiredUsed = totalRequired > 0 && totalRequired === totalPresent;
  const isMissingSomeRequiredLetters = totalRequired > totalPresent;

  if (isMissingSomeRequiredLetters) {
    const hasManyRequiredAndSomeMissing = (totalRequired >= 5 && (totalRequired - totalPresent) <= 2)
      || (totalRequired >= 7 && (totalRequired - totalPresent) <= 3);

    if (hasManyRequiredAndSomeMissing) {
      const missingLetters = Object.entries(missingRequiredLetters).filter(([, value]) => value > 0).map(([letter]) => letter);

      return {
        status: WordStatus.IncorrectOccuranceMissing,
        details: missingLetters.join(', '),
        detailsStatus: 'expected',
      };
    }
  } else if (areAllRequiredUsed) {
    if (flatAffixes) {
      const isWrongEnd = !wordToSubmit.endsWith(flatAffixes.end);
      if (isWrongEnd) {
        return {
          status: AffixStatus.IncorrectEnd,
          details: `${PADDING_CHARACTER}${flatAffixes.end}`,
          detailsStatus: 'expected',
        };
      }

      if (flatAffixes.notEnd.includes(wordToSubmit[wordToSubmit.length - 1])) {
        return {
          status: AffixStatus.IncorrectEnd,
          details: `${PADDING_CHARACTER}${wordToSubmit[wordToSubmit.length - 1]}`,
          detailsStatus: 'unexpected',
        };
      }

      const wrongMiddles = flatAffixes.middle.filter(flatAffix => !wordToSubmit.includes(flatAffix));
      const isWrongMiddle = wrongMiddles.length > 0;
      if (isWrongMiddle) {
        return {
          status: AffixStatus.IncorrectMiddle,
          details: wrongMiddles.join(PADDING_CHARACTER),
        };
      }

      if (flatAffixes.correctOrders.length > 0) {
        const wrongOrders = flatAffixes.correctOrders.filter(order => !getIsTextMatchingOrder(wordToSubmit, order));
        const isWrongOrder = wrongOrders.length > 0;
        if (isWrongOrder) {
          return {
            status: AffixStatus.IncorrectOrder,
            details: wrongOrders.map(order => order.join(PADDING_CHARACTER)).join(', '),
            detailsStatus: 'expected',
          };
        }
      }

      if (flatAffixes.notCorrectOrders.length > 0) {
        const wrongOrders = flatAffixes.notCorrectOrders.filter(order => getIsTextMatchingOrder(wordToSubmit, order));
        const isWrongOrder = wrongOrders.length > 0;

        if (isWrongOrder) {
          return {
            status: AffixStatus.IncorrectOrder,
            details: wrongOrders.map(order => order.join(PADDING_CHARACTER)).join(', '),
            detailsStatus: 'unexpected',
          };
        }
      }

      if (flatAffixes.needsALetterBetween.length > 0) {
        const wrongPairs = flatAffixes.needsALetterBetween.filter(([first, second]) => {
          const regex = new RegExp(`${first}(.*)${second}`);

          const parts = wordToSubmit.match(regex) ?? [];

          return parts.length >= 2 && parts[1].length === 0
        });
        const isWrongPair = wrongPairs.length > 0;

        if (isWrongPair) {
          return {
            status: WordStatus.IncorrectPairWithLetterMissing,
            details: wrongPairs.map(pair => pair.join('')).join(', '),
            detailsStatus: 'unexpected',
          };
        }
      }
    }

    return {
      status: AffixStatus.Correct,
    };
  }

  // If not all known letters are typed, we know that the word is incorrect, but we don't display it.
  return {
    status: AffixStatus.Unknown,
  };
};
