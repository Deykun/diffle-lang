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
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
    EASTER_EGG_DAYS,
} from '../resources/fr/constants';

const LANG = 'fr';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/deu/dictionary.txt`, 'utf-8');
const winningDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/ita/dictionary.txt`, 'utf-8');
const winningDictionary4th = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winningAlt.dir}/dictionary.txt`, 'utf-8');
const frequencyDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.popularity.dir}/dictionary.txt`, 'utf-8');

const frequencyWords = getWordsFromDictionary(frequencyDictionary, { pattern: 'word ignore', lang: LANG });

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word ignore', lang: LANG });

const [longestWinningWords, ...winningWordsDictionariesToCheck] = [
    getWordsFromDictionary(winningDictionary1st, { pattern: 'word ignore', lang: LANG }),
    getWordsFromDictionary(winningDictionary2nd, { pattern: 'word ignore', lang: LANG }),
    getWordsFromDictionary(winningDictionary4th, { pattern: 'word ignore', lang: LANG }),
    frequencyWords,
].sort((a, b) => b.length - a.length);

const winningWords = longestWinningWords.filter(
    (word) => winningWordsDictionariesToCheck.every((wordList) => wordList.includes(word)),
);

actionBuildDictionary(
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        MAXIMUM_LENGTH_OF_ABOUT_LANGUAGE_WORD: 18,
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
    frequencyWords,
);
