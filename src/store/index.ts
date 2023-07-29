// import {
//     useSelector as useReduxSelector,
//     TypedUseSelectorHook,
//   } from 'react-redux';

import { RootState, RootGameState, Affix, UsedLetters } from '@common-types';


// import { combineReducers } from '@reduxjs/toolkit';
import { configureStore  } from '@reduxjs/toolkit';

import gameReducer from './gameSlice';

export const rootReducer = configureStore({
  reducer: {
    game: gameReducer,
  }
});

// export const rootReducer = combineReducers({
//   game: gameReducer,
// });

// export type RootState = ReturnType<typeof rootReducer>

// // We can use RootState type in every file in project
// declare global {
//     type RootState = ReturnType<typeof store.getState>
// }

// // Thanks to that you will have ability to use useSelector hook with state value
// declare module 'react-redux' {
//     interface DefaultRootState extends RootState { }
// }



// export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export default rootReducer;
