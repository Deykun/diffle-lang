import { createSlice } from '@reduxjs/toolkit'

import { RootAppState } from '@common-types';

import { getInitShouldVibrate, getInitShouldKeyboardVibrate, getInitIsSmallKeyboard, getShouldConfirmEnter } from '@api/getInit';

const initialState: RootAppState = {
    dataByKey: {
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {

    },
})

export const { setToast, clearToast, toggleVibration, toggleKeyboardVibration, toggleKeyboardSize, toggleConfirmEnter } = appSlice.actions;
export default appSlice.reducer;
