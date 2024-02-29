import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Pane, RootAppState, RootState, ToastType, CookiesName } from '@common-types';

import {
  getInitPane,
  getInitCookiesSettings,
  getInitShouldVibrate,
  getInitShouldKeyboardVibrate,
  getInitIsSmallKeyboard,
  getInitKeyboardMode,
  getIsEnterSwapped,
  getShouldConfirmEnter,
  getShouldShareWords,
} from '@api/getInit';

export const track = createAsyncThunk(
  'app/track',
  async ({
    name,
    params = {},
  }: {
    name: string,
    params?: {
      [key: string]: string | number
    },
  }, { getState }) => {
    const state = getState() as RootState;

    const isGoogleAnalyticsActive = state.app.cookies[CookiesName.GOOGLE_ANALYTICS];
    if (isGoogleAnalyticsActive) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)?.gtag('event', name, params);
      } catch {
        //
      }
    }
  },
);

const initialState: RootAppState = {
  pane: {
    active: getInitPane(),
    params: {},
  },
  toast: {
    text: '',
    type: ToastType.Default,
    timeoutSeconds: 5,
    toastTime: null,
    params: {},
  },
  cookies: {
    ...getInitCookiesSettings(),
  },
  shouldVibrate: getInitShouldVibrate(),
  shouldKeyboardVibrate: getInitShouldKeyboardVibrate(),
  isSmallKeyboard: getInitIsSmallKeyboard(),
  keyboardQWERTYMode: getInitKeyboardMode(),
  isEnterSwapped: getIsEnterSwapped(),
  shouldConfirmEnter: getShouldConfirmEnter(),
  shouldShareWords: getShouldShareWords(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPane(state, action) {
      const {
        pane: newActive,
        params = {},
      } = action.payload;
      const isCloseAction = state.pane.active === newActive;

      if (isCloseAction) {
        state.pane.active = Pane.Game;
        state.pane.params = {};
      } else {
        state.pane.active = newActive;
        state.pane.params = params;
      }
    },
    setToast(state, action) {
      const {
        type = ToastType.Default, text = '', timeoutSeconds = 3, params = {},
      } = action.payload;
      const toastTime = (new Date()).getTime();

      state.toast = {
        type, text, timeoutSeconds, toastTime, params,
      };
    },
    setCookies(state, action) {
      state.cookies = {
        ...action.payload,
      };
    },
    clearToast(state) {
      state.toast = {
        type: ToastType.Default, text: '', timeoutSeconds: 3, toastTime: null, params: {},
      };
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
    toggleKeyboardQWERTYMode(state, action) {
      state.keyboardQWERTYMode = action.payload;
    },
    toggleEnterSwap(state) {
      state.isEnterSwapped = !state.isEnterSwapped;
    },
    toggleConfirmEnter(state) {
      state.shouldConfirmEnter = !state.shouldConfirmEnter;
    },
    toggleShareWords(state) {
      state.shouldShareWords = !state.shouldShareWords;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('game/submitAnswer/rejected', (state) => {
        const toastTime = (new Date()).getTime();

        state.toast = {
          type: ToastType.Error, text: 'unknownError', timeoutSeconds: 5, toastTime, params: {},
        };
      });
  },
});

export const {
  setPane,
  setToast,
  setCookies,
  clearToast,
  toggleVibration,
  toggleKeyboardVibration,
  toggleKeyboardSize,
  toggleKeyboardQWERTYMode,
  toggleEnterSwap,
  toggleConfirmEnter,
  toggleShareWords,
} = appSlice.actions;
export default appSlice.reducer;
