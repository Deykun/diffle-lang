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
} from './../resources/cs/constants.js';

const LANG = 'cs';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).filter(Boolean).map((word) => word.toLowerCase()))].filter((word => getIsWordValid(word, LANG)));

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.trim().replace(/\s+/g,' ').split(' ')).at(-1)).filter(Boolean))].map(word => word.toLowerCase());

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
    },
    spellcheckerWords,
    winningWords,
);
