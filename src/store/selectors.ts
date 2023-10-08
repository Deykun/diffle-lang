import { createSelector } from '@reduxjs/toolkit';

import { POLISH_CHARACTERS, ALLOWED_LETTERS } from '@const';

import { RootState, AffixStatus } from '@common-types';

import { normilzeWord } from '@utils/normilzeWord';

export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

export const selectHasWordToGuessSpecialCharacters = createSelector(
    selectWordToGuess,
    wordToGuess => wordToGuess !== normilzeWord(wordToGuess),
);

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

export const selectKeyboardState = createSelector(
    selectWordToGuess,
    selectWordToSubmit,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToGuess, wordToSubmit, correctLetters, incorrectLetter, positionLetters) => {
        if (!wordToSubmit || !wordToSubmit.replaceAll(' ', '')) {
            return AffixStatus.Unknown;
        }

        const uniqueWordLetters = [...(new Set(wordToSubmit.split('')))];

        const hasIncorrectLetterTyped = uniqueWordLetters.some((uniqueLetter) => {
            const isIncorrect = incorrectLetter[uniqueLetter] === true;
            if (!isIncorrect) {
                return false;
            }

            const isNotCorrectInOtherContexts = correctLetters[uniqueLetter] !== true && positionLetters[uniqueLetter] !== true;

            return isNotCorrectInOtherContexts;
        });

        if (hasIncorrectLetterTyped) {
            return  AffixStatus.Incorrect;
        }

        const hasWordToGuessPolishCharacters = wordToGuess && wordToGuess !== normilzeWord(wordToGuess);
        const hasWordToSubmitPolishCharacters = wordToSubmit && wordToSubmit !== normilzeWord(wordToSubmit);
        const polishCharacterTypedWhenNotNeeded = !hasWordToGuessPolishCharacters && hasWordToSubmitPolishCharacters;
        if (polishCharacterTypedWhenNotNeeded) {
            return  AffixStatus.Incorrect;
        }

        const uniqueCorrectAndPositionLetters = [...new Set([...Object.keys(correctLetters), ...Object.keys(positionLetters)])];
        const allKnownLettersAreTyped = uniqueCorrectAndPositionLetters.every((letter) => wordToSubmit.includes(letter));
        if (allKnownLettersAreTyped) {
            return AffixStatus.Correct;
        }

        // Infact if not all know letter are typed we know that the word is incorrect, but we don't show it up
        return AffixStatus.Unknown;
    },
);

export const selectKeyboardUsagePercentage = createSelector(
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (correctLetters, incorrectLetter, positionLetters) => {
        const totalNumberOfLetters = ALLOWED_LETTERS.length;

        const usedLetters = [...new Set([...Object.keys(correctLetters), ...Object.keys(incorrectLetter), ...Object.keys(positionLetters)])];
        const totalNumberOfUsedLetters = usedLetters.length;

        return Math.round(totalNumberOfUsedLetters / totalNumberOfLetters * 100);
    },
);