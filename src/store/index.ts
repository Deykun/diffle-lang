import {
    useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import { RootState } from '@common-types';

import { configureStore  } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';

export const rootReducer = configureStore({
  reducer: {
    game: gameReducer,
  }
});

// export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default rootReducer;
