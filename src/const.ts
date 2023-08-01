export const WORD_MAXLENGTH = 15;

export const WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS = 10;

export const KEY_LINES = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
];

const ALLOWED_FROM_KEYLINES = KEY_LINES.reduce((stack, line) => [...stack, ...line], []);

export const POLISH_CHARACTERS = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

export const ALLOWED_KEYS = [' ', ...ALLOWED_FROM_KEYLINES];

export const SUBMIT_ERRORS = {
    ALREADY_PROCESSING: 'already_processing',
    ALREADY_WON: 'already_won',
    ALREADY_SUBMITED: 'already_submited',
    HAS_SPACE: 'has_space',
    WORD_DOES_NOT_EXIST: 'word_does_not_exist',
};

export const LOCAL_STORAGE = {
    LAST_GAME: 'diffle_last_game',
};
