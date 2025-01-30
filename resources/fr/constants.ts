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
    popularity: {
        dir: 'FrequencyWords',
        shortName: 'FrequencyWords',
        fullName: 'FrequencyWords',
        url: 'https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/fr/fr_50k.txt',
    },
};

export const EASTER_EGG_DAYS = {
    '14.07': {
        type: 'public',
        specialMode: 'sandbox_live',
        emojis: [{
            correct: ['🌿', '🍾', '🐸'],
            position: ['⚜️', '🗼', '🥐', '🥖', '🧀', '🍞'],
            incorrect: ['🏰'],
            typedKnownIncorrect: ['🎀','🍷', '🐓'],
        }],
    },
};