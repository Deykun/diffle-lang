import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import getDoesWordExist from '@api/getDoesWordExist';
import compareWords from '@api/compareWords';

import { ALLOWED_KEYS } from '@const';

console.log('getDoesWordExist', getDoesWordExist);

export const submitAnswer = createAsyncThunk(
    'game/submitAnswer',
    async (_, { getState }) => {
        const state = getState();
        const wordToGuess = state.game.wordToGuess;
        const wordToSubmit = state.game.wordToSubmit;

        const doesWordExist = await getDoesWordExist(wordToSubmit);

        if (!doesWordExist) {
            return { wasSubmited: false, doesWordExist: false };
        }

        const result = compareWords(wordToGuess, wordToSubmit);

        return { wasSubmited: true, doesWordExist: true, result };
    },
);

const initialState = {
    wordToGuess: '',
    wordToSubmit: '',
    usedLetters: {},
    submited: [],
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
            const { wasSubmited, doesWordExist, result } = action.payload;

            if (!wasSubmited) {
                return;
            }

            console.log(action.payload);
            console.log(result);
            console.log(result.pattern);


        }).addCase(submitAnswer.rejected, (state) => {
            console.log('rej');
        })
    },
})

export const { setWordToGuess, letterChangeInAnswer } = gameSlice.actions
export default gameSlice.reducer