export const KEYLINES = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż', 'enter'],
];

export const ALLOWED_KEYS = KEYLINES.reduce((stack, line) => [...stack, ...line], []);
