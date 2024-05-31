import { AffixStatus, FlatAffixes, UsedLetters } from '@common-types';

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
    stack.restString = rest.join('');

    return stack;
  }, {
    restString: text,
    isMatching: true,
  });

  return isMatching;
};

export const getKeyboardState = ({
  wordToGuess,
  wordToSubmit,
  incorrectLetter,
  positionLetters,
  flatAffixes,
}: {
  wordToGuess: string,
  wordToSubmit: string,
  incorrectLetter: UsedLetters,
  positionLetters: UsedLetters,
  flatAffixes: FlatAffixes,
}) => {
  if (!wordToSubmit || !wordToSubmit.replaceAll(' ', '')) {
    return {
      status: AffixStatus.Unknown,
    };
  }

  const uniqueWordLetters = [...(new Set(wordToSubmit.split('')))].filter(letter => letter !== ' ');

  const incorrectTyppedLetters = uniqueWordLetters.filter((uniqueLetter) => {
    const isIncorrect = incorrectLetter[uniqueLetter] > 0;
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
    };
  }

  // TODO: add info at the end if no special letter typed
  const hasWordToGuessSpecialCharacters = wordToGuess && getHasSpecialCharacters(wordToGuess);
  const hasWordToSubmitSpecialCharacters = wordToSubmit && getHasSpecialCharacters(wordToSubmit);
  const specialCharacterTypedWhenNotNeeded = !hasWordToGuessSpecialCharacters && hasWordToSubmitSpecialCharacters;
  if (specialCharacterTypedWhenNotNeeded) {
    return {
      status: AffixStatus.Incorrect,
      details: [], // TODO: add special
    };
  }

  const uniqueRequiredLetters = Object.keys(positionLetters);
  const allKnownLettersAreTyped = uniqueRequiredLetters.every((uniqueLetter) => {
    const occurrencesOfLetterInSubmitWord = getLetterOccuranceInWord(uniqueLetter, wordToSubmit);

    return occurrencesOfLetterInSubmitWord >= positionLetters[uniqueLetter];
  });

  if (allKnownLettersAreTyped) {
    if (flatAffixes) {
      const isWrongStart = !wordToSubmit.startsWith(flatAffixes.start);
      if (isWrongStart) {
        return {
          status: AffixStatus.IncorrectStart,
          details: flatAffixes.start,
        };
      }

      if (flatAffixes.notStart.includes(wordToSubmit[0])) {
        return {
          status: AffixStatus.IncorrectStart,
          details: wordToSubmit[0],
        };
      }

      const isWrongEnd = !wordToSubmit.endsWith(flatAffixes.end);
      if (isWrongEnd) {
        return {
          status: AffixStatus.IncorrectEnd,
          details: flatAffixes.end,
        };
      }

      if (flatAffixes.notEnd.includes(wordToSubmit[wordToSubmit.length - 1])) {
        return {
          status: AffixStatus.IncorrectEnd,
          details: wordToSubmit[wordToSubmit.length - 1],
        };
      }

      const wrongMiddles = flatAffixes.middle.filter(flatAffix => !wordToSubmit.includes(flatAffix));
      const isWrongMiddle = wrongMiddles.length > 0;
      if (isWrongMiddle) {
        return {
          status: AffixStatus.IncorrectMiddle,
          details: wrongMiddles.join(', '),
        };
      }

      if (flatAffixes.correctOrders.length > 0) {
        const wrongOrders = flatAffixes.correctOrders.filter(order => !getIsTextMatchingOrder(wordToSubmit, order));
        const isWrongOrder = wrongOrders.length > 0;
        if (isWrongOrder) {
          return {
            status: AffixStatus.IncorrectOrder,
            details: wrongOrders.join(', '),
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
