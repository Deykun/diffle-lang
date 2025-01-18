import fs from 'fs';
import * as fsExtra from "fs-extra";
import chalk from 'chalk';

import { removeDiacratics, getNormalizedKey } from '../../src/api/helpers';
import { formatLargeNumber } from '../../src/utils/format';

import {
    INITAL_DICTIONARY_STATISTICS,
    MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD,
    MAXIMUM_LENGHT_FOR_A_WORD_IN_ABOUT_LANGUAGE,
    MINIMUM_LENGTH_FOR_A_WINNING_WORD,
    MAXIMUM_LENGTH_FOR_A_WINNING_WORD,
} from '../constants';

import type { EasterDays, Catalog } from '../../src/types.d';
import { GameMode } from '../../src/types.d';

export const getIsRomanNumeral = (word: string) => /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/.test(word.toUpperCase());

export const getIsWordWithSpecialCharacters = (word: string) => removeDiacratics(word) !== word;

const getAllPossibleSubstring = (word: string, substrLength: number) => word.split('').reduce((stack: string[], _, index) => {
    const sub = word.substr(index, substrLength);
    if (sub.length === substrLength) {
        stack.push(sub);
    }

    return stack;
}, []);

export const getWordSubstrings = (word: string) => {
    return [2, 3, 4].reduce((stack, chunkLength) => {
        const firstChunk = word.substr(0, chunkLength);
        if (firstChunk.length === chunkLength) {
            stack.first[chunkLength][firstChunk] = stack.first[chunkLength][firstChunk] ? stack.first[chunkLength][firstChunk] + 1 : 1;
        }

        const lastChunk = word.substr(-chunkLength);
        if (lastChunk.length === chunkLength) {
            stack.last[chunkLength][lastChunk] = stack.last[chunkLength][lastChunk] ? stack.last[chunkLength][lastChunk] + 1 : 1;
        }

        // We ignore 1 start and end letters;
        // abcdefgh -> bcdefghg
        const middleOfTheWord = word.slice(1,-1);

        const middleChunks = getAllPossibleSubstring(middleOfTheWord, chunkLength);

        middleChunks.forEach((chunk) => {
            stack.middle[chunkLength][chunk] = stack.middle[chunkLength][chunk] ? stack.middle[chunkLength][chunk] + 1 : 1;
        });
    
        return stack;
    }, {
        first: {
            2: {},
            3: {},
            4: {},
        },
        middle: {
            2: {},
            3: {},
            4: {},
        },
        last: {
            2: {},
            3: {},
            4: {},
        },
    });
};

export const consoleStatistics = (statistics) => {
    console.log(`Spellchecker:`);
    console.log(` - accepted words: ${chalk.green(formatLargeNumber(statistics.spellchecker.accepted.all))}`);
    console.log(`   - without special characters: ${chalk.green(formatLargeNumber(statistics.spellchecker.accepted.withSpecialCharacters))}`);
    console.log(`   - with special characters: ${chalk.green(formatLargeNumber(statistics.spellchecker.accepted.withoutSpecialCharacters))}`);
    console.log(`   - used in game: ${chalk.green(formatLargeNumber(statistics.spellchecker.accepted.allUsedInGame))}`);
    console.log(' ');
    console.log(`Winning:`);
    console.log(` - accepted words: ${chalk.green(formatLargeNumber(statistics.winning.accepted.all))}`);
    console.log(`   - without special characters: ${chalk.green(formatLargeNumber(statistics.winning.accepted.withSpecialCharacters))}`);
    console.log(`   - with special characters: ${chalk.green(formatLargeNumber(statistics.winning.accepted.withoutSpecialCharacters))}`);
    console.log(` - rejected words: ${chalk.red(formatLargeNumber(statistics.winning.rejected.all))}`);
    console.log(`   - too long: ${chalk.red(formatLargeNumber(statistics.winning.rejected.tooLong))}`);
    console.log(`   - too short: ${chalk.red(formatLargeNumber(statistics.winning.rejected.tooShort))}`);
    console.log(`   - probably a swear word: ${chalk.red(formatLargeNumber(statistics.winning.rejected.censored))}`);

    if (statistics.winning.lettersNotAcceptedInWinningWord.length > 0) {
        console.log(`   - not accepted letters (${statistics.winning.lettersNotAcceptedInWinningWord.join(',')}): ${chalk.red(statistics.winning.rejected.wrongLetters)} `);
    }

    console.log(' ');
}

const incrementValueForStat = (statistics, key) => {
    if (statistics[key]) {
        statistics[key] += 1;
    } else {
        statistics[key] = 1;
    }
}

const getFlatWordleResult = (wordToGuess, wordToCheck) => {
    const {
        green,
        possibleOrange: possibleOrangeFromWordToGuess,
    } = wordToGuess.split('').reduce((stack, letter, index) => {
        if (wordToCheck[index] === letter) {
            stack.green += 1;
        } else {
            stack.possibleOrange.push(letter);
        }

        return stack;
    }, { green: 0, possibleOrange: [] });

    const possibleOrangeFromWordToCheck = wordToCheck.split('').reduce((stack, letter, index) => {
        if (wordToGuess[index] !== letter) {
            stack.push(letter);
        }

        return stack;
    }, []);


    const {
        orange,
    } = possibleOrangeFromWordToGuess.reduce((stack, letter) => {
        const indexToCount = stack.possibleOrange.findIndex((orangeLetter) => letter === orangeLetter);

        if (indexToCount >= 0) {
            stack.possibleOrange[indexToCount] = 'counted';
            stack.orange += 1;
        }

        return stack;
    }, { orange: 0, possibleOrange: possibleOrangeFromWordToCheck });


    const gray = 5 - green - orange;

    return {
        green,
        orange,
        gray,
    }
};

const getMassWordleMassResult = (wordToCheck, words, canShowUpdate = true) => {
    return words.reduce((stack, wordToGuess, index) => {
        const  {
            green,
            orange,
            gray,
        } = getFlatWordleResult(wordToGuess, wordToCheck);

        stack.total += 1;
        stack.green += green;
        stack.orange += orange;
        stack.gray += gray;

        const shouldUpdate = canShowUpdate && index % 80000 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / words.length) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, '0'))}% - Validating Wordle best results - Word "${chalk.cyan(wordToCheck)}" agains "${chalk.cyan(wordToGuess)}"`);
        }

        return stack;
    }, { total: 0, green: 0, orange: 0, gray: 0 });
};

type actionBuildDictionaryParams = {
    LANG: string,
    BLOCKED_WORDS: string[],
    BLOCKED_PARTS: string[],
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD: string[],
    DICTIONARIES: any,
    MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD?: number,
    MAXIMUM_LENGTH_OF_SPELLCHEKER_WORD?: number,
    MAXIMUM_LENGTH_OF_WINNING_WORD?: number,
    EASTER_EGG_DAYS: any,
}

export const actionBuildDictionary = (
    {
        LANG,
        BLOCKED_WORDS,
        BLOCKED_PARTS,
        LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
        DICTIONARIES,
        MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD = MAXIMUM_LENGHT_FOR_A_WORD_IN_ABOUT_LANGUAGE,
        MAXIMUM_LENGTH_OF_SPELLCHEKER_WORD = MAXIMUM_LENGTH_FOR_A_SPELLCHEKER_WORD,
        MAXIMUM_LENGTH_OF_WINNING_WORD = MAXIMUM_LENGTH_FOR_A_WINNING_WORD,
        EASTER_EGG_DAYS: EASTER_EGG_DAYS_FOR_LANG = {},
    },
    spellcheckerWords: string[],
    winningWords: string[],
    frequencyWords?: string[],
) => {
    const easterEggDays: EasterDays = {
        '01.01': {
            type: 'yearStart',
            specialMode: GameMode.SandboxLive,
            emojis: [{
                correct: ['🍾'],
                position: ['🥳', '🎉', '✨', '🥂', '🎊'],
                incorrect: ['🪩', '🗓️'],
                typedKnownIncorrect: ['🧨', '💥', '💃🏻'],
            }],
        },
        '14.02': {
            type: 'valentine',
            specialMode: GameMode.SandboxLive,
            emojis: [{
                correct: ['💚'],
                position: ['💛'],
                incorrect: ['🤍'],
                typedKnownIncorrect: ['❤️'],
            }],
        },
        '01.04': {
            type: 'normal',
            specialMode: GameMode.SandboxLive,
            emojis: [{
                correct: ['🐸'],
                position: ['🐝'],
                incorrect: ['🐨'],
                typedKnownIncorrect: ['🐞'],
            }],
        },
        '31.12': {
            type: 'yearEnd',
            specialMode: GameMode.SandboxLive,
            emojis: [{
                correct: ['🍾'],
                position: ['🥳', '🎉', '✨', '🥂', '🎊'],
                incorrect: ['🪩', '🗓️'],
                typedKnownIncorrect: ['🧨', '💥', '💃🏻'],
            }],
        },
        ...EASTER_EGG_DAYS_FOR_LANG,
    };

    const statistics = INITAL_DICTIONARY_STATISTICS;

    const hasOnlyWordleParam = process.argv.includes('only-wordle');

    if (hasOnlyWordleParam) {
        const wordleWords = spellcheckerWords.filter((word) => word.length === 5 && !getIsRomanNumeral(word));
        
        console.log(`Checking ${chalk.green(wordleWords.length)} words against each other...`);

        const start = (new Date()).getTime();

        const best = wordleWords.map((word, index) => {
            const result = getMassWordleMassResult(word, wordleWords, false);

            const score = {
                max: result.green + result.orange,
                maxGreen: result.green,
                maxOrange: result.orange,
                green1_5: (result.green * 1.5) + result.orange,
                green2_0: (result.green * 2) + result.orange,
            };

            const shouldUpdate = index % 100 === 0;

            if (shouldUpdate) {
                const progressPercent = (index / wordleWords.length) * 100;
                const now = (new Date()).getTime();
                const timeDiffrenceInSeconds = Math.floor((now - start) / 1000);
                const timePerPercentage = timeDiffrenceInSeconds / progressPercent;
                const expectedTimeInSeconds = Math.floor(timePerPercentage * 100);
                const timeLeftSeconds = Math.floor(expectedTimeInSeconds - timeDiffrenceInSeconds);
                const timeLeftMinutes = Math.floor(timeLeftSeconds / 60);
                const timeLeftSecondsToShow = timeLeftSeconds - (timeLeftMinutes * 60);

                const timeStatus = timeDiffrenceInSeconds === 0 ? '' : `- ${timeDiffrenceInSeconds}s passed and ${timeLeftMinutes}m ${timeLeftSecondsToShow}s to finish.`;
    
                console.log(`- ${chalk.green(progressPercent.toFixed(1).padStart(4, '0'))}% - Validating word "${chalk.cyan(word)}" ${timeStatus}`);
            }
            
            return  {
                result,
                word,
                score,
            };
        });

        const now = (new Date()).getTime();
        const inSeconds = Math.floor((now - start) / 1000);

        fs.writeFileSync(`./public/dictionary/${LANG}/info-wordle-best.json`, JSON.stringify({
            meta: {
                inSeconds,
                words: wordleWords.length,
            },
            best: {
                max: best.sort((a, b) => b.score.max - a.score.max).slice(0, 10),
                maxGray: best.sort((a, b) => a.score.max - b.score.max).slice(0, 10),
                maxGreen: best.sort((a, b) => b.score.maxGreen - a.score.maxGreen).slice(0, 10),
                maxOrange: best.sort((a, b) => b.score.maxOrange - a.score.maxOrange).slice(0, 10),
                green1_5: best.sort((a, b) => b.score.green1_5 - a.score.green1_5).slice(0, 10),
                green2_0: best.sort((a, b) => b.score.green2_0 - a.score.green2_0).slice(0, 10),
            }
        }, null, '\t'));

        return;
    }

    // Used to finde the best wordle word
    const wordleWords: string[] = [];

    statistics.winning.lettersNotAcceptedInWinningWord = LETTERS_NOT_ALLOWED_IN_WINNING_WORD;
    statistics.spellchecker.all = spellcheckerWords.length;
    statistics.winning.all = winningWords.length;

    console.log(' ');
    console.log(`Building a new diffle dictionary for ${chalk.yellow(LANG.toUpperCase())}`);

    console.log(` - ${chalk.green(formatLargeNumber(spellcheckerWords.length))} spellchecker words`);
    console.log(` - ${chalk.green(formatLargeNumber(winningWords.length))} winning words`);

    if (winningWords.length < 5000) {
        console.log('');
        console.log(chalk.red('Number of words is very low!!'));
    }

    console.log(' ');
    console.log(chalk.red('Removing dictionaries to genereted the new ones...'));

    fsExtra.emptyDirSync(`./public/dictionary/${LANG}/spelling/`);
    fsExtra.emptyDirSync(`./public/dictionary/${LANG}/winning/`);

    let spellingIndex = {};

    console.log(' ');
    console.log(chalk.blue(`Creating spelling chunks index from ${statistics.spellchecker.all} words...`));

    spellcheckerWords.forEach((rawWord, index) =>  {
        const word = rawWord.trim();
        const key = getNormalizedKey(word, LANG);

        if (key) {
            if (word.length <= MAXIMUM_LENGHT_OF_ABOUT_LANGUAGE_WORD) {
                statistics.spellchecker.accepted.all += 1;

                const isWordleLengthWord = word.length === 5;
                if (isWordleLengthWord) {
                    wordleWords.push(word);

                    word.split('').forEach((letter, index) => {
                        incrementValueForStat(statistics.spellchecker.letters.wordle[index], letter);
                    });
                }

                const wordLength = word.length;
                incrementValueForStat(statistics.spellchecker.accepted.length, wordLength);
    
                const firstLetter = word.at(0);
                incrementValueForStat(statistics.spellchecker.letters.first, firstLetter);
    
                const lastLetter = word.at(-1);
                incrementValueForStat(statistics.spellchecker.letters.last, lastLetter);
    
                // Pizza (z -> inWords +1, common +2)
                [...new Set(word.split(''))].forEach((letter) => {
                    incrementValueForStat(statistics.spellchecker.letters.inWords, letter);
                    
                    if (isWordleLengthWord) {
                        incrementValueForStat(statistics.spellchecker.letters.inWordsWordle, letter);
                    }
                });
    
                word.split('').forEach((letter) => {
                    incrementValueForStat(statistics.spellchecker.letters.common, letter);
                });
    
                const chunks = getWordSubstrings(word);
    
                [2, 3, 4].forEach((chunkLength) => {
                    Object.keys(chunks.first[chunkLength]).forEach((chunk) => {
                        statistics.spellchecker.substrings.first[chunkLength][chunk] = (statistics.spellchecker.substrings.first[chunkLength][chunk] || 0)
                            + (chunks.first[chunkLength][chunk] || 0);
                    });
    
                    Object.keys(chunks.last[chunkLength]).forEach((chunk) => {
                        statistics.spellchecker.substrings.last[chunkLength][chunk] = (statistics.spellchecker.substrings.last[chunkLength][chunk] || 0)
                            + (chunks.last[chunkLength][chunk] || 0);
                    });
    
                    Object.keys(chunks.middle[chunkLength]).forEach((chunk) => {
                        statistics.spellchecker.substrings.middle[chunkLength][chunk] = (statistics.spellchecker.substrings.middle[chunkLength][chunk] || 0)
                            + (chunks.middle[chunkLength][chunk] || 0);
                    });
                })
    
                if (getIsWordWithSpecialCharacters(word)) {
                    statistics.spellchecker.accepted.withSpecialCharacters += 1;
                } else {
                    statistics.spellchecker.accepted.withoutSpecialCharacters += 1;
                }
            }

            if (word.length > MAXIMUM_LENGTH_OF_SPELLCHEKER_WORD) {
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

            statistics.spellchecker.accepted.allUsedInGame += 1;

            const shouldUpdate = index % 40000 === 0;

            if (shouldUpdate) {
                const progressPercent = (index / statistics.spellchecker.all) * 100;

                console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Creating spelling chunks and word stasts... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
            }
        } else {
            statistics.spellchecker.rejected += 1;
        }
    });

    statistics.spellchecker.accepted.allWordleWords = wordleWords.length;

    statistics.spellchecker.letters.first = Object.fromEntries(Object.entries(statistics.spellchecker.letters.first).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.last = Object.fromEntries(Object.entries(statistics.spellchecker.letters.last).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.inWords = Object.fromEntries(Object.entries(statistics.spellchecker.letters.inWords).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.inWordsWordle = Object.fromEntries(Object.entries(statistics.spellchecker.letters.inWordsWordle).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.wordle[0] = Object.fromEntries(Object.entries(statistics.spellchecker.letters.wordle[0]).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.wordle[1] = Object.fromEntries(Object.entries(statistics.spellchecker.letters.wordle[1]).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.wordle[2] = Object.fromEntries(Object.entries(statistics.spellchecker.letters.wordle[2]).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.wordle[3] = Object.fromEntries(Object.entries(statistics.spellchecker.letters.wordle[3]).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.wordle[4] = Object.fromEntries(Object.entries(statistics.spellchecker.letters.wordle[4]).sort((a, b) => b[1] - a[1]));
    statistics.spellchecker.letters.common = Object.fromEntries(Object.entries(statistics.spellchecker.letters.common).sort((a, b) => b[1] - a[1]));

    [2, 3, 4].forEach((chunkLength) => {
        statistics.spellchecker.substrings.first[chunkLength] = Object.fromEntries(
            Object.entries(statistics.spellchecker.substrings.first[chunkLength],
        ).sort((a, b) => b[1] - a[1]).slice(0, 5));
        statistics.spellchecker.substrings.middle[chunkLength] = Object.fromEntries(
            Object.entries(statistics.spellchecker.substrings.middle[chunkLength],
        ).sort((a, b) => b[1] - a[1]).slice(0, 5));
        statistics.spellchecker.substrings.last[chunkLength] = Object.fromEntries(
            Object.entries(statistics.spellchecker.substrings.last[chunkLength],
        ).sort((a, b) => b[1] - a[1]).slice(0, 5));
    })

    const totalNumberOfSpellingChunks = Object.keys(spellingIndex).length;

    console.log(' ');
    console.log(chalk.blue(`Looking for best Wordle starting words from ${ wordleWords.length} words...`));

    const bestWordleWords = wordleWords.map((word) => {
        const uniqueLetters = [...new Set(word.split(''))];
        const areAllLettersUnique = uniqueLetters.length === 5;
        
        const score = {
            // We favor a diverse use of letters
            inWords: areAllLettersUnique ? uniqueLetters.reduce((total, letter) => total + statistics.spellchecker.letters.inWordsWordle[letter], 0) : 0,
            letterPosition: word.split('').reduce((total, letter, index) => total + statistics.spellchecker.letters.wordle[index][letter], 0),
            uniqueLetterPosition: areAllLettersUnique ? word.split('').reduce((total, letter, index) => total + statistics.spellchecker.letters.wordle[index][letter], 0) : 0,
        };

        return {
            word,
            score,
        };
    });

    statistics.spellchecker.wordle.inWords = bestWordleWords.sort((a, b) => b.score.inWords - a.score.inWords).slice(0, 10).map((item) => {
        item.result = getMassWordleMassResult(item.word, wordleWords);

        return item;
    });

    statistics.spellchecker.wordle.letterPosition = bestWordleWords.sort((a, b) => b.score.letterPosition - a.score.letterPosition).slice(0, 10).map((item) => {
        item.result = getMassWordleMassResult(item.word, wordleWords);

        return item;
    });

    statistics.spellchecker.wordle.uniqueLetterPosition = bestWordleWords.sort((a, b) => b.score.uniqueLetterPosition - a.score.uniqueLetterPosition).slice(0, 10).map((item) => {
        item.result = getMassWordleMassResult(item.word, wordleWords);

        return item;
    });

    console.log(' ');
    console.log(chalk.blue(`Saving ${totalNumberOfSpellingChunks} created chunks...`));

    if (!fs.existsSync(`./public/dictionary/${LANG}/spelling`)) {
        fs.mkdirSync(`./public/dictionary/${LANG}/spelling`);
    }

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

    const winnigIndex: {
        [key: string]: {
            key: string,
            words: string[],
        }
    } = {};
    const winningWordsLengths: {
        [length: string]: number,
    } = {};
    const popularityIndex: {
        [key: string]: {
            key: string,
            byWord: {
                [word: string]: number,
            },
        }
    } = {};
    let maxPopularityPosition = 0;

    winningWords.forEach((rawWord, index) => {
        const word = rawWord.trim();
        const key = getNormalizedKey(word, LANG);

        const isWithCorrectLength = key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD && word.length <= MAXIMUM_LENGTH_OF_WINNING_WORD;
        if (!isWithCorrectLength) {
            // Meets it so it's too long
            if (word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
                statistics.winning.rejected.tooLong += 1;
            }

            if (word.length <= MAXIMUM_LENGTH_OF_WINNING_WORD) {
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

        if (getIsRomanNumeral(word)) {
            statistics.winning.rejected.romanNumeral += 1;

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

        const frequencyIndex = frequencyWords?.findIndex((wordToCheck) => wordToCheck === word);

        if (frequencyIndex && frequencyIndex >= 0) {
            const position = frequencyIndex + 1;

            if (position > maxPopularityPosition) {
                maxPopularityPosition = position;
            }

            if (popularityIndex[key]) {
                popularityIndex[key].byWord[word] = position;
            } else {
                popularityIndex[key] = {
                    key,
                    byWord: {
                        [word]: position,
                    },
                };
            }
        }

        const wordLength = word.length;
        winningWordsLengths[wordLength] = winningWordsLengths[wordLength] ? winningWordsLengths[wordLength] + 1 : 1;
        statistics.winning.accepted.length[wordLength] = statistics.winning.accepted.length[wordLength] ? statistics.winning.accepted.length[wordLength] + 1 : 1;

        const shouldUpdate = index % 2500 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / statistics.winning.all) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, '0'))}% - Creating winning chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
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

    const catalog: Catalog = {
        words: 0,
        items: [],
        winningWordsLengths,
        easterEggDays,
        maxPopularityPosition: 0,
    };

    const totalNumberOfWinningChunks = Object.keys(winnigIndex).length;

    console.log(' ');
    console.log(chalk.blue(`Saving ${totalNumberOfWinningChunks} created chunks...`));

    if (!fs.existsSync(`./public/dictionary/${LANG}/winning`)) {
        fs.mkdirSync(`./public/dictionary/${LANG}/winning`);
    }

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

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, '0'))}% - Saving winning chunks... - Chunk "${chalk.cyan(key)}" was saved`);
        }
    });

    const totalNumberOfPopularityChunks = Object.keys(popularityIndex).length;

    console.log(' ');
    console.log(chalk.blue(`Saving ${totalNumberOfWinningChunks} created chunks...`));

    if (!fs.existsSync(`./public/dictionary/${LANG}/popularity`)) {
        fs.mkdirSync(`./public/dictionary/${LANG}/popularity`);
    }

    Object.keys(popularityIndex).forEach((key, index) => {
        fs.writeFileSync(`./public/dictionary/${LANG}/popularity/chunk-${key}.json`, JSON.stringify(popularityIndex[key].byWord));

        const shouldUpdate = index % 200 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / totalNumberOfPopularityChunks) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4, 0))}% - Saving popularity chunks... - Chunk "${chalk.cyan(key)}" was saved`);
        }
    });

    statistics.meta = DICTIONARIES;
    catalog.maxPopularityPosition = maxPopularityPosition;

    fs.writeFileSync(`./public/dictionary/${LANG}/catalog.json`, JSON.stringify(catalog));
    fs.writeFileSync(`./public/dictionary/${LANG}/info.json`, JSON.stringify(statistics, null, '\t'));

    console.log(' ');
    console.log(chalk.blue(`Winning catalog saved!`));

    console.log(' ');
    console.log(chalk.green('Finished!'));
};
