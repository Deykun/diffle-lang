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
    DICTIONARIES,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    EASTER_EGG_DAYS,
} from '../resources/cs/constants.js';

const LANG = 'cs';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word', lang: LANG });
const winningWords = getWordsFromDictionary(winningDictionary, { pattern: 'ignore word', lang: LANG });

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
