import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import getDoesWordExist from '@api/getDoesWordExist';

import { ALLOWED_KEYS } from '@const';

export const submitAnswer = createAsyncThunk(
    'posts/submitAnswer',
    async ({ dispatch, getState }) => {
        const state = getState();
        const wordToSubmit = state.wordToSubmit;

        console.log('wordToSubmit', wordToSubmit);

        const res = await getDoesWordExist(wordToSubmit)

        console.log('res');

        return res;
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

        }).addCase(submitAnswer.fulfilled, (state) => {

        }).addCase(submitAnswer.rejected, (state) => {

        })
    },
})

export const { setWordToGuess, letterChangeInAnswer } = gameSlice.actions
export default gameSlice.reducer