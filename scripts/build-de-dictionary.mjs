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
} from './../resources/de/constants.js';

const LANG = 'de';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/eng/dictionary.txt`, 'utf-8');
const winningDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/fra/dictionary.txt`, 'utf-8');

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));

const winningWords1st = [...new Set(winningDictionary1st.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
const winningWords2nd = [...new Set(winningDictionary2nd.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
const winningWords = winningWords1st.length > winningWords2nd.length
    ? winningWords1st.filter(word => winningWords2nd.includes(word))
    : winningWords2nd.filter(word => winningWords1st.includes(word));

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD: 25,
        MAXIMUM_LENGTH_OF_SPELLCHEKER_WORD: 18,
        MAXIMUM_LENGTH_OF_WINNING_WORD: 10,
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
);
