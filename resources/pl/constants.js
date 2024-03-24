export const BLOCKED_WORDS = ['pierdolić', 'chuj'];

export const BLOCKED_PARTS = ['jeb', 'gówn', 'kutas'];

export const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = ['q', 'x', 'v'];

export const DICTIONARIES = {
    nativeSpeakersFromWikipedia: 40_670_000,
    spellchecker: {
        dir: 'SJP',
        shortName: 'SJP.pl',
        fullName: 'Słownik SJP.pl',
        url: 'https://sjp.pl/',
    },
    winning: {
        dir: 'FreeDict',
        shortName: 'FreeDict',
        fullName: 'FreeDict',
        url: 'https://freedict.org/',
    },
};

export const EASTER_EGG_DAYS = {
    '24.03': {
        type: 'independence',
        specialMode: 'sandbox-live',
        emojis: [{
            correct: ['🌿'],
            position: ['🥟', '🥟', '🥟', '🥐'],
            incorrect: ['🪽'],
            typedKnownIncorrect: ['🦬', '🦅', '🐗'],
        }],
    },
};