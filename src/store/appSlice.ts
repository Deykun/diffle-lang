import { createSlice } from '@reduxjs/toolkit'

import { Toast } from '@common-types';

export interface AppState {
    toast: Toast,
}

const initialState: AppState = {
    toast: {
        text: '',
        timeoutSeconds: 5,
    },
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
    },
    extraReducers: (builder) => {
        builder
          .addCase('game/submitAnswer/rejected', (state) => {
            state.toast = { text: 'Nieznany błąd.', timeoutSeconds: 5 };
          });
      },
})

export const { setToast, clearToast } = appSlice.actions;
export default appSlice.reducer;
