import fs from 'fs';
import chalk from 'chalk';

import { BLOCKED_WORDS_PL as BLOCKED_WORDS, BLOCKED_PARTS_PL as BLOCKED_PARTS } from './resources/constants.js?';

const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 4;
/*
    Very long words have multiple markers
    and it is usually come kind of "okrówkowanie"
    The game is nicer with this limit
*/
const MAXIMUM_LENGTH_FOR_A_WINNING_WORD = 9;

const LETTERS_NOT_ALLOWED_IN_WINNING_WORD = ['q', 'x', 'v'];

const spellcheckerDictionary = fs.readFileSync('./resources/SJP/dictionary.txt', 'utf-8');
const winningDictionary = fs.readFileSync('./resources/FreeDict/dictionary.txt', 'utf-8');

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).filter(Boolean))].map(word => word.toLowerCase());
const totalSpellcheckerWords = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
const totalWinningWords = winningWords.length;

let spellingIndex = {};

const getNormalizedKey = word => {
    if (word.length === 2) {
        return '2ch';
    }

    if (word.length < 3) {
        return;
    }

    /*
        Nie" is the negation marker in Polish, and in Polish, negated adjectives have "nie" as a prefix.

        So it has it's own subkey system.
    */
    const key = word.startsWith('nie') ? word.slice(0, 6) : word.slice(0, 3);

    return key
        .replaceAll('ą', 'a')
        .replaceAll('ć', 'c')
        .replaceAll('ę', 'e')
        .replaceAll('ł', 'l')
        .replaceAll('ń', 'n')
        .replaceAll('ó', 'o')
        .replaceAll('ś', 's')
        .replaceAll('ź', 'z')
        .replaceAll('ż', 'z');
}

let longestWord = '';

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

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfSpellingChunks} created chunks...`));

Object.keys(spellingIndex).forEach((key, index) => {
    // Unique words
    spellingIndex[key].words = [...new Set(spellingIndex[key].words)];

    fs.writeFileSync(`public/dictionary/spelling/chunk-${key}.json`, JSON.stringify(spellingIndex[key].words));

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfSpellingChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Saving spelling chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

console.log(' ');
console.log(chalk.blue(`Creating winning chunks from ${totalWinningWords} words...`));

let totalAccepted = 0;
let totalTooLong = 0;
let totalTooShort = 0;
let totalBlocked = 0;

let totalWrongLetters = 0;

const winnigIndex = {};
const winningWordsLengths = {};

winningWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    const isWithCorrectLength = key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD && word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD;
    if (!isWithCorrectLength) {
        // Meets it so it's too long
        if (word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
            totalTooLong += 1;
        }

        if (word.length <= MAXIMUM_LENGTH_FOR_A_WINNING_WORD) {
            totalTooShort += 1;
        }

        return;
    }

    const isWordInSpellingDictionary = spellingIndex[key]?.words.includes(word);
    if (!isWordInSpellingDictionary) {
        return;
    }
 
    const hasNotAllowedLetterInWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD.some((notAllowedLetter) => word.includes(notAllowedLetter));
    if (hasNotAllowedLetterInWord) {
        totalWrongLetters += 1;

        return;
    }

    const isBlockedWords = BLOCKED_WORDS.includes(word) || BLOCKED_PARTS.some((blockedPart) => word.includes(blockedPart));
    if (isBlockedWords) {
        totalBlocked += 1;

        return;
    }

    totalAccepted = totalAccepted + 1;

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

const totalRejected = totalWinningWords - totalAccepted;

console.log(' ');
console.log(chalk.blue(`Winning chunks created.`));
// We can't accept words that are present in one dictionary and not in another
console.log(` - accepted words: ${chalk.green(totalAccepted)}`);
console.log(` - rejected words: ${chalk.red(totalRejected)}`);
console.log(`   - too long: ${chalk.red(totalTooLong)}`);
console.log(`   - too short: ${chalk.red(totalTooShort)}`);
console.log(`   - probably a swear word: ${chalk.red(totalBlocked)}`);
console.log(`   - not accepted letters (${LETTERS_NOT_ALLOWED_IN_WINNING_WORD.join(',')}): ${chalk.red(totalWrongLetters)} `);
console.log(' ');
console.log(chalk.blue(`Winning words lengths:`));
Object.keys(winningWordsLengths).sort((a, b) => a - b).forEach((length) => {
    console.log(` - words with ${length} letters: ${chalk.green(winningWordsLengths[length])}`);
});

const catalog = {
    words: 0,
    items: [],
};

const totalNumberOfWinningChunks = Object.keys(winnigIndex).length;

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfWinningChunks} created chunks...`));

Object.keys(winnigIndex).forEach((key, index) => {
    // Unique words
    winnigIndex[key].words = [...new Set(winnigIndex[key].words)];

    fs.writeFileSync(`public/dictionary/winning/chunk-${key}.json`, JSON.stringify(winnigIndex[key].words));

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

fs.writeFileSync(`public/dictionary/catalog.json`, JSON.stringify(catalog));

console.log(' ');
console.log(chalk.blue(`Winning catalog saved!`));

console.log(' ');
console.log(chalk.green('Finished!'));

console.log(' ');
console.log(`Longest indexed word is "${chalk.blue(longestWord)}" it has ${chalk.blue(longestWord.length)} letters.`);
