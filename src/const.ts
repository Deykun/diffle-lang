import { Dictionary } from '@common-types';

export const WORD_MAXLENGTH = 15;

// If breaking changes are released you can set a date stamp here and it will block the game
export const UPDATE_BLOCK_DAILY = '19.01.2024';

const SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES = [' ', 'delete', 'arrowleft', 'arrowright', 'arrowdown', 'arrowup'];

const KEY_LINES_CS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
  ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř'],
  ['š', 'ť', 'ú', 'spacebar', 'ů', 'ý', 'ž'],
];

const KEY_LINES_DE = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
  ['ä', 'ö', 'spacebar', 'ß', 'ü'],
];

const KEY_LINES_EN = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

const KEY_LINES_ES = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
  ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
];

const KEY_LINES_PL = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
  ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
];

export const SUPPORTED_DICTIONARY_BY_LANG: {
  [key: string]: Dictionary,
} = {
  cs: {
    code: 'cs',
    languages: ['cs', 'cs-CZ'],
    title: 'DIFFLE - Hra jako Wordle (v češtině, bez omezení znaků) 🇨🇿',
    shouldPreferQWERTZ: true,
    keyLines: KEY_LINES_CS,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_CS.flatMap(key => key)],
    characters: KEY_LINES_CS.flatMap(key => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
    specialCharacters: ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř', 'š', 'ť', 'ú', 'ů', 'ý', 'ž'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://www.nechybujte.cz/slovnik-soucasne-cestiny/{{word}}', name: 'Slovník současné češtiny', hasExactMatchAlways: false },
      { url: 'https://slovnikcestiny.cz/heslo/{{word}}/0', name: 'Akademický slovník současné češtiny', hasExactMatchAlways: false },
    ],
    shareMarker: '🇨🇿 #diffle #difflecs',
  },
  de: {
    code: 'de',
    languages: ['de', 'de-DE'],
    isBeta: true,
    title: 'DIFFLE - das Spiel wie Wordle (ohne Zeichenbegrenzung) 🇩🇪',
    shouldPreferQWERTZ: true,
    keyLines: KEY_LINES_DE,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_DE.flatMap(key => key)],
    characters: KEY_LINES_DE.flatMap(key => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
    specialCharacters: ['ä', 'ö', 'ß', 'ü'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://www.dwds.de/wb/{{word}}', name: 'DWDS - Digitales Wörterbuch der deutschen Sprache', hasExactMatchAlways: false },
      { url: 'https://de.pons.com/%C3%BCbersetzung/deutsche-rechtschreibung/{{word}}', name: 'PONS Rechtschreibung und Fremdwörter', hasExactMatchAlways: false },
    ],
    shareMarker: '🇩🇪 #diffle #difflede',
  },
  en: {
    code: 'en',
    languages: ['en', 'en-UK'],
    title: 'DIFFLE - the game like Wordle (without character limit)',
    shouldPreferQWERTZ: false,
    keyLines: KEY_LINES_EN,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_EN.flatMap(key => key)],
    characters: KEY_LINES_EN.flatMap(key => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
    specialCharacters: [],
    hasSpecialCharacters: false,
    urls: [
      { url: 'https://dictionary.cambridge.org/dictionary/english/{{word}}', name: 'Cambridge Dictionary', hasExactMatchAlways: false },
      { url: 'https://www.oxfordlearnersdictionaries.com/definition/english/{{word}}', name: 'Oxford Learner\'s Dictionaries', hasExactMatchAlways: false },
    ],
    shareMarker: '#diffle #difflees',
  },
  es: {
    code: 'es',
    languages: ['es'],
    isBeta: true,
    title: 'DIFFLE - el juego similar a Wordle (sin límite de caracteres) 🇪🇸',
    shouldPreferQWERTZ: false,
    keyLines: KEY_LINES_ES,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_ES.flatMap(key => key)],
    characters: KEY_LINES_ES.flatMap(key => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
    specialCharacters: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://dle.rae.es/{{word}}', name: 'RAE - Diccionario de la lengua español', hasExactMatchAlways: false },
      { url: 'https://www.fbbva.es/diccionario/{{word}}', name: 'Diccionario - Fundación BBVA', hasExactMatchAlways: false },
    ],
    shareMarker: '🇪🇸 #diffle #difflees',
  },
  pl: {
    code: 'pl',
    languages: ['pl', 'pl-PL'],
    title: 'DIFFLE - gra jak Wordle (po polsku, bez limitu znaków) 🇵🇱',
    shouldPreferQWERTZ: false,
    keyLines: KEY_LINES_PL,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_PL.flatMap(key => key)],
    characters: KEY_LINES_PL.flatMap(key => key).filter((key => !['backspace', 'enter', 'spacebar'].includes(key))),
    specialCharacters: ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://sjp.pl/{{word}}', name: 'SJP.pl', hasExactMatchAlways: true },
    ],
    shareMarker: '🇵🇱 #diffle #difflepl',
  },
};

export const SUPPORTED_LANGS = Object.keys(SUPPORTED_DICTIONARY_BY_LANG);

export const WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS = 10;

export const WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS = 6;

// localhost:3001 has diffrent winning word so you don't need to worry about spoilers
export const SEED_SHIFT = window.location.hostname === 'localhost' ? 0 : 1984;

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
  LAST_LANG: 'diffle_last_lang',
  THEME: 'diffle_theme',
  THEME_CONTRAST: 'diffle_theme_contrast',
  SHOULD_VIBRATE: 'diffle_should_vibrate',
  SHOULD_VIBRATE_KEYBOARD: 'diffle_should_vibrate_keyboard',
  IS_SMALL_KEYBOARD: 'diffle_is_small_keyboard',
  QWERTY_MODE: 'diffle_qwerty_mode',
  SHOULD_SWAP_ENTER: 'diffle_should_swap_enter',
  SHOULD_CONFIRM_ENTER: 'diffle_should_confirm_enter',
  SHOULD_SHARE_WORDS: 'diffle_should_share_words',
};
