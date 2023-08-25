import { createSelector } from '@reduxjs/toolkit';

import { POLISH_CHARACTERS } from '@const';

import { RootState, AffixStatus } from '@common-types';

import { normilzeWord } from '@utils/normilzeWord';

export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

const selectCorrectLetters = (state: RootState) => state.game.letters.correct;
const selectIncorrectLetters = (state: RootState) => state.game.letters.incorrect;
const selectPositionLetters = (state: RootState) => state.game.letters.position;

export const selectLetterState = (letter: string) => createSelector(
    selectWordToGuess,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToGuess, correctLetters, incorrectLetter, positionLetters) => {
        const isPolishCharacter = POLISH_CHARACTERS.includes(letter);
        if (isPolishCharacter) {
            const hasPolishCharacters = wordToGuess && wordToGuess !== normilzeWord(wordToGuess);

            if (!hasPolishCharacters) {
                // All special characters are marked as incorrect if word to guess dosen't have one
                return AffixStatus.Incorrect;
            }
        }

        if (correctLetters[letter]) {
            return AffixStatus.Correct;
        }

        if (positionLetters[letter]) {
            return AffixStatus.Position;
        }

        if (incorrectLetter[letter]) {
            return AffixStatus.Incorrect;
        }

        return AffixStatus.Unknown;
    },
);
