import { createSlice } from '@reduxjs/toolkit'

import { RootAppState } from '@common-types';

import { getInitShouldVibrate } from '@api/getInit';

const initialState: RootAppState = {
    toast: {
        text: '',
        timeoutSeconds: 5,
    },
    shouldVibrate: getInitShouldVibrate(),
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToast(state, action) {
            const { text = '', timeoutSeconds = 5 } = action.payload;

            state.toast = { text, timeoutSeconds };
        },
        clearToast(state) {
            state.toast = { text: '', timeoutSeconds: 5 };
        },
        toggleVibration(state) {
            state.shouldVibrate = !state.shouldVibrate;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase('game/submitAnswer/rejected', (state) => {
            state.toast = { text: 'Nieznany błąd.', timeoutSeconds: 5 };
          });
      },
})

export const { setToast, clearToast, toggleVibration } = appSlice.actions;
export default appSlice.reducer;
