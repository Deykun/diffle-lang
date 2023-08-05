import { createSelector } from '@reduxjs/toolkit';

import { RootState, AffixStatus } from '@common-types';


export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

const selectCorrectLetters = (state: RootState) => state.game.letters.correct;
const selectIncorrectLetters = (state: RootState) => state.game.letters.incorrect;
const selectPositionLetters = (state: RootState) => state.game.letters.position;

export const selectLetterState = (letter: string) => createSelector(
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (correctLetters, incorrectLetter, positionLetters) => {
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
