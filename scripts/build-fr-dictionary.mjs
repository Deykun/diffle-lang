import fs from 'fs';

import {
    getAllLineWords,
} from './utils/parse-dictionary.js';

import  {
    getIsWordValid,
    actionBuildDictionary,
} from './utils/build-dictionary.js';

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
} from './../resources/fr/constants.js';

const LANG = 'fr';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/deu/dictionary.txt`, 'utf-8');
const winningDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/ita/dictionary.txt`, 'utf-8');
const winningDictionary3rd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/pol/dictionary.txt`, 'utf-8');

const spellcheckerWords = getAllLineWords(spellcheckerDictionary, 'first').filter((word => getIsWordValid(word, LANG)));

const [longestWinningWords, ...winningWordsDictionariesToCheck] = [
    getAllLineWords(winningDictionary1st, 'first'),
    getAllLineWords(winningDictionary2nd, 'first'),
    getAllLineWords(winningDictionary3rd, 'first'),
].sort((a, b) => b.length - a.length);

const winningWords = longestWinningWords.filter(
    (word) => winningWordsDictionariesToCheck.every((wordlist) => wordlist.includes(word)),
);

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD: 18,
    },
    spellcheckerWords,
    winningWords,
);
