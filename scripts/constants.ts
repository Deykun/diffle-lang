export const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 4;

/*
    Very long words have multiple markers
    and it is usually come kind of "okrówkowanie"
    The game is nicer with this limit
*/
export const MAXIMUM_LENGTH_FOR_A_WINNING_WORD = 9;

export const MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD = 15;

export const MAXIMUM_LENGHT_FOR_A_WORD_IN_ABOUT_LANGUAGE = 20;

export const INITIAL_DICTIONARY_STATISTICS = {
    spellchecker: {
        all: 0,
        accepted: {
            allUsedInGame: 0,
            all: 0,
            allWordleWords: 0,
            withSpecialCharacters: 0,
            withoutSpecialCharacters: 0,
            length: {},
        },
        rejected: 0,
        letters: {
            first: {},
            last: {},
            common: {},
            inWordsWordle: {},
            wordle: {
                0: {},
                1: {},
                2: {},
                3: {},
                4: {},
            },
            inWords: {},
        },
        substrings: {
            first: { 2: {}, 3: {}, 4: {} },
            middle: { 2: {}, 3: {}, 4: {} },
            last: { 2: {}, 3: {}, 4: {} },
        },
        wordle: {
            inWords: {},
            letterPosition: {},
            uniqueLetterPosition: {},
        },
    },
    winning: {
        all: 0,
        accepted: {
            all: 0,
            withSpecialCharacters: 0,
            withoutSpecialCharacters: 0,
            length: {},
        },
        rejected: {
            all: 0,
            tooLong: 0,
            tooShort: 0,
            censored: 0,
            romanNumeral: 0,
            wrongLetters: 0,
            missingInSpellingDictionary: 0,
        },
        lettersNotAcceptedInWinningWord: [],
    },
};
