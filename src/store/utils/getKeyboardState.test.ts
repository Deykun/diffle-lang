import { describe, expect, it } from '@jest/globals';

// import { AffixStatus } from '@common-types';

import { getKeyboardState } from './getKeyboardState';

describe('getKeyboardState', () => {
  describe('getKeyboardState', () => {
    it('should embed date inside number', () => {
      expect(getKeyboardState({
        wordToGuess: 'start',
        wordToSubmit: 'start',
        incorrectLetters: {},
        positionLetters: {},
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
      })).toBe({
        status: '',
      });
    });
  });
});
