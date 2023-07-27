import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import getDoesWordExist from '@api/getDoesWordExist';
import compareWords from '@api/compareWords';

import { ALLOWED_KEYS, WORD_MAXLENGTH, WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

const SUBMIT_ERRORS = {
    ALREADY_PROCESSING: 'already_processing',
    ALREADY_WON: 'already_won',
    ALREADY_SUBMITED: 'already_submited',
    HAS_SPACE: 'has_space',
    WORD_DOES_NOT_EXIST: 'word_does_not_exist',
};

export const temporaryTranslatorPatterns = (word, pattern) => {
    const letters = Array.from(word);
    const length = pattern.length;

    const { affixes, wordLetters } = pattern.reduce((stack, value, index) => {
        const letter = letters[index];
        const { current: { type, text } } = stack;

        const shouldClose = value < 3;

        if (shouldClose) {
            if (type && text) {
                stack.affixes.push({ type, text });
                stack.current = { type: '', text : '' };    
            }
        }

        if (value === 0) {
            stack.affixes.push({ type: 'incorrect', text: letter });

            stack.wordLetters.incorrect[letter] = true;
        }
        
        if (value === 1) {
            stack.affixes.push({ type: 'position', text: letter });

            stack.wordLetters.position[letter] = true;
        }

        if (value === 2 || value === 3) {
            const { text } = stack.current;

            stack.current = ({ type: 'correct', text: `${text}${letter}` });

            stack.wordLetters.correct[letter] = true;
        }

        const isLast = index + 1 === length;

        if (isLast && stack.current.type) {
            stack.affixes.push(stack.current);
        }

        return stack;
    }, {
        affixes: [],
        wordLetters: { correct: {}, incorrect: {}, position: {} },
        current: { type: '', text: '' },
    });

    return { affixes, wordLetters };
};

export const submitAnswer = createAsyncThunk(
    'game/submitAnswer',
    async (_, { getState }) => {
        const state = getState();

        if (state.isProcessing) {
            return { isError: true, type: SUBMIT_ERRORS.ALREADY_PROCESSING };
        }

        if (state.isWin) {
            return { isError: true, type: SUBMIT_ERRORS.ALREADY_WON };
        }

        const wordToSubmit = state.game.wordToSubmit;
        if (wordToSubmit.includes(' ')) {
            return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
        }

        const doesWordExist = await getDoesWordExist(wordToSubmit);
        if (!doesWordExist) {
            return { isError: true, type: SUBMIT_ERRORS.WORD_DOES_NOT_EXIST };
        }

        const guesses = state.game.guesses;

        const alreadyTrierd = guesses.some(({ word }) => word === wordToSubmit);
        if (alreadyTrierd) {
            // I haven't decide if that is an error
            // return { isError: true, type: SUBMIT_ERRORS.ALREADY_SUBMITED };
        }

        const wordToGuess = state.game.wordToGuess;

        const result = compareWords(wordToGuess, wordToSubmit);

        const { pattern, start, end } = result;

        const { affixes, wordLetters } = temporaryTranslatorPatterns(wordToSubmit, pattern);

        if (start) {
            affixes[0].isStart = true;
        }

        if (end) {
            affixes[affixes.length - 1].isEnd = true;
        }

        const isWin = wordToSubmit === wordToGuess;

        return { isError: false, isWin, word: wordToSubmit, result, affixes, wordLetters };
    },
);

const initialState = {
    wordToGuess: '',
    wordToSubmit: '',
    isWin: false,
    usedLetters: {},
    letters: { correct: {}, incorrect: {}, position: {} },
    guesses: [],
    hasLongGuesses: false,
    isProcessing: false,
    toast: { text: '', timeoutSeconds: 5 },
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setWordToGuess(state, action) {
            state.wordToGuess = action.payload;
        },
        letterChangeInAnswer(state, action) {
            if (state.isWin || state.isProcessing) {
                return;
            }

            const typed = action.payload;

            if (typed === 'backspace') {
                state.wordToSubmit = state.wordToSubmit.slice(0, -1);
            
                return;
            }

            if (ALLOWED_KEYS.includes(typed)) {
                if (state.wordToSubmit.length >= WORD_MAXLENGTH) {
                    return;
                }

                state.wordToSubmit = state.wordToSubmit + typed;
            }
        },
        clearToast(state) {
            state.toast = { text: '', timeoutSeconds: 2 };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(submitAnswer.pending, (state) => {
            state.isProcessing = true;
        }).addCase(submitAnswer.fulfilled, (state, action) => {
            state.isProcessing = false;

            const { isError } = action.payload;

            if (isError) {
                const { type } = action.payload;

                if (type === SUBMIT_ERRORS.HAS_SPACE) {
                    state.toast = { text: 'Usunięto spacje', timeoutSeconds: 2 };
                    state.wordToSubmit = state.wordToSubmit.replaceAll(' ', '');

                    return;
                }

                if (type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST) {
                    state.toast = { text: 'Brak słowa w słowniku', timeoutSeconds: 3 };

                    return;
                }
                
                return;
            }

            const { isWin, affixes, word, wordLetters } = action.payload;

            state.isWin = isWin;
            state.wordToSubmit = '';

            state.letters = {
                correct: {
                    ...state.letters.correct,
                    ...wordLetters.correct,
                },
                incorrect: {
                    ...state.letters.incorrect,
                    ...wordLetters.incorrect,
                },
                position: {
                    ...state.letters.position,
                    ...wordLetters.position,
                },
            }

            if (word.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS) {
                state.hasLongGuesses = true;
            }

            state.guesses.push({ word, affixes });
        }).addCase(submitAnswer.rejected, (state) => {
            state.isProcessing = false;

            state.toast = { text: 'Nieznany błąd', timeoutSeconds: 3 };
        })
    },
})

export const { setWordToGuess, letterChangeInAnswer, clearToast } = gameSlice.actions
export default gameSlice.reducer