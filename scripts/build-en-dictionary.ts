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
} from '../resources/en/constants';

const LANG = 'en';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary1st = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/ara/dictionary.txt`, 'utf-8');
const winningDictionary2nd = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/jap/dictionary.txt`, 'utf-8');
const frequencyDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.popularity.dir}/dictionary.txt`, 'utf-8');

const frequencyWords = getWordsFromDictionary(frequencyDictionary, { pattern: 'word ignore', lang: LANG });

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word', lang: LANG });

const [longestWinningWords, ...winningWordsDictionariesToCheck] = [
    getWordsFromDictionary(winningDictionary1st, { pattern: 'word ignore', lang: LANG }),
    getWordsFromDictionary(winningDictionary2nd, { pattern: 'word ignore', lang: LANG }),
    frequencyWords,
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
        MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD: 17,
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
    frequencyWords,
);
