import { createSelector } from '@reduxjs/toolkit';

import { POLISH_CHARACTERS, ALLOWED_LETTERS } from '@const';

import { RootState, AffixStatus, UsedLetters, GameStatus } from '@common-types';

import { getHasSpecialCharacters } from '@utils/normilzeWord';

export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

export const selectIsWon = (state: RootState) => state.game.status === GameStatus.Won;
export const selectIsLost = (state: RootState) => state.game.status === GameStatus.Lost;
export const selectIsGameEnded = (state: RootState) => state.game.status !== GameStatus.Guessing;

export const selectHasWordToGuessSpecialCharacters = createSelector(
    selectWordToGuess,
    wordToGuess => getHasSpecialCharacters(wordToGuess),
);

const selectCorrectLetters = (state: RootState) => state.game.letters.correct;
const selectIncorrectLetters = (state: RootState) => state.game.letters.incorrect;
const selectPositionLetters = (state: RootState) => state.game.letters.position;

export const selectGuesses = (state: RootState) => state.game.guesses;

const getLetterState = (
    letter: string,
    wordToGuess: string,
    correctLetters: UsedLetters,
    incorrectLetter: UsedLetters,
    positionLetters: UsedLetters,
) => {
    const isPolishCharacter = POLISH_CHARACTERS.includes(letter);
    if (isPolishCharacter) {
        const hasPolishCharacters = wordToGuess && getHasSpecialCharacters(wordToGuess);

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
}

export const selectLetterState = (letter: string) => createSelector(
    selectWordToGuess,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToGuess, correctLetters, incorrectLetter, positionLetters) => {
        return getLetterState(letter, wordToGuess, correctLetters, incorrectLetter, positionLetters);
    },
);

export const selectWordState = (word: string) => createSelector(
    selectWordToGuess,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToGuess, correctLetters, incorrectLetter, positionLetters) => {
        const uniqueLettersInWord = [...new Set(word.split(''))].filter(letter => ![' '].includes(letter));

        const hasIncorrectLetterTyped = uniqueLettersInWord.some(
            (letter) => getLetterState(letter, wordToGuess, correctLetters, incorrectLetter, positionLetters) === AffixStatus.Incorrect,
        );

        if (hasIncorrectLetterTyped) {
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

        const hasWordToGuessSpecialCharacters = wordToGuess && getHasSpecialCharacters(wordToGuess);
        const hasWordToSubmitSpecialCharacters = wordToSubmit && getHasSpecialCharacters(wordToSubmit);
        const polishCharacterTypedWhenNotNeeded = !hasWordToGuessSpecialCharacters && hasWordToSubmitSpecialCharacters;
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

interface AffixStackInterface {
    incorrectLetters: string[],
    subtotals: {
        correct: number,
        position: number,
        incorrect: number,
        typedKnownIncorrect: number,
    }
}

interface GuessesStackInterface extends AffixStackInterface {
    words: number,
}

export const selectGuessesStatsForLetters = createSelector(
    selectGuesses,
    selectHasWordToGuessSpecialCharacters,
    (guesses, hasWordToGuessSpecialCharacters) => {
        const { words, subtotals } = guesses.reduce((guessesStack: GuessesStackInterface, { affixes }) => {
            const { subtotals: wordTotals, incorrectLetters: wordIncorrectLetters } = affixes.reduce((affixesStack: AffixStackInterface, affix) => {
                if (affix.type === AffixStatus.Correct) {
                    affixesStack.subtotals.correct += affix.text.length;
                }

                if (affix.type === AffixStatus.Position) {
                    affixesStack.subtotals.position += affix.text.length;
                }

                if (affix.type === AffixStatus.Incorrect) {
                    // Incorrect affixes are always length = 1
                    affixesStack.subtotals.incorrect += 1;

                    /*
                        The letter can be either correct or incorrect; for example, if it exists in incorrectLetters,
                        that means the user knows it occurs only once. In the future, more logic can be implemented
                        to signal this better in code and to the end user.
                    */
                    const typedWhenWasKnownToBeIncorrect = guessesStack.incorrectLetters.includes(affix.text);
                    const isSpecialCharacterButWinningWordDonNotHaveThem = !hasWordToGuessSpecialCharacters && getHasSpecialCharacters(affix.text);

                    if (typedWhenWasKnownToBeIncorrect || isSpecialCharacterButWinningWordDonNotHaveThem) {
                        affixesStack.subtotals.typedKnownIncorrect += 1;
                    } else {
                        affixesStack.incorrectLetters = [...affixesStack.incorrectLetters, ...affix.text];
                    }
                }

                return affixesStack;
            }, {
                subtotals: {
                    correct: 0,
                    position: 0,
                    incorrect: 0,
                    typedKnownIncorrect: 0,
                },
                incorrectLetters: [],
            });

            guessesStack.words += 1;
            guessesStack.subtotals.correct += wordTotals.correct;
            guessesStack.subtotals.position += wordTotals.position;
            guessesStack.subtotals.incorrect += wordTotals.incorrect;
            guessesStack.subtotals.typedKnownIncorrect += wordTotals.typedKnownIncorrect;
            guessesStack.incorrectLetters = [...guessesStack.incorrectLetters, ...wordIncorrectLetters];

            return guessesStack;
        }, {
            words: 0,
            incorrectLetters: [],
            subtotals: {
                correct: 0,
                position: 0,
                incorrect: 0,
                typedKnownIncorrect: 0,
            }
        });

        return {
            words,
            letters: subtotals.correct + subtotals.position + subtotals.incorrect,
            subtotals,
        };
    },
);
