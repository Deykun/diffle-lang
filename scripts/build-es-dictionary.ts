import fs from 'fs';

import  {
    actionBuildDictionary,
} from './utils/build-dictionary';

import {
    getWordsFromDictionary,
} from './utils/parse-dictionary.js'

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
    EASTER_EGG_DAYS,
} from '../resources/es/constants';

const LANG = 'es';

const spellcheckerDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const spellcheckerDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellcheckerAlt.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords1st = getWordsFromDictionary(spellcheckerDictionary1st, { pattern: 'word ignore', lang: LANG });
const spellcheckerWords2nd = getWordsFromDictionary(spellcheckerDictionary2nd, { pattern: 'word ignore', lang: LANG });

// It's not ideal because accents are excluded in different ways, so there are words with removed accents in this dataset
const spellcheckerWords = [...new Set([...spellcheckerWords1st, ...spellcheckerWords2nd])];

const winningWords = getWordsFromDictionary(winningDictionary, { pattern: 'word ignore', lang: LANG });

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD: 17,
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
);
