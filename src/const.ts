export const WORD_MAXLENGTH = 15;

import { GameMode } from '@common-types';

const SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES = [' ', 'delete', 'arrowleft', 'arrowright', 'arrowdown', 'arrowup'];

const KEY_LINES_EN = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

const KEY_LINES_PL = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń',  'ó', 'ś', 'ź', 'ż'],
];

export const SUPORTED_DICTIONARY_BY_LANG: {
    [key: string]: {
        code: string,
        languages: string[],
        title: string,
        keyLines: string[][],
        allowedKeys: string[],
        characters: string[],
        specialCharacters: string[],
        hasSpecialCharacters: boolean,
    }
} = {
    en: {
        code: 'en',
        languages: ['en', 'en-US'],
        title: 'DIFFLE - the game like Wordle (without character limit)',
        keyLines: KEY_LINES_EN,
        allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_EN.flatMap((key) => key)],
        characters: KEY_LINES_EN.flatMap((key) => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
        specialCharacters: [],
        hasSpecialCharacters: false,
    },
    pl: {
        code: 'pl',
        languages: ['pl', 'pl-PL'],
        title: 'DIFFLE - gra jak Wordle (po polsku, bez limitu znaków) 🇵🇱',
        keyLines: KEY_LINES_PL,
        allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_PL.flatMap((key) => key)],
        characters: KEY_LINES_PL.flatMap((key) => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
        specialCharacters: KEY_LINES_PL.flatMap((key) => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
        hasSpecialCharacters: false,
    },
}

export const SUPPORTED_LANGS = Object.keys(SUPORTED_DICTIONARY_BY_LANG);

export const WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS = 10;

export const PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS = 6;

export const KEY_LINES = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń',  'ó', 'ś', 'ź', 'ż'],
];

const ALLOWED_FROM_KEYLINES = KEY_LINES.reduce((stack, line) => [...stack, ...line], []);

export const SEED_SHIFT = location.hostname === 'localhost' ? 0 : 1984;

export const POLISH_CHARACTERS = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];


export const ALLOWED_KEYS = [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...ALLOWED_FROM_KEYLINES];

export const ALLOWED_LETTERS = KEY_LINES.flatMap((line) => line).filter((key => !['backspace', 'enter', 'spacebar'].includes(key)));

export const SUBMIT_ERRORS = {
    ALREADY_PROCESSING: 'already_processing',
    ALREADY_ENDED: 'already_ended',
    ALREADY_SUBMITED: 'already_submited',
    HAS_SPACE: 'has_space',
    WORD_DOES_NOT_EXIST: 'word_does_not_exist',
    WORD_FETCH_ERROR: 'word_fetch_error',
    RESTORING_ERROR: 'restoring_error',
};

export const GIVE_UP_ERRORS = {
    NO_LANG: 'no_lang',
    WRONG_MODE: 'wrong_mode',
};

export const LOCAL_STORAGE = {
    THEME: 'diffle_theme',
    THEME_CONTRAST: 'diffle_theme_contrast',
    SHOULD_VIBRATE: 'diffle_should_vibrate',
    SHOULD_VIBRATE_KEYBOARD: 'diffle_should_vibrate_keyboard',
    IS_SMALL_KEYBOARD: 'diffle_is_small_keyboard',
    SHOULD_SWAP_ENTER: 'diffle_should_swap_enter',
    SHOULD_CONFIRM_ENTER: 'diffle_should_confirm_enter',
    SHOULD_SHARE_WORDS: 'diffle_should_share_words',
};
