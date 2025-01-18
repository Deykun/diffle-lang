export const BLOCKED_WORDS = ['prdel'];

export const BLOCKED_PARTS = [];

export const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = ['q', 'x'];

export const DICTIONARIES = {
    nativeSpeakersFromWikipedia: 10_700_000,
    spellchecker: {
        dir: 'czech-cc0-dictionaries',
        shortName: 'Czech CC0 dictionaries',
        fullName: 'Czech CC0 dictionaries',
        url: 'https://gitlab.com/strepon/czech-cc0-dictionaries/',
    },
    winning: {
        dir: 'SlovinikWebzCz',
        shortName: 'slovniky.webz.cz',
        fullName: 'slovniky.webz.cz',
        url: 'http://home.zcu.cz/~konopik/ppc/',
    },
    popularity: {
        dir: 'FrequencyWords',
        shortName: 'FrequencyWords',
        fullName: 'FrequencyWords',
        url: 'https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/cs/cs_50k.txt',
    },
};

export const EASTER_EGG_DAYS = {
    '28.10': {
        type: 'public',
        specialMode: 'sandbox-live',
        emojis: [{
            correct: ['🌿'],
            position: ['🍺', '🍻', '🦁'],
            incorrect: ['🏰', '⛸️'],
            typedKnownIncorrect: ['🏒'],
        }],
    },
};