export const BLOCKED_WORDS = [];

export const BLOCKED_PARTS = [];

export const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = [];

export const DICTIONARIES = {
    nativeSpeakersFromWikipedia: 180_000_000,
    spellchecker: {
        dir: 'Wikipedia',
        shortName: 'Wikipedia',
        fullName: 'Wikipedia',
        url: 'http://www.aaabbb.de/WordList/WordList.php',
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
        url: 'https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/de/de_50k.txt',
    },
};

export const EASTER_EGG_DAYS = {
    '03.10': {
        type: 'public',
        specialMode: 'sandbox_live',
        emojis: [{
            correct: ['🌿'],
            position: ['🍺', '🍻', '🥨'],
            incorrect: ['🏰'],
            typedKnownIncorrect: ['🦅', '🪶'],
        }],
    },
};
