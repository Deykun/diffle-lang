import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import getDoesWordExist from '@api/getDoesWordExist';
import compareWords from '@api/compareWords';

import { ALLOWED_KEYS } from '@const';

// type: ('new' | 'correct' | 'position' | 'incorrect'),

export const tempolaryTranslatorPatterns = (word, pattern) => {
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
        const wordToGuess = state.game.wordToGuess;
        const wordToSubmit = state.game.wordToSubmit;

        const doesWordExist = await getDoesWordExist(wordToSubmit);

        if (!doesWordExist) {
            return { wasSubmited: false, doesWordExist: false, word: wordToSubmit };
        }

        const result = compareWords(wordToGuess, wordToSubmit);

        const { pattern, start, end } = result;

        const { affixes, wordLetters } = tempolaryTranslatorPatterns(wordToSubmit, pattern);

        if (start) {
            affixes[0].isStart = true;
        }

        if (end) {
            affixes[affixes.length - 1].isEnd = true;
        }

        return { wasSubmited: true, doesWordExist: true, word: wordToSubmit, result, affixes, wordLetters };
    },
);

const initialState = {
    wordToGuess: '',
    wordToSubmit: '',
    usedLetters: {},
    letters: { correct: {}, incorrect: {}, position: {} },
    submited: [],
    guesses: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setWordToGuess(state, action) {
        state.wordToGuess = action.payload;
        },
        letterChangeInAnswer(state, action) {
        const typed = action.payload;

        if (typed === 'backspace') {
            state.wordToSubmit = state.wordToSubmit.slice(0, -1);
        
            return;
        }

        if (ALLOWED_KEYS.includes(typed)) {
            state.wordToSubmit = state.wordToSubmit + typed;
        }
        },
        // submitAnswer(state, action) {
        // if (!state.wordToSubmit) {
        //     return;
        // }

        // const wordUsedLetters = state.wordToSubmit.split('').reduce((usedLetters, letter) => {
        //     usedLetters[letter] = true;

        //     return usedLetters;
        // }, {});

        // state.usedLetters = {
        //     ...state.usedLetters, 
        //     ...wordUsedLetters,
        // };

        // state.submited.push(state.wordToSubmit);

        // state.wordToSubmit = '';
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(submitAnswer.pending, (state) => {
            console.log('pen');

        }).addCase(submitAnswer.fulfilled, (state, action) => {
            const { wasSubmited, doesWordExist, affixes, result, word, wordLetters } = action.payload;

            if (!wasSubmited) {
                return;
            }

            state.wordToSubmit = '';
            state.submited.push(word);


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

                    // state.submited.push(state.wordToSubmit);


            // state.submited.push(state.wordToSubmit);
            state.guesses.push({ affixes });


        }).addCase(submitAnswer.rejected, (state) => {
            console.log('rej');
        })
    },
})

export const { setWordToGuess, letterChangeInAnswer } = gameSlice.actions
export default gameSlice.reducer