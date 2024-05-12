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
} from './../resources/de/constants.js';

const LANG = 'de';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/eng/dictionary.txt`, 'utf-8');
const winningDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/fra/dictionary.txt`, 'utf-8');

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word ignore', lang: LANG });

const winningWords1st = getWordsFromDictionary(winningDictionary1st, { pattern: 'word ignore', lang: LANG });
const winningWords2nd = getWordsFromDictionary(winningDictionary2nd, { pattern: 'word ignore', lang: LANG });

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
