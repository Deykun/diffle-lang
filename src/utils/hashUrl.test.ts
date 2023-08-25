import { describe, expect, it } from '@jest/globals';

import { AffixStatus } from '@common-types';

import { hashUrlParams } from './hashUrl';

describe('hashUrl', () => {
    it('wordToGuess = "" returns empty params', () => {
        expect(hashUrlParams({
            wordToGuess: '', guesses: [],
        })).toEqual({
            wordToGuess: '', guesses: '',
        });
    });

    it('wordToGuess = "" returns an empty param for guesses (because it is pointless)', () => {
        expect(hashUrlParams({
            wordToGuess: '', guesses: [{
                word: 'słówko',
                affixes: [
                    { type: AffixStatus.Incorrect, text: 'słówk '},
                    { type: AffixStatus.Correct, text: 'o' },
                ],
            }],
        })).toEqual({
            wordToGuess: '', guesses: '',
        });
    });
});
