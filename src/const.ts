import { Dictionary, CookiesName } from '@common-types';

export const isTestEnv = (window.location.origin || '')?.includes(':2001') || false;
export const isDev = (window.location.origin || '')?.includes('localhost') || false;

export const WORD_MAXLENGTH = 15;

// If breaking changes are released you can set a date stamp here and it will block the game
export const UPDATE_BLOCK_DAILY = '18.01.2025';

const SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES = [
  ' ', 'delete', 'arrowleft', 'arrowright', 'arrowdown', 'arrowup', 'home', 'end',
];

const KEY_LINES_CS_VARIANTS = [{
  name: 'QWERTZ',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř'],
    ['š', 'ť', 'ú', 'spacebar', 'ů', 'ý', 'ž'],
  ],
}, {
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř'],
    ['š', 'ť', 'ú', 'spacebar', 'ů', 'ý', 'ž'],
  ],
}];

const KEY_LINES_DE_VARIANTS = [{
  name: 'QWERTZ',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ä', 'ö', 'spacebar', 'ß', 'ü'],
  ],
}, {
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ä', 'ö', 'spacebar', 'ß', 'ü'],
  ],
}];

const KEY_LINES_EN_VARIANTS = [{
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
  ],
}];

const KEY_LINES_ES_VARIANTS = [{
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
  ],
}];

const KEY_LINES_FI_VARIANTS = [{
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['å', 'ä', 'ö', 'spacebar', 'š', 'ž'],
  ],
}];

/*
  I had a hard time deciding which letters should stay.
  Some are used in fewer than 200 words in a 460k dictionary.
  In the end, I decided to check the letters that Duolingo adds in their French course

  https://en.wikipedia.org/wiki/French_orthography#Alphabet - ÿ was ommited
*/
const KEY_LINES_FR_VARIANTS = [{
  name: 'BÉPO',
  keyLines: [
    ['b', 'é', 'p', 'o', 'è', 'v', 'd', 'l', 'j', 'z', 'w'],
    ['a', 'u', 'i', 'e', 'c', 't', 's', 'r', 'n', 'm', 'ç'],
    ['ê', 'à', 'y', 'x', 'k', 'q', 'g', 'h', 'f'],
    ['backspace', 'â', 'ë', 'œ', 'æ', 'enter'],
    ['î', 'ï', 'ô', 'spacebar', 'ù', 'û', 'ü'],
  ],
}, {
  name: 'AZERTY',
  keyLines: [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['backspace', 'w', 'x', 'c', 'v', 'b', 'n', 'enter'],
    ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë'],
    ['î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'],
  ],
}, {
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë'],
    ['î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'],
  ],
}];

const KEY_LINES_IT_VARIANTS = [{
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['à', 'è', 'é', 'ì', 'í', 'î', 'ò', 'ó', 'ù', 'ú'],
  ],
}];

const KEY_LINES_PL_VARIANTS = [{
  name: 'QWERTY',
  keyLines: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
  ],
}];

const removeFunctionalKeys = (key: string) => !['backspace', 'enter', 'spacebar'].includes(key);

export const SUPPORTED_DICTIONARY_BY_LANG: {
  [key: string]: Dictionary,
} = {
  cs: {
    code: 'cs',
    languages: ['cs', 'cs-CZ'],
    title: 'DIFFLE - Hra jako Wordle (v češtině, bez omezení znaků) 🇨🇿',
    keyLinesVariants: KEY_LINES_CS_VARIANTS,
    keyLinesToUse: KEY_LINES_CS_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_CS_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_CS_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
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
    title: 'DIFFLE - das Spiel wie Wordle (auf Deutsch, ohne Zeichenbegrenzung) 🇩🇪',
    keyLinesVariants: KEY_LINES_DE_VARIANTS,
    keyLinesToUse: KEY_LINES_DE_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_DE_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_DE_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: ['ä', 'ö', 'ß', 'ü'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://de.pons.com/%C3%BCbersetzung/deutsche-rechtschreibung/{{word}}', name: 'PONS Rechtschreibung und Fremdwörter', hasExactMatchAlways: false },
      { url: 'https://www.dwds.de/wb/{{word}}', name: 'DWDS - Digitales Wörterbuch der deutschen Sprache', hasExactMatchAlways: false },
    ],
    shareMarker: '🇩🇪 #diffle #difflede',
    maxWordLength: 18,
  },
  en: {
    code: 'en',
    languages: ['en', 'en-UK'],
    title: 'DIFFLE - the game like Wordle (without character limit)',
    keyLinesVariants: KEY_LINES_EN_VARIANTS,
    keyLinesToUse: KEY_LINES_EN_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_EN_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_EN_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: [],
    hasSpecialCharacters: false,
    urls: [
      { url: 'https://www.merriam-webster.com/dictionary/{{word}}', name: 'Merriam Webster', hasExactMatchAlways: false },
      { url: 'https://dictionary.cambridge.org/dictionary/english/{{word}}', name: 'Cambridge Dictionary', hasExactMatchAlways: false },
      { url: 'https://www.oxfordlearnersdictionaries.com/definition/english/{{word}}', name: 'Oxford Learner\'s Dictionaries', hasExactMatchAlways: false },
    ],
    shareMarker: '#diffle #diffleen',
  },
  es: {
    code: 'es',
    languages: ['es'],
    isBeta: true,
    title: 'DIFFLE - el juego similar a Wordle (sin límite de caracteres) 🇪🇸',
    keyLinesVariants: KEY_LINES_ES_VARIANTS,
    keyLinesToUse: KEY_LINES_ES_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_ES_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_ES_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://dle.rae.es/{{word}}', name: 'RAE - Diccionario de la lengua español', hasExactMatchAlways: false },
      { url: 'https://www.fbbva.es/diccionario/{{word}}', name: 'Diccionario - Fundación BBVA', hasExactMatchAlways: false },
    ],
    shareMarker: '🇪🇸 #diffle #difflees',
  },
  fi: {
    code: 'es',
    languages: ['es'],
    isBeta: true,
    title: 'DIFFLE - peli kuin Wordle (ilman merkkirajoitusta) 🇫🇮',
    keyLinesVariants: KEY_LINES_FI_VARIANTS,
    keyLinesToUse: KEY_LINES_FI_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_FI_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_FI_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: ['å', 'ä', 'ö', 'š', 'ž'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://www.suomisanakirja.fi/{{word}}', name: 'Suomi Sanakirja', hasExactMatchAlways: false },
      { url: 'https://www.suomienglantisanakirja.fi/{{word}}', name: 'Suomi-englanti sanakirja', hasExactMatchAlways: false },
    ],
    shareMarker: '🇫🇮 #diffle #diffleefi',
  },
  fr: {
    code: 'fr',
    languages: ['fr'],
    title: 'DIFFLE - le jeu similaire à Wordle (en français, sans limite de caractères) 🇫🇷',
    keyLinesVariants: KEY_LINES_FR_VARIANTS,
    keyLinesToUse: KEY_LINES_FR_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_FR_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_FR_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://fr.wiktionary.org/wiki/{{word}}', name: 'Wiktionary.org', hasExactMatchAlways: false },
      { url: 'https://www.le-dictionnaire.com/definition/{{word}}', name: 'Le dictionnaire', hasExactMatchAlways: false },
      { url: 'https://www.cnrtl.fr/definition/{{word}}', name: 'CNRTL', hasExactMatchAlways: false },
    ],
    shareMarker: '🇫🇷 #diffle #difflefr',
  },
  it: {
    code: 'it',
    languages: ['it'],
    isBeta: true,
    title: 'DIFFLE - il gioco simile a Wordle (senza limite di caratteri) 🇮🇹',
    keyLinesVariants: KEY_LINES_IT_VARIANTS,
    keyLinesToUse: KEY_LINES_IT_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_IT_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_IT_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
    specialCharacters: ['à', 'è', 'é', 'ì', 'í', 'î', 'ò', 'ó', 'ù', 'ú'],
    hasSpecialCharacters: true,
    urls: [
      { url: 'https://www.dizionario-italiano.it/dizionario-italiano.php?parola={{word}}', name: 'Dizionario Italiano', hasExactMatchAlways: false },
      { url: 'https://sapere.virgilio.it/parole/vocabolario/{{word}}', name: 'Virgilio Sapere', hasExactMatchAlways: false },
    ],
    shareMarker: '🇮🇹 #diffle #diffleit',
  },
  pl: {
    code: 'pl',
    languages: ['pl', 'pl-PL'],
    title: 'DIFFLE - gra jak Wordle (po polsku, bez limitu znaków) 🇵🇱',
    keyLinesVariants: KEY_LINES_PL_VARIANTS,
    keyLinesToUse: KEY_LINES_PL_VARIANTS[0].keyLines,
    allowedKeys: [...SUPPORTED_BUT_NOT_INCLUDED_IN_VIRTUAL_KEY_LINES, ...KEY_LINES_PL_VARIANTS[0].keyLines.flatMap(key => key)],
    characters: KEY_LINES_PL_VARIANTS[0].keyLines.flatMap(key => key).filter(removeFunctionalKeys),
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
  EMPTY_WORD_TO_GUESS: 'empty_word_to_guess',
};

export const GIVE_UP_ERRORS = {
  NO_LANG: 'no_lang',
  WRONG_MODE: 'wrong_mode',
};

export const LOCAL_STORAGE = {
  LAST_LANG: 'diffle_last_lang',
  THEME: 'diffle_theme',
  THEME_CONTRAST: 'diffle_theme_contrast',
  COOKIES: 'diffle_cookies',
  SHOULD_VIBRATE: 'diffle_should_vibrate',
  SHOULD_VIBRATE_KEYBOARD: 'diffle_should_vibrate_keyboard',
  IS_SMALL_KEYBOARD: 'diffle_is_small_keyboard',
  SHOULD_SWAP_ENTER: 'diffle_should_swap_enter',
  SHOULD_CONFIRM_ENTER: 'diffle_should_confirm_enter',
  SHOULD_SHOW_DURATION: 'diffle_show_duration',
  SHOULD_SHARE_WORDS: 'diffle_should_share_words',
  MAX_DAILY_STAMP: 'diffle_max_daily_stamp',
  CUSTOM_TAG: 'diffle_custom_tag',
};

/* I don't want to gather reports from possible forks because I cannot update them. ~ deykun */
export const IS_MAIN_INSTANCE = ['localhost', 'deykun'].some(phrase => window.location.href.includes(phrase));

// Just put your ID inside the single quotes if you want to use your own GA instance. ;)
export const TRACKER_GA_ID = IS_MAIN_INSTANCE ? 'G-ZEKHKHYYV0' : '';

export const COOKIES_INITIAL_SETTINGS_UNSET = {
  [CookiesName?.GOOGLE_ANALYTICS]: false,
  [CookiesName?.DIFFLE_EXTERNAL]: false,
  [CookiesName?.DIFFLE_LOCAL]: false,
};

// This is the "Accept all" preset some checks aren't true if they aren't configured
export const COOKIES_INITIAL_SETTINGS_PRESET = {
  [CookiesName?.GOOGLE_ANALYTICS]: !!TRACKER_GA_ID,
  [CookiesName?.DIFFLE_EXTERNAL]: !!IS_MAIN_INSTANCE,
  [CookiesName?.DIFFLE_LOCAL]: true,
};
