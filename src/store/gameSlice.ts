import { createSlice } from '@reduxjs/toolkit'

import { ALLOWED_KEYS } from '../constants';

const initialState = {
  wordToGuess: '',
  wordToSubmit: '',
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
    submitAnswer() {

    }
  }
})

export const { setWordToGuess, submitAnswer, letterChangeInAnswer } = gameSlice.actions
export default gameSlice.reducer