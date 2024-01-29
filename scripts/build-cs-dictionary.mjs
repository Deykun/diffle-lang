import fs from 'fs';
import * as fsExtra from "fs-extra";
import chalk from 'chalk';

import {
    INITAL_DICTIONARY_STATISTICS,
    MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD,
    MINIMUM_LENGTH_FOR_A_WINNING_WORD,
    MAXIMUM_LENGTH_FOR_A_WINNING_WORD,
} from './constants.js';

import  {
    consoleStatistics,
    getNormalizedKey,
    getIsWordWithSpecialCharacters,
} from './utils/build-dictionary.js';

import {
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    SPELLCHECKER_DICTIONARY_NAME,
    WINNING_DICTIONARY_NAME,
} from './../resources/cs/constants.js';

const LANG = 'cs';

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/${SPELLCHECKER_DICTIONARY_NAME}/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/${WINNING_DICTIONARY_NAME}/dictionary.txt`, 'utf-8');

const statistics = INITAL_DICTIONARY_STATISTICS;
statistics.winning.lettersNotAcceptedInWinningWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD;

console.log(' ');
console.log(chalk.red('Removing dictionaries to genereted the new ones...'));

fsExtra.emptyDirSync(`./public/dictionary/${LANG}/spelling/`);
fsExtra.emptyDirSync(`./public/dictionary/${LANG}/winning/`);

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).filter(Boolean))].map(word => word.toLowerCase());
statistics.spellchecker.all = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
statistics.winning.all = winningWords.length;

let spellingIndex = {};

console.log(' ');
console.log(chalk.blue(`Creating spelling chunks index from ${statistics.spellchecker.all} words...`));

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, LANG);

    if (key) {
        if (word.length > MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD) {
            statistics.spellchecker.rejected += 1;

            return;
        }
    
        if (spellingIndex[key]) {
            spellingIndex[key].words.push(word);
        } else {
            spellingIndex[key] = {
                key,
                words: [word],
            };
        }

        const firstLetter = word.at(0);

        if (statistics.spellchecker.letters[firstLetter]) {
            statistics.spellchecker.letters[firstLetter] += 1;
        } else {
            statistics.spellchecker.letters[firstLetter] = 1;
        }

        statistics.spellchecker.accepted.all += 1;

        if (getIsWordWithSpecialCharacters(word)) {
            statistics.spellchecker.accepted.withSpecialCharacters += 1;
        } else {
            statistics.spellchecker.accepted.withoutSpecialCharacters += 1;
        }

        const shouldUpdate = index % 75000 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / statistics.spellchecker.all) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Creating spelling chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
        }
    } else {
        statistics.spellchecker.rejected += 1;
    }
});

const totalNumberOfSpellingChunks = Object.keys(spellingIndex).length;

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfSpellingChunks} created chunks...`));

Object.keys(spellingIndex).forEach((key, index) => {
    // Unique words
    spellingIndex[key].words = [...new Set(spellingIndex[key].words)];

    fs.writeFileSync(`./public/dictionary/${LANG}/spelling/chunk-${key}.json`, JSON.stringify(spellingIndex[key].words));

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfSpellingChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Saving spelling chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

console.log(' ');
console.log(chalk.blue(`Creating winning chunks from ${statistics.winning.all} words...`));

const winnigIndex = {};
const winningWordsLengths = {};

winningWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, LANG);

    const isWithCorrectLength = key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD && word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD;
    if (!isWithCorrectLength) {
        // Meets it so it's too long
        if (word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
            statistics.winning.rejected.tooLong += 1;
        }

        if (word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD) {
            statistics.winning.rejected.tooShort += 1;
        }

        return;
    }

    const isWordInSpellingDictionary = spellingIndex[key]?.words.includes(word);
    if (!isWordInSpellingDictionary) {
        statistics.winning.rejected.missingInSpellingDictionary += 1;

        return;
    }
 
    const hasNotAllowedLetterInWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD.some((notAllowedLetter) => word.includes(notAllowedLetter));
    if (hasNotAllowedLetterInWord) {
        statistics.winning.rejected.wrongLetters += 1; 

        return;
    }

    const isBlockedWords = BLOCKED_WORDS.includes(word) || BLOCKED_PARTS.some((blockedPart) => word.includes(blockedPart));
    if (isBlockedWords) {
        statistics.winning.rejected.censored += 1; 

        return;
    }

    statistics.winning.accepted.all += 1;

    const isWordWithSpecialCharacters = getIsWordWithSpecialCharacters(word);
    if (isWordWithSpecialCharacters) {

        statistics.winning.accepted.withSpecialCharacters += 1;
    } else {
        statistics.winning.accepted.withoutSpecialCharacters += 1;
    }

    if (winnigIndex[key]) {
        winnigIndex[key].words.push(word);
    } else {
        winnigIndex[key] = {
            key,
            words: [word],
        };
    }

    const wordLength = word.length;
    winningWordsLengths[wordLength] = winningWordsLengths[wordLength] ? winningWordsLengths[wordLength] + 1 : 1;
    statistics.winning.accepted.length[wordLength] = statistics.winning.accepted.length[wordLength] ? statistics.winning.accepted.length[wordLength] + 1 : 1;

    const shouldUpdate = index % 2500 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / statistics.winning.all) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Creating winning chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
    }
});

statistics.winning.rejected.all = statistics.winning.rejected.tooLong
    + statistics.winning.rejected.tooShort
    + statistics.winning.rejected.censored
    + statistics.winning.rejected.wrongLetters
    + statistics.winning.rejected.missingInSpellingDictionary;

console.log(' ');
console.log(chalk.blue(`Winning chunks created.`));
console.log(' ');

consoleStatistics(statistics);

console.log(chalk.blue(`Winning words lengths:`));

Object.keys(winningWordsLengths).sort((a, b) => a - b).forEach((length) => {
    console.log(` - words with ${length} letters: ${chalk.green(winningWordsLengths[length])}`);
});

const catalog = {
    words: 0,
    items: [],
    winningWordsLengths,
};

const totalNumberOfWinningChunks = Object.keys(winnigIndex).length;

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfWinningChunks} created chunks...`));

Object.keys(winnigIndex).forEach((key, index) => {
    // Unique words
    winnigIndex[key].words = [...new Set(winnigIndex[key].words)];

    fs.writeFileSync(`./public/dictionary/${LANG}/winning/chunk-${key}.json`, JSON.stringify(winnigIndex[key].words));

    const endIndex = catalog.words + winnigIndex[key].words.length;

    catalog.items.push({
        key,
        endIndex,
        keyWords: winnigIndex[key].words.length,
    });

    catalog.words = endIndex;

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfWinningChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Saving winning chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

fs.writeFileSync(`./public/dictionary/${LANG}/catalog.json`, JSON.stringify(catalog));
fs.writeFileSync(`./public/dictionary/${LANG}/info.json`, JSON.stringify(statistics, null, '\t'));

console.log(' ');
console.log(chalk.blue(`Winning catalog saved!`));

console.log(' ');
console.log(chalk.green('Finished!'));
