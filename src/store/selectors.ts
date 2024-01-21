import { createSelector } from '@reduxjs/toolkit';

import {
    RootState,
    Dictionary,
    Word as WordInterface,
    AffixStatus,
    UsedLetters,
    GameStatus,
    LetterReportStatus,
    LetterSubreport,
} from '@common-types';

import { SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { getHasSpecialCharacters } from '@utils/normilzeWord';

export const selectIsProcessing = (state: RootState) => state.game.isProcessing;
export const selectWordToGuess = (state: RootState) => state.game.wordToGuess;
export const selectWordToSubmit = (state: RootState) => state.game.wordToSubmit;

export const selectIsWon = (state: RootState) => state.game.status === GameStatus.Won;
export const selectIsLost = (state: RootState) => state.game.status === GameStatus.Lost;
export const selectIsGameEnded = (state: RootState) => state.game.status !== GameStatus.Guessing;

export const selectGameLanguageKeyboardInfo =  createSelector(
    (state: RootState) => state.game.language,
    (state: RootState) => state.app.isEnterSwapped,
    (gameLanguage, isEnterSwapped): Dictionary => {
        if (!gameLanguage || !SUPPORTED_DICTIONARY_BY_LANG[gameLanguage]) {
            return {
                code: undefined,
                title: '',
                languages: [],
                keyLines: [],
                allowedKeys: [],
                characters: [],
                specialCharacters: [],
                hasSpecialCharacters: false,
                urls: [],
                shareMarker: '',
            };
        }
        const {
            keyLines,
            ...dictionary
        } = SUPPORTED_DICTIONARY_BY_LANG[gameLanguage];
        
        return {
            ...dictionary,
            keyLines: !isEnterSwapped ? keyLines : keyLines.map((line) => line.map((keyText) => {
                if (keyText === 'enter') {
                    return 'backspace';
                }
        
                if (keyText === 'backspace') {
                    return 'enter';
                }
        
                return keyText;
            }))
        };
    }
);

export const selectHasWordToGuessSpecialCharacters = createSelector(
    selectWordToGuess,
    wordToGuess => getHasSpecialCharacters(wordToGuess),
);

const selectCorrectLetters = (state: RootState) => state.game.letters.correct;
const selectIncorrectLetters = (state: RootState) => state.game.letters.incorrect;
const selectPositionLetters = (state: RootState) => state.game.letters.position;

export const selectGuesses = (state: RootState) => state.game.guesses;

// hello -> 2
// https://stackoverflow.com/a/72347965/6743808 - claims is the fastest
const getLetterOccuranceInWord = (letter: string, word: string) => word.length - word.replaceAll(letter, '').length;

const getLetterState = (
    letter: string,
    wordToSubmit: string,
    wordToGuess: string,
    correctLetters: UsedLetters,
    incorrectLetter: UsedLetters,
    positionLetters: UsedLetters,
    specialCharacters: string[],
) => {
    const isSpecialCharacter = specialCharacters.includes(letter);

    if (isSpecialCharacter) {
        const hasWordToGuessSpecialCharacter = wordToGuess && getHasSpecialCharacters(wordToGuess);

        if (!hasWordToGuessSpecialCharacter) {
            // All special characters are marked as incorrect if word to guess dosen't have one
            return AffixStatus.Incorrect;
        }
    }

    if (incorrectLetter[letter]) {
        const isCorrectSometimes = positionLetters[letter] > 0;
        if (isCorrectSometimes) {
            const occurrencesOfLetterInSubmitedWord = getLetterOccuranceInWord(letter, wordToSubmit);

            const isCorrectSometimesButHereNumberOfOccuranceIsTooHigh = occurrencesOfLetterInSubmitedWord > positionLetters[letter];

            if (isCorrectSometimesButHereNumberOfOccuranceIsTooHigh) {
                return AffixStatus.IncorrectOccurance;
            }
        } else {
            return AffixStatus.Incorrect;
        }
    }

    if (correctLetters[letter]) {
        return AffixStatus.Correct;
    }

    if (positionLetters[letter]) {
        return AffixStatus.Position;
    }

    return AffixStatus.Unknown;
}

export const selectLetterState = (letter: string) => createSelector(
    selectWordToSubmit,
    selectWordToGuess,
    selectGameLanguageKeyboardInfo,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToSubmit, wordToGuess, { specialCharacters }, correctLetters, incorrectLetter, positionLetters) => {
        return getLetterState(letter,wordToSubmit,  wordToGuess, correctLetters, incorrectLetter, positionLetters, specialCharacters);
    },
);

export const selectLetterSubreport = (letter: string) => createSelector(
    selectWordToSubmit,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToSubmit, incorrectLetter, positionLetters): LetterSubreport => {
        const isLimitKnown = Boolean(incorrectLetter[letter]);
        const confirmedOccurrence = positionLetters[letter] ?? 0;

        if (confirmedOccurrence <= 1) {
            return {
                status: LetterReportStatus.Ignored,
            }
        }

        const typedOccurrence = getLetterOccuranceInWord(letter, wordToSubmit);

        let status = LetterReportStatus.Correct;
    
        const wasLimitPassed = isLimitKnown && typedOccurrence > confirmedOccurrence;
        if (wasLimitPassed) {
            status = LetterReportStatus.TooManyLetters
        }

        const wasLimitNotMet = typedOccurrence < confirmedOccurrence;
        if (wasLimitNotMet) {
            status = LetterReportStatus.NotEnoughLetters
        }

        return {
            status,
            isLimitKnown,
            typedOccurrence,
            confirmedOccurrence, 
        };
    }
)

export const selectWordState = (word: string) => createSelector(
    selectWordToSubmit,
    selectWordToGuess,
    selectGameLanguageKeyboardInfo,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    (wordToSubmit, wordToGuess, { specialCharacters }, correctLetters, incorrectLetter, positionLetters) => {
        const uniqueLettersInWord = [...new Set(word.split(''))].filter(letter => ![' '].includes(letter));

        const hasIncorrectLetterTyped = uniqueLettersInWord.some(
            (letter) => getLetterState(letter, wordToSubmit, wordToGuess, correctLetters, incorrectLetter, positionLetters, specialCharacters) === AffixStatus.Incorrect,
        );

        if (hasIncorrectLetterTyped) {
            return AffixStatus.Incorrect;
        }

        const hasTypedTooMuch = uniqueLettersInWord.some(
            (letter) => getLetterState(letter, wordToSubmit, wordToGuess, correctLetters, incorrectLetter, positionLetters, specialCharacters) === AffixStatus.IncorrectOccurance,
        );

        if (hasTypedTooMuch) {
            return AffixStatus.IncorrectOccurance;
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

        const uniqueWordLetters = [...(new Set(wordToSubmit.split('')))].filter(letter => letter !== ' ');

        const hasIncorrectLetterTyped = uniqueWordLetters.some((uniqueLetter) => {
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

        if (hasIncorrectLetterTyped) {
            return  AffixStatus.Incorrect;
        }

        const hasWordToGuessSpecialCharacters = wordToGuess && getHasSpecialCharacters(wordToGuess);
        const hasWordToSubmitSpecialCharacters = wordToSubmit && getHasSpecialCharacters(wordToSubmit);
        const specialCharacterTypedWhenNotNeeded = !hasWordToGuessSpecialCharacters && hasWordToSubmitSpecialCharacters;
        if (specialCharacterTypedWhenNotNeeded) {
            return  AffixStatus.Incorrect;
        }

        const uniqueCorrectAndPositionLetters = [...new Set([...Object.keys(correctLetters), ...Object.keys(positionLetters)])];
        const allKnownLettersAreTyped = uniqueCorrectAndPositionLetters.every((letter) => wordToSubmit.includes(letter));
        if (allKnownLettersAreTyped) {
            return AffixStatus.Correct;
        }

        // If not all known letters are typed, we know that the word is incorrect, but we don't display it.
        return AffixStatus.Unknown;
    },
);

export const selectKeyboardUsagePercentage = createSelector(
    selectGameLanguageKeyboardInfo,
    selectCorrectLetters,
    selectIncorrectLetters,
    selectPositionLetters,
    ({ characters }, correctLetters, incorrectLetter, positionLetters) => {
        const totalNumberOfLetters = characters.length;

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

export const getWordsAndLetters = (guesses: WordInterface[], hasWordToGuessSpecialCharacters: boolean) => {
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
};

export const selectGuessesStatsForLetters = createSelector(
    selectGuesses,
    selectHasWordToGuessSpecialCharacters,
    getWordsAndLetters,
);
