import { describe, expect, it } from '@jest/globals';

// import { AffixStatus } from '@common-types';

import { getKeyboardState } from './getKeyboardState';

describe('getKeyboardState', () => {
  describe('getKeyboardState', () => {
    it('should embed date inside number', () => {
      expect(getKeyboardState({
        wordToGuess: 'start',
        wordToSubmit: 'start',
        incorrectLetter: {},
        positionLetters: {},
        flatAffixes: {
          start: '',
          notStart: [],
          middle: [],
          correctOrders: [],
          notEnd: [],
          end: '',
        },
      })).toBe({
        status: '',
      });
    });
  });
});
