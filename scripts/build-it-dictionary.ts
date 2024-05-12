import fs from 'fs';

import  {
    actionBuildDictionary,
} from './utils/build-dictionary';

import {
    getWordsFromDictionary,
} from './utils/parse-dictionary'

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    DICTIONARIES,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    EASTER_EGG_DAYS,
} from '../resources/it/constants';

const LANG = 'it';

const spellcheckerDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const spellcheckerDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellcheckerAlt.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/pol/dictionary.txt`, 'utf-8');

const spellcheckerWords1st = getWordsFromDictionary(spellcheckerDictionary1st, { pattern: 'word/ignore', lang: LANG });
const spellcheckerWords2nd = getWordsFromDictionary(spellcheckerDictionary2nd, { pattern: 'word ignore', lang: LANG });

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
