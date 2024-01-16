export const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 4;

/*
    Very long words have multiple markers
    and it is usually come kind of "okrówkowanie"
    The game is nicer with this limit
*/
export const MAXIMUM_LENGTH_FOR_A_WINNING_WORD = 9;

export const MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD = 15;

export const INITAL_DICTIONARY_STATISTICS = {
    spellchecker: {
        all: 0,
        accepted: {
            all: 0,
            withSpecialCharacters: 0,
            withoutSpecialCharacters: 0,
        },
        rejected: 0,
        letters: {},
    },
    winning: {
        all: 0,
        accepted: {
            all: 0,
            withSpecialCharacters: 0,
            withoutSpecialCharacters: 0,
        },
        rejected: {
            all: 0,
            tooLong: 0,
            tooShort: 0,
            censored: 0,
            wrongLetters: 0,
            missingInSpellingDictionary: 0,
        },
        lettersNotAcceptedInWinningWord: [],
    },
};
