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
} from './../resources/es/constants.js';

const LANG = 'es';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase()).filter((word => getIsWordValid(word)));

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());

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
