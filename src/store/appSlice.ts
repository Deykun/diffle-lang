import { createSlice } from '@reduxjs/toolkit'

import { RootAppState } from '@common-types';

import { getInitShouldVibrate, getInitShouldKeyboardVibrate, getInitIsSmallKeyboard, getShouldConfirmEnter } from '@api/getInit';

const initialState: RootAppState = {
    toast: {
        text: '',
        timeoutSeconds: 5,
        toastTime: null,
    },
    shouldVibrate: getInitShouldVibrate(),
    shouldKeyboardVibrate: getInitShouldKeyboardVibrate(),
    isSmallKeyboard: getInitIsSmallKeyboard(),
    shouldConfirmEnter: getShouldConfirmEnter(),
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToast(state, action) {
            const { text = '', timeoutSeconds = 3 } = action.payload;
            const toastTime = (new Date()).getTime();

            state.toast = { text, timeoutSeconds, toastTime };
        },
        clearToast(state) {
            state.toast = { text: '', timeoutSeconds: 3, toastTime: null };
        },
        toggleVibration(state) {
            // Turning off app vibrations turns off keyboard vibration
            const newShouldVibrate = !state.shouldVibrate;
            state.shouldKeyboardVibrate = newShouldVibrate ? getInitShouldKeyboardVibrate() : false;
    

            state.shouldVibrate = newShouldVibrate;
        },
        toggleKeyboardVibration(state) {
            const newShouldKeyboardVibrate = !state.shouldKeyboardVibrate;

            // Turning on keyboard vibrations turns on app vibration
            if (newShouldKeyboardVibrate) {
                state.shouldVibrate = true;
            }

            state.shouldKeyboardVibrate = newShouldKeyboardVibrate;
        },
        toggleKeyboardSize(state) {
            state.isSmallKeyboard = !state.isSmallKeyboard;
        },
        toggleConfirmEnter(state) {
            state.shouldConfirmEnter = !state.shouldConfirmEnter;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase('game/submitAnswer/rejected', (state) => {
            const toastTime = (new Date()).getTime();

            state.toast = { text: 'Nieznany błąd.', timeoutSeconds: 5, toastTime };
          });
      },
})

export const { setToast, clearToast, toggleVibration, toggleKeyboardVibration, toggleKeyboardSize, toggleConfirmEnter } = appSlice.actions;
export default appSlice.reducer;
