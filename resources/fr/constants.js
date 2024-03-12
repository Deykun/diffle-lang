export const BLOCKED_WORDS = [];

export const BLOCKED_PARTS = [];

export const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = ['ù', 'ü', 'œ'];

export const DICTIONARIES = {
    nativeSpeakersFromWikipedia: 310_000_000,
    spellchecker: {
        dir: 'Grammalecte',
        shortName: 'Grammalecte',
        fullName: 'Grammalecte',
        url: 'https://grammalecte.net/',
    },
    winning: {
        dir: 'FreeDict',
        shortName: 'FreeDict',
        fullName: 'FreeDict',
        comments: [
            'fra-deu-2023.05.29',
            'fra-ita-2023.05.29'
        ],
        url: 'https://freedict.org/',
    },
    winningAlt: {
        dir: 'Lexique',
        shortName: 'Lexique',
        fullName: 'Lexique',
        comments: [
            '3.83',
        ],
        url: 'http://www.lexique.org/',
    },
};
