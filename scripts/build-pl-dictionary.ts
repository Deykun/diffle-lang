import fs from 'fs';

import  {
    actionBuildDictionary,
} from './utils/build-dictionary.js';

import {
    getWordsFromDictionary,
} from './utils/parse-dictionary.js'

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
    EASTER_EGG_DAYS,
} from '../resources/pl/constants.js';

const LANG = 'pl';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word', lang: LANG });

const winningWords = getWordsFromDictionary(winningDictionary, { pattern: 'word ignore', lang: LANG });

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
);
