import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import { RootState } from '@common-types';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import appReducer from './appSlice';
import gameReducer from './gameSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  game: gameReducer,
});

export const createStore = (initialState = undefined) => {
  return configureStore({
    preloadedState: initialState,
    reducer: rootReducer,
    // devTools: true,
  });
};

export const store = createStore();

export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch: () => AppDispatch = useReduxDispatch;

export default store;
