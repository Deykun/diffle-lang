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
} from '../resources/pl/constants';

const LANG = 'pl';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.spellchecker.dir}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winning.dir}/dictionary.txt`, 'utf-8');
const winningDictionaryAlt = fs.readFileSync(`./resources/${LANG}/${DICTIONARIES.winningAlt.dir}/dictionary.txt`, 'utf-8');

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, { pattern: 'word', lang: LANG });

const frequencyWords = getWordsFromDictionary(winningDictionaryAlt, { pattern: 'word ignore', lang: LANG });

/* Gets only X percentage of most popular words */
const XPercentage = 829568 / 1491400; // 829k - first line with 1 frequency, 1491k - last line ~ 55.6%
const frequencyWordsFirstXPercentage = frequencyWords.slice(0, Math.floor(frequencyWords.length * XPercentage));

const [longestWinningWords, ...winningWordsDictionariesToCheck] = [
    getWordsFromDictionary(winningDictionary, { pattern: 'word ignore', lang: LANG }),
    frequencyWordsFirstXPercentage,
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
        EASTER_EGG_DAYS,
    },
    spellcheckerWords,
    winningWords,
);
