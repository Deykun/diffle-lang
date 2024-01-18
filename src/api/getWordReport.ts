import { Affix, AffixStatus, UsedLetters } from '@common-types';

import { SUBMIT_ERRORS } from '@const';

import getDoesWordExist, { DoesWordExistErrorType } from '@api/getDoesWordExist';

import compareWords from '@api/utils/compareWords';

export interface PatternReport {
    affixes: Affix[],
    wordLetters: {
        correct: UsedLetters,
        incorrect: UsedLetters,
        position: UsedLetters,
    },
    current?: Affix
}

export const temporaryTranslatorPatterns = (word: string, pattern: number[]): PatternReport => {
    const letters = Array.from(word);
    const length = pattern.length;

    const { affixes, wordLetters } = pattern.reduce((stack: PatternReport, value: number, index: number) => {
        const letter = letters[index];
        const { type, text } = stack.current || {};

        const shouldClose = value < 3;

        if (shouldClose) {
            if (type && text) {
                stack.affixes.push({ type, text });
                stack.current = { type: AffixStatus.Unknown, text : '' };    
            }
        }

        if (value === 0) {
            stack.affixes.push({ type: AffixStatus.Incorrect, text: letter });

            stack.wordLetters.incorrect[letter] = true;
        }
        
        if (value === 1) {
            stack.affixes.push({ type: AffixStatus.Position, text: letter });

            stack.wordLetters.position[letter] = true;
        }

        if (value === 2 || value === 3) {
            const { text } = stack.current || {};

            stack.current = ({ type: AffixStatus.Correct, text: `${text}${letter}` });

            stack.wordLetters.correct[letter] = true;
        }

        const isLast = index + 1 === length;

        if (isLast && stack.current?.type) {
            stack.affixes.push(stack.current);
        }

        return stack;
    }, {
        affixes: [],
        wordLetters: {
            correct: {},
            incorrect: {},
            position: {}
        },
        current: { type: AffixStatus.Unknown, text: '' },
    });

    return { affixes, wordLetters };
};


export interface WordReport {
    isError: boolean,
    type?: string,
    isWon: boolean,
    word: string,
    affixes?: Affix[],
    wordLetters?: {
        correct: UsedLetters,
        incorrect: UsedLetters,
        position: UsedLetters,
    },
}

export const getWordReport = async (wordToGuess: string, wordToSubmit: string, { lang }: { lang: string}) => {
    const doesWordExistReport = await getDoesWordExist(wordToSubmit, lang);

    if (doesWordExistReport.isError) {
        if (doesWordExistReport.errorType === DoesWordExistErrorType.Fetch) {
            return { isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_FETCH_ERROR };
        }

        // Too short the same massage as
        return { isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_DOES_NOT_EXIST };
    }

    if (!doesWordExistReport.doesWordExist) {
        return { isError: true, word: wordToSubmit, isWon: false, type: SUBMIT_ERRORS.WORD_DOES_NOT_EXIST };
    }

    const result = compareWords(wordToGuess, wordToSubmit);

    const { pattern, start, end } = result;

    const { affixes, wordLetters } = temporaryTranslatorPatterns(wordToSubmit, pattern);

    if (start) {
        affixes[0].isStart = true;
    }

    if (end) {
        affixes[affixes.length - 1].isEnd = true;
    }

    const isWon = wordToSubmit === wordToGuess;

    return { isError: false, isWon, word: wordToSubmit, result, affixes, wordLetters };
}

export default getWordReport;

export const getWordReportForMultipleWords = async (wordToGuess: string, wordsToSubmit: string[], { lang }: { lang: string }) => {
    const response: {
        hasError: boolean,
        isWon: boolean,
        results: WordReport[],
        wordsLetters: {
            correct: UsedLetters,
            incorrect: UsedLetters,
            position: UsedLetters,
        },
    } = {
        hasError: false,
        isWon: false,
        results: [],
        wordsLetters: {
            correct: {},
            incorrect: {},
            position: {},
        },
    };
    
    for (const wordToSubmit of wordsToSubmit) {
        const wordReport = await getWordReport(wordToGuess, wordToSubmit, { lang });

        response.results.push(wordReport);

        response.wordsLetters.correct = {
            ...response.wordsLetters.correct,
            ...wordReport?.wordLetters?.correct
        }

        response.wordsLetters.incorrect = {
            ...response.wordsLetters.incorrect,
            ...wordReport?.wordLetters?.incorrect
        }

        response.wordsLetters.position = {
            ...response.wordsLetters.position,
            ...wordReport?.wordLetters?.position
        }
    }

    response.hasError = response.results.some(({ isError }) => isError === true);
    response.isWon = response.results.some(({ isWon }) => isWon === true);

    return response;
};
