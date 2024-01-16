import fs from 'fs';
import * as fsExtra from "fs-extra";
import chalk from 'chalk';

import { BLOCKED_WORDS_PL as BLOCKED_WORDS, BLOCKED_PARTS_PL as BLOCKED_PARTS } from './../resources/pl/constants.js';

const LANG = 'pl';

const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 4;
/*
    Very long words have multiple markers
    and it is usually come kind of "okrówkowanie"
    The game is nicer with this limit
*/
const MAXIMUM_LENGTH_FOR_A_WINNING_WORD = 9;

const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = ['q', 'x', 'v'];

const spellcheckerDictionary = fs.readFileSync(`./resources/${LANG}/SJP/dictionary.txt`, 'utf-8');
const winningDictionary = fs.readFileSync(`./resources/${LANG}/FreeDict/dictionary.txt`, 'utf-8');

fsExtra.emptyDirSync(`./public/dictionary/${LANG}/spelling/`);
fsExtra.emptyDirSync(`./public/dictionary/${LANG}/winning/`);

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).filter(Boolean))].map(word => word.toLowerCase());
const totalSpellcheckerWords = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
const totalWinningWords = winningWords.length;

let spellingIndex = {};

const removeDiacratics = (word) => word
    .replaceAll('ą', 'a')
    .replaceAll('ć', 'c')
    .replaceAll('ę', 'e')
    .replaceAll('ł', 'l')
    .replaceAll('ń', 'n')
    .replaceAll('ó', 'o')
    .replaceAll('ś', 's')
    .replaceAll('ź', 'z')
    .replaceAll('ż', 'z');

const getNormalizedKey = word => {
    if (word.length === 2) {
        return '2ch';
    }

    if (word.length < 3) {
        return;
    }

    if (word.length === 3) {
        return '3ch';
    }

    /*
        Nie" is the negation marker in Polish, and in Polish, negated adjectives have "nie" as a prefix.

        So it has it's own subkey system.
    */
    const key = word.startsWith('nie') ? word.slice(0, 6) : word.slice(0, 3);

    return removeDiacratics(key);
}

const getIsWordWithSpecialCharacters = (word) => removeDiacratics(word) !== word;

let longestWord = '';
let totalWithoutSpecialCharacters = 0;
let totalWithSpecialCharacters = 0;

console.log(' ');
console.log(chalk.blue(`Creating spelling chunks index from ${totalSpellcheckerWords} words...`));

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key) {
        if (spellingIndex[key]) {
            spellingIndex[key].words.push(word);
        } else {
            spellingIndex[key] = {
                key,
                words: [word],
            };
        }

        if (word === removeDiacratics(word)) {
            totalWithoutSpecialCharacters += 1;
        } else {
            totalWithSpecialCharacters += 1;
        }

        if (word.length > longestWord.length) {
            longestWord = word;
        }

        const shouldUpdate = index % 75000 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / totalSpellcheckerWords) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Creating spelling chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
        }
    }
});

const totalNumberOfSpellingChunks = Object.keys(spellingIndex).length;

console.log(`  - total with special characters: ${chalk.green(totalWithSpecialCharacters)}`);
console.log(`  - total without special characters: ${chalk.green(totalWithoutSpecialCharacters)}`);

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfSpellingChunks} created chunks...`));

Object.keys(spellingIndex).forEach((key, index) => {
    // Unique words
    spellingIndex[key].words = [...new Set(spellingIndex[key].words)];

    fs.writeFileSync(`./public/dictionary/${LANG}/spelling/chunk-${key}.json`, JSON.stringify(spellingIndex[key].words));

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfSpellingChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Saving spelling chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

console.log(' ');
console.log(chalk.blue(`Creating winning chunks from ${totalWinningWords} words...`));


const winningTotals = {
    all: totalWinningWords,
    accepted: {
        specialCharacters: 0,
        noSpecialCharacters: 0,
    },
    rejected: {
        tooLong: 0,
        tooShort: 0,
        censored: 0,
        wrongLetters: 0,
        missingInSpellingDictionary: 0,
    },
    withSpecialCharacters: 0,
    totalWithoutSpecialCharacters: 0,
};

const winnigIndex = {};
const winningWordsLengths = {};

winningWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    const isWithCorrectLength = key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD && word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD;
    if (!isWithCorrectLength) {
        // Meets it so it's too long
        if (word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
            winningTotals.rejected.tooLong += 1;
        }

        if (word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD) {
            winningTotals.rejected.tooShort += 1;
        }

        return;
    }

    const isWordInSpellingDictionary = spellingIndex[key]?.words.includes(word);
    if (!isWordInSpellingDictionary) {
        winningTotals.rejected.missingInSpellingDictionary += 1;

        return;
    }
 
    const hasNotAllowedLetterInWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD.some((notAllowedLetter) => word.includes(notAllowedLetter));
    if (hasNotAllowedLetterInWord) {
        winningTotals.rejected.wrongLetters += 1; 

        return;
    }

    const isBlockedWords = BLOCKED_WORDS.includes(word) || BLOCKED_PARTS.some((blockedPart) => word.includes(blockedPart));
    if (isBlockedWords) {
        winningTotals.rejected.censored += 1; 

        return;
    }

    const isWordWithSpecialCharacters = getIsWordWithSpecialCharacters(word);
    if (isWordWithSpecialCharacters) {
        winningTotals.accepted.specialCharacters += 1;
    } else {
        winningTotals.accepted.noSpecialCharacters += 1;
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

    const shouldUpdate = index % 2500 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalWinningWords) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Creating winning chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
    }
});

console.log(chalk.blue(`Winning chunks created.`));
// We can't accept words that are present in one dictionary and not in another
console.log(` - accepted words: ${chalk.green(winningTotals.accepted.noSpecialCharacters + winningTotals.accepted.specialCharacters)}`);
console.log(`   - without special characters: ${chalk.green(winningTotals.accepted.noSpecialCharacters)}`);
console.log(`   - with special characters: ${chalk.green(winningTotals.accepted.specialCharacters)}`);
console.log(` - rejected words: ${chalk.red(winningTotals.all - winningTotals.accepted)}`);
console.log(`   - too long: ${chalk.red(winningTotals.rejected.tooLong)}`);
console.log(`   - too short: ${chalk.red(winningTotals.rejected.tooShort)}`);
console.log(`   - probably a swear word: ${chalk.red(winningTotals.rejected.censored)}`);
console.log(`   - not accepted letters (${LETTERS_NOT_ALLOWED_IN_WINNING_WORD.join(',')}): ${chalk.red(winningTotals.rejected.wrongLetters)} `);
console.log(' ');
console.log(chalk.blue(`Winning words lengths:`));

Object.keys(winningWordsLengths).sort((a, b) => a - b).forEach((length) => {
    console.log(` - words with ${length} letters: ${chalk.green(winningWordsLengths[length])}`);
});

const catalog = {
    dictionary: {
        winingWordMinLength: MINIMUM_LENGTH_FOR_A_WINNING_WORD,
        winingWordMaxLength: MAXIMUM_LENGTH_FOR_A_WINNING_WORD,
        accepted: winningTotals.accepted,
        rejected: winningTotals.rejected,
    },
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

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Saving winning chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

fs.writeFileSync(`./public/dictionary/${LANG}/catalog.json`, JSON.stringify(catalog));

console.log(' ');
console.log(chalk.blue(`Winning catalog saved!`));

console.log(' ');
console.log(chalk.green('Finished!'));

console.log(' ');
console.log(`Longest indexed word is "${chalk.blue(longestWord)}" it has ${chalk.blue(longestWord.length)} letters.`);
