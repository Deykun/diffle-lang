export const WORD_MAXLENGTH = 15;

export const WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS = 10;

export const KEY_LINES = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
];

const ALLOWED_FROM_KEYLINES = KEY_LINES.reduce((stack, line) => [...stack, ...line], []);

export const ALLOWED_KEYS = [' ', ...ALLOWED_FROM_KEYLINES];
