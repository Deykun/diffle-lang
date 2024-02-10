import fs from 'fs';
import * as fsExtra from "fs-extra";
import chalk from 'chalk';

import {
    INITAL_DICTIONARY_STATISTICS,
    MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD,
    MINIMUM_LENGTH_FOR_A_WINNING_WORD,
    MAXIMUM_LENGTH_FOR_A_WINNING_WORD,
} from '../constants.js';

export const removeDiacratics = (word) => word
    .replaceAll('ą', 'a')
    .replaceAll('á', 'a')
    .replaceAll('ć', 'c')
    .replaceAll('č', 'c')
    .replaceAll('ď', 'd')
    .replaceAll('ę', 'e')
    .replaceAll('é', 'e')
    .replaceAll('ě', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ł', 'l')
    .replaceAll('ń', 'n')
    .replaceAll('ň', 'n')
    .replaceAll('ó', 'o')
    .replaceAll('ř', 'r')
    .replaceAll('ś', 's')
    .replaceAll('š', 's')
    .replaceAll('ť', 't')
    .replaceAll('ú', 'u')
    .replaceAll('ů', 'u')
    .replaceAll('ý', 'y')
    .replaceAll('ź', 'z')
    .replaceAll('ż', 'z')
    .replaceAll('ž', 'z');

// TODO: Should work better now Polish special character are aceppted in English.
export const getIsWordValid = (word) => removeDiacratics(word).replace(/[^a-z]/g, '').length === word.length;

export const getIsWordWithSpecialCharacters = (word) => removeDiacratics(word) !== word;

export const getNormalizedKey = (wordRaw, language) => {
    const word = removeDiacratics(wordRaw);

    if (word.length === 2) {
        return '2ch';
    }

    if (word.length < 3) {
        return '';
    }

    if (word.length === 3) {
        return '3ch';
    }

    if (language === 'pl') {
        /* 
            "Nie" means no/not and in Polish you connect those for a lot of words ex:
            nieżyje - not alive, nieładny - not pretty etc.

            "n" has 724 318 words while the second one "p" has 476 009 words and third one "w" has 230 195.
            
            So it gets its own subkey.
        */
        if (word.startsWith('nie')) {
            if (word.length === 4) {
                return `nie1ch`;
            }

            if (word.length === 5) {
                return `nie2ch`;
            }

            return word.slice(0, 6);
        }
    }

    return word.slice(0, 3);
};

export const getWordSubstrings = (word) => {
    return word.split('').reduce((stack, _, index) => {
        const ch2 = word.substr(index, 2);
        if (ch2.length === 2) {
            stack.ch2s.push(ch2);
        }
    
        const ch3 = word.substr(index, 3);
        if (ch3.length === 3) {
            stack.ch3s.push(ch3);
        }
    
        return stack;
    }, { ch2s: [], ch3s: [] });
};

export const consoleStatistics = (statistics) => {
    console.log(`Spellchecker:`);
    console.log(` - accepted words: ${chalk.green(statistics.spellchecker.accepted.all)}`);
    console.log(`   - without special characters: ${chalk.green(statistics.spellchecker.accepted.withSpecialCharacters)}`);
    console.log(`   - with special characters: ${chalk.green(statistics.spellchecker.accepted.withoutSpecialCharacters)}`);
    console.log(' ');
    console.log(`Winning:`);
    console.log(` - accepted words: ${chalk.green(statistics.winning.accepted.all)}`);
    console.log(`   - without special characters: ${chalk.green(statistics.winning.accepted.withSpecialCharacters)}`);
    console.log(`   - with special characters: ${chalk.green(statistics.winning.accepted.withoutSpecialCharacters)}`);
    console.log(` - rejected words: ${chalk.red(statistics.winning.rejected.all)}`);
    console.log(`   - too long: ${chalk.red(statistics.winning.rejected.tooLong)}`);
    console.log(`   - too short: ${chalk.red(statistics.winning.rejected.tooShort)}`);
    console.log(`   - probably a swear word: ${chalk.red(statistics.winning.rejected.censored)}`);

    if (statistics.winning.lettersNotAcceptedInWinningWord.length > 0) {
        console.log(`   - not accepted letters (${statistics.winning.lettersNotAcceptedInWinningWord.join(',')}): ${chalk.red(statistics.winning.rejected.wrongLetters)} `);
    }

    console.log(' ');
}

export const actionBuildDictionary = (
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    },
    spellcheckerWords,
    winningWords,
) => {
    const statistics = INITAL_DICTIONARY_STATISTICS;

    statistics.winning.lettersNotAcceptedInWinningWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD;
    statistics.spellchecker.all = spellcheckerWords.length;
    statistics.winning.all = winningWords.length;

    console.log(' ');
    console.log(chalk.red('Removing dictionaries to genereted the new ones...'));

    fsExtra.emptyDirSync(`./public/dictionary/${LANG}/spelling/`);
    fsExtra.emptyDirSync(`./public/dictionary/${LANG}/winning/`);

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

            if (statistics.spellchecker.letters.first[firstLetter]) {
                statistics.spellchecker.letters.first[firstLetter] += 1;
            } else {
                statistics.spellchecker.letters.first[firstLetter] = 1;
            }

            const lastLetter = word.at(-1);

            if (statistics.spellchecker.letters.last[lastLetter]) {
                statistics.spellchecker.letters.last[lastLetter] += 1;
            } else {
                statistics.spellchecker.letters.last[lastLetter] = 1;
            }

            word.split('').forEach((letters) => {
                if (statistics.spellchecker.letters.occurance[letters]) {
                    statistics.spellchecker.letters.occurance[letters] += 1;
                } else {
                    statistics.spellchecker.letters.occurance[letters] = 1;
                }
            });

            const { ch2s, ch3s } = getWordSubstrings(word);

            ch2s.forEach((substring) => {
                if (statistics.spellchecker.substrings.ch2[substring]) {
                    statistics.spellchecker.substrings.ch2[substring] += 1;
                } else {
                    statistics.spellchecker.substrings.ch2[substring] = 1;
                }
            });

            ch3s.forEach((substring) => {
                if (statistics.spellchecker.substrings.ch3[substring]) {
                    statistics.spellchecker.substrings.ch3[substring] += 1;
                } else {
                    statistics.spellchecker.substrings.ch3[substring] = 1;
                }
            });

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

    statistics.spellchecker.letters.first = Object.fromEntries(Object.entries(statistics.spellchecker.letters.first).sort((a, b) => b[1] - a[1]))
    statistics.spellchecker.letters.last = Object.fromEntries(Object.entries(statistics.spellchecker.letters.last).sort((a, b) => b[1] - a[1]))
    statistics.spellchecker.letters.occurance = Object.fromEntries(Object.entries(statistics.spellchecker.letters.occurance).sort((a, b) => b[1] - a[1]))
    statistics.spellchecker.substrings.ch2 = Object.fromEntries(Object.entries(statistics.spellchecker.substrings.ch2).sort((a, b) => b[1] - a[1]))
    statistics.spellchecker.substrings.ch3 = Object.fromEntries(Object.entries(statistics.spellchecker.substrings.ch3).sort((a, b) => b[1] - a[1]))

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
};
