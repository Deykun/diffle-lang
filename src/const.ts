export const WORD_MAXLENGTH = 15;

import { GameMode } from '@common-types';

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

const SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES = [' ', 'delete', 'arrowleft', 'arrowright', 'arrowdown', 'arrowup'];

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
    WRONG_MODE: 'wrong_mode',
};

export const LOCAL_STORAGE = {
    LAST_GAME_MODE: 'diffle_pl_last_game_mode',
    LAST_DAILY_STAMP: 'diffle_pl_daily_stamp',
    TYPE_DAILY: 'diffle_pl_mode_daily',
    TYPE_PRACTICE: 'diffle_pl_mode_practice',
    TYPE_SHARE: 'diffle_pl_mode_share',
    // Not lang dependent
    THEME: 'diffle_theme',
    THEME_CONTRAST: 'diffle_theme_contrast',
    SHOULD_VIBRATE: 'diffle_should_vibrate',
    SHOULD_VIBRATE_KEYBOARD: 'diffle_should_vibrate_keyboard',
    IS_SMALL_KEYBOARD: 'diffle_is_small_keyboard',
    SHOULD_SWAP_ENTER: 'diffle_should_swap_enter',
    SHOULD_CONFIRM_ENTER: 'diffle_should_confirm_enter',
    SHOULD_SHARE_WORDS: 'diffle_should_share_words',
};

export const LOCAL_STORAGE_GAME_BY_MODE = {
    [GameMode?.Daily]: LOCAL_STORAGE.TYPE_DAILY,
    [GameMode?.Practice]: LOCAL_STORAGE.TYPE_PRACTICE,
    [GameMode?.Share]: LOCAL_STORAGE.TYPE_SHARE,
};
