export const BLOCKED_WORDS = ['cazzo', 'cazzata', 'coglione', 'cornuto', 'fica', 'puttana', 'sborra', 'scopare', 'troia'];

export const BLOCKED_PARTS = ['fanculo'];

export const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = [];

export const DICTIONARIES = {
    nativeSpeakersFromWikipedia: 68_000_000,
    spellchecker: {
        dir: 'LibreItalia',
        shortName: 'LibreItalia',
        fullName: 'LibreItalia',
        url: 'https://www.libreitalia.org/',
    },
    spellcheckerAlt: {
        dir: 'FrequencyWords',
        shortName: 'FrequencyWords',
        fullName: 'FrequencyWords',
        url: 'https://github.com/hermitdave/FrequencyWords/',
    },
    winning: {
        dir: 'FreeDict',
        shortName: 'FreeDict',
        fullName: 'FreeDict',
        url: 'https://freedict.org/',
    },
    popularity: {
        dir: 'FrequencyWords',
        shortName: 'FrequencyWords',
        fullName: 'FrequencyWords',
        url: 'https://github.com/hermitdave/FrequencyWords/',
    },
};

export const EASTER_EGG_DAYS = {
    '25.04': {
        type: 'public',
        specialMode: 'sandbox_live',
        emojis: [{
            correct: ['🗽', '🌿', '🌿'],
            position: ['🍕', '🤌', '🏺'],
            incorrect: ['🍝', '🐚', '🕊️', '⚔️', '🏟️'],
            typedKnownIncorrect: ['🛵'],
        }],
    },
    '02.06': {
        type: 'public',
        specialMode: 'sandbox_live',
        emojis: [{
            correct: ['🌿'],
            position: ['🍕', '🤌', '🏺'],
            incorrect: ['🍝', '🐚', '🏛️', '⚔️', '🏟️'],
            typedKnownIncorrect: ['🛵'],
        }],
    },
};
