import fs from 'fs';

import  {
    getIsWordValid,
    actionBuildDictionary,
} from './utils/build-dictionary.js';

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
    EASTER_EGG_DAYS,
} from './../resources/es/constants.js';

const LANG = 'es';

const spellcheckerDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const spellcheckerDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellcheckerAlt.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords1st = [...new Set(spellcheckerDictionary1st.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));
const spellcheckerWords2nd = [...new Set(spellcheckerDictionary2nd.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));

// It's not ideal because accents are excluded in different ways, so there are words with removed accents in this dataset
const spellcheckerWords = [...new Set([...spellcheckerWords1st, ...spellcheckerWords2nd])];

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());

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
