import fs from 'fs';

import  {
    getIsWordValid,
    actionBuildDictionary,
} from './utils/build-dictionary.js';

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    DICTIONARIES,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    EASTER_EGG_DAYS,
} from './../resources/it/constants.js';

const LANG = 'it';

const spellcheckerDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const spellcheckerDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellcheckerAlt.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/pol/dictionary.txt`, 'utf-8');

const spellcheckerWords1st = [...new Set(spellcheckerDictionary1st.split(/\r?\n/).filter(Boolean).map(line => (line.replace(/\s+/g,'').trim().split('/'))[0]).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));
const spellcheckerWords2nd = [...new Set(spellcheckerDictionary2nd.split(/\r?\n/).filter(Boolean).map(line => (line.replace(/\s+/g,' ').trim().split(' '))[0]).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));

const spellcheckerWords = [...new Set([...spellcheckerWords1st, ...spellcheckerWords2nd])];

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase()).filter((word => getIsWordValid(word, LANG)));

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