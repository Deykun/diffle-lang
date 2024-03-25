import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  RootState, RootGameState, ToastType, UsedLetters, GameStatus, GameMode,
} from '@common-types';

import {
  WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS,
  SUPPORTED_DICTIONARY_BY_LANG,
  SUBMIT_ERRORS,
  GIVE_UP_ERRORS,
  WORD_MAXLENGTH,
  WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS,
} from '@const';

import {
  getNow,
  getTimeUpdateFromTimeStamp,
} from '@utils/date';
import {
  getLocalStorageKeyForGame,
  getLocalStorageKeyForDailyStamp,
} from '@utils/game';
import {
  getStreak,
  saveStreak,
  getStatistic,
  saveStatistic,
  mergeLettersData,
} from '@utils/statistics';
import { getHasSpecialCharacters } from '@utils/normilzeWord';

import { getInitMode } from '@api/getInit';
import getWordReport, { getWordReportForMultipleWords, WordReport } from '@api/getWordReport';
import getWordToGuess, { getCatalogInfo } from '@api/getWordToGuess';

import { setToast, track } from '@store/appSlice';
import {
  selectIsWon,
  selectIsLost,
  selectGuesses,
  selectWordToGuess,
  selectKeyboardUsagePercentage,
  selectGuessesStatsForLetters,
} from '@store/selectors';

const initialState: RootGameState = {
  language: undefined,
  mode: getInitMode(),
  today: getNow().stamp,
  wordToGuess: '',
  caretShift: 0,
  wordToSubmit: '',
  status: GameStatus.Unset,
  letters: { correct: {}, incorrect: {}, position: {} },
  guesses: [],
  rejectedWords: [],
  easterEggDaysDates: [],
  hasLongGuesses: false,
  isProcessing: false,
  isLoadingGame: false,
  isErrorLoading: false,
  lastUpdateTime: 0,
  durationMS: 0,
  lastWordAddedToStatitstic: '',
};

const resetGame = (state: RootGameState, wordToGuess: string) => {
  state.wordToSubmit = '';
  state.wordToGuess = wordToGuess;
  state.caretShift = 0;
  state.guesses = [];
  state.rejectedWords = [];
  state.easterEggDaysDates = [];
  state.status = wordToGuess ? GameStatus.Guessing : GameStatus.Unset;
  state.hasLongGuesses = false;
  state.letters = {
    correct: {},
    incorrect: {},
    position: {},
  };
  state.isErrorLoading = false;
  state.lastUpdateTime = 0;
  state.durationMS = 0;
};

const updatePassedTimeInState = (state: RootGameState) => {
  // Updates are counted after first word was submited
  if (state.guesses.length === 0) {
    return;
  }

  const {
    now,
    timePassed,
  } = getTimeUpdateFromTimeStamp(state.lastUpdateTime);

  state.lastUpdateTime = now;
  state.durationMS += timePassed;
};

export const resetEasterDays = createAsyncThunk(
  'game/resetEasterDays',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const lang = state.game.language;

    if (lang) {
      const { easterEggDaysDates = [] } = await getCatalogInfo(lang);

      return {
        lang,
        easterEggDaysDates,
      };
    }

    return rejectWithValue(false);
  },
);

export const submitAnswer = createAsyncThunk(
  'game/submitAnswer',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;

    const lang = state.game.language;

    const isLoading = !lang || state.game.isProcessing || state.game.isLoadingGame;

    if (isLoading) {
      return { isError: true, type: SUBMIT_ERRORS.ALREADY_PROCESSING };
    }

    const isGameEnded = state.game.status !== GameStatus.Guessing;
    if (isGameEnded) {
      return { isError: true, type: SUBMIT_ERRORS.ALREADY_ENDED };
    }

    const { wordToSubmit } = state.game;
    if (wordToSubmit.includes(' ')) {
      dispatch(setToast({ text: 'game.spacesRemoved' }));

      return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
    }

    if (state.game.guesses.some(({ word }) => word === wordToSubmit)) {
      dispatch(setToast({ text: 'game.wordAlreadyUsed' }));

      return { isError: true, type: SUBMIT_ERRORS.ALREADY_SUBMITED };
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    dispatch(gameSlice.actions.setProcessing(true));

    const { wordToGuess } = state.game;

    const result = await getWordReport(wordToGuess, wordToSubmit, { lang });

    const isWordDoesNotExistError = result.isError && result.type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST;
    if (isWordDoesNotExistError) {
      dispatch(setToast({ text: 'game.isNotInDictionary' }));

      dispatch(track({ name: `word_${lang}_not_in_dictionary`, params: { word: wordToSubmit } }));
    } else {
      dispatch(track({ name: `word_${lang}_in_dictionary`, params: { word: wordToSubmit } }));
    }

    const isWordFetchError = result.isError && result.type === SUBMIT_ERRORS.WORD_FETCH_ERROR;
    if (isWordFetchError) {
      dispatch(setToast({ type: ToastType.Incorrect, text: 'common.fetchError' }));
    }

    return result;
  },
);

export const restoreGameState = createAsyncThunk(
  'game/restoreGameState',
  async ({
    localStorageKeyForGame,
    gameMode,
    gameLanguage,
    status,
    wordToGuess,
    guessesWords = [],
    rejectedWords = [],
    lastUpdateTime,
    durationMS,
  }: {
    localStorageKeyForGame: string,
    gameMode: GameMode,
    gameLanguage: string,
    status?: GameStatus,
    wordToGuess: string,
    guessesWords: string[],
    rejectedWords: string[],
    lastUpdateTime: number,
    durationMS: number,
  }, { dispatch, rejectWithValue }) => {
    if (!wordToGuess) {
      return;
    }

    const {
      hasError, isWon, results, wordsLetters,
    } = await getWordReportForMultipleWords(wordToGuess, guessesWords, { lang: gameLanguage });

    if (hasError) {
      dispatch(setToast({ type: ToastType.Incorrect, text: 'game.restoreError' }));

      if (localStorageKeyForGame) {
        localStorage.removeItem(localStorageKeyForGame);
      }

      return rejectWithValue(SUBMIT_ERRORS.RESTORING_ERROR);
    }

    const statusToReturn = status ?? (isWon ? GameStatus.Won : GameStatus.Guessing);

    return {
      gameMode,
      status: statusToReturn,
      results,
      wordToGuess,
      wordsLetters,
      rejectedWords,
      lastUpdateTime,
      durationMS,
    };
  },
);

export const loseGame = createAsyncThunk(
  'game/loseGame',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const gameLanguage = state.game.language;
    if (!gameLanguage) {
      return rejectWithValue(GIVE_UP_ERRORS.NO_LANG);
    }

    const gameMode = state.game.mode;

    const localStorageKeyForGame = getLocalStorageKeyForGame({ gameLanguage, gameMode });

    const isDailyMode = gameMode === GameMode.Daily;
    if (isDailyMode) {
      localStorage.removeItem(localStorageKeyForGame);

      return;
    }

    const isPracticeMode = gameMode === GameMode.Practice;
    if (isPracticeMode) {
      const isInRightModeAndNotEnded = state.game.mode === GameMode.Practice && state.game.status === GameStatus.Guessing;
      const canBeGivenUp = isInRightModeAndNotEnded && state.game.guesses.length > 0;

      if (!canBeGivenUp) {
        dispatch(setToast({ text: 'game.givingUpIsNotPossible', timeoutSeconds: 3 }));

        return rejectWithValue(GIVE_UP_ERRORS.WRONG_MODE);
      }

      localStorage.removeItem(localStorageKeyForGame);
    }
  },
);

export const loadGame = createAsyncThunk(
  'game/loadGame',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const wordToGuess = selectWordToGuess(state);
    const gameLanguage = state.game.language;

    if (!gameLanguage) {
      return;
    }

    const isLoadingGameAlready = state.game.isLoadingGame;
    if (!isLoadingGameAlready) {
      return;
    }

    const stateGameMode = state.game.mode;
    const gameMode = stateGameMode;
    const todayStamp = state.game.today;

    if (!wordToGuess) {
      const localStorageKeyForGame = getLocalStorageKeyForGame({ gameLanguage, gameMode });
      const storedState = localStorage.getItem(localStorageKeyForGame);

      const localStorageKeyForDailyStamp = getLocalStorageKeyForDailyStamp({ gameLanguage });
      const lastDailyStamp = localStorage.getItem(localStorageKeyForDailyStamp);

      if (storedState) {
        const {
          wordToGuess: lastWordToGuess = '',
          status,
          guessesWords = [],
          rejectedWords = [],
          lastUpdateTime = 0,
          durationMS = 0,
        } = JSON.parse(storedState);

        const isDailyMode = gameMode === GameMode.Daily;

        const isExpiredDailyGame = isDailyMode && lastDailyStamp !== todayStamp;

        if (lastWordToGuess) {
          if (isExpiredDailyGame) {
            localStorage.removeItem(localStorageKeyForGame);

            if (lastDailyStamp) {
              const isLostGame = guessesWords.length > 0 && !guessesWords.includes(lastWordToGuess);

              if (isLostGame) {
                dispatch(setToast({
                  text: 'game.dailyGameLostToast',
                  params: {
                    dailyStamp: lastDailyStamp,
                    word: lastWordToGuess.toUpperCase(),
                  },
                }));

                /*
                    Stats are saved directly from the state,
                    so we set the state, save the stats, and reset the state.
                */
                await dispatch(restoreGameState({
                  localStorageKeyForGame,
                  gameMode,
                  gameLanguage,
                  status: GameStatus.Lost,
                  wordToGuess: lastWordToGuess,
                  guessesWords,
                  rejectedWords,
                  lastUpdateTime,
                  durationMS,
                }));

                await dispatch(saveEndedGame());
              }

              await getWordToGuess({ gameMode, gameLanguage }).then((word) => {
                dispatch(setWordToGuess(word));
              });

              return;
            }
          }

          await dispatch(restoreGameState({
            localStorageKeyForGame,
            gameMode,
            gameLanguage,
            wordToGuess: lastWordToGuess,
            status,
            guessesWords,
            rejectedWords,
            lastUpdateTime,
            durationMS,
          }));

          return;
        }
      }

      await getWordToGuess({ gameMode, gameLanguage }).then((word) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        dispatch(setWordToGuess(word));
      });
    }
  },
);

export const saveEndedGame = createAsyncThunk(
  'game/saveEndedGame',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;

    const isWon = selectIsWon(state);
    const isLost = selectIsLost(state);
    const wordToGuess = selectWordToGuess(state);
    const isGameEnded = wordToGuess.length > 0 && (isWon || isLost);
    if (!isGameEnded) {
      return rejectWithValue(false);
    }

    const gameLanguage = state.game.language;

    if (!gameLanguage) {
      return rejectWithValue(false);
    }

    const guesses = selectGuesses(state);

    // Fortunetellers aren't counted
    const isImpossibleWin = isWon && guesses.length === 1;
    if (isImpossibleWin) {
      return rejectWithValue(false);
    }

    const gameMode = state.game.mode;
    const isShort = wordToGuess.length <= WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS;
    const hasSpecialCharacters = getHasSpecialCharacters(wordToGuess);

    const statisticToUpdate = getStatistic({
      gameLanguage, gameMode, hasSpecialCharacters, isShort,
    });

    const isAlreadySaved = wordToGuess === statisticToUpdate.lastGame?.word;
    if (isAlreadySaved) {
      return rejectWithValue(false);
    }

    const globalStreakToUpdate = getStreak({ gameLanguage });
    const gameModeToUpdate = getStreak({ gameLanguage, gameMode });

    const streakKeyToIncrease = isWon ? 'wonStreak' : 'lostStreak';
    const streakKeyForRecord = isWon ? 'bestStreak' : 'worstStreak';
    const streakKeyToReset = isWon ? 'lostStreak' : 'wonStreak';

    globalStreakToUpdate[streakKeyToReset] = 0;
    gameModeToUpdate[streakKeyToReset] = 0;

    globalStreakToUpdate[streakKeyToIncrease] += 1;
    if (globalStreakToUpdate[streakKeyToIncrease] > globalStreakToUpdate[streakKeyForRecord]) {
      globalStreakToUpdate[streakKeyForRecord] = globalStreakToUpdate[streakKeyToIncrease];
    }

    gameModeToUpdate[streakKeyToIncrease] += 1;
    if (gameModeToUpdate[streakKeyToIncrease] > gameModeToUpdate[streakKeyForRecord]) {
      gameModeToUpdate[streakKeyForRecord] = gameModeToUpdate[streakKeyToIncrease];
    }

    saveStreak({ gameLanguage }, globalStreakToUpdate);
    saveStreak({ gameLanguage, gameMode }, gameModeToUpdate);

    if (!statisticToUpdate.lastGame) {
      statisticToUpdate.lastGame = {
        word: 'Hey ;)', letters: 0, words: 0, rejectedWords: 0, durationMS: 0,
      };
    }

    const { durationMS } = state.game;
    const rejectedWords = state.game.rejectedWords.length;

    statisticToUpdate.lastGame.word = wordToGuess;
    statisticToUpdate.lastGame.letters = wordToGuess.length;
    statisticToUpdate.lastGame.words = guesses.length;
    statisticToUpdate.lastGame.rejectedWords = rejectedWords;
    statisticToUpdate.lastGame.durationMS = durationMS;

    const todayStamp = state.game.today;

    if (isLost) {
      statisticToUpdate.totals.lost += 1;
      dispatch(track({ name: `lost_${gameLanguage}_${gameMode}`, params: { timeStamp: todayStamp, wordToGuess, words: guesses.length } }));
    } else if (isWon) {
      const keyboardUsagePercentage = selectKeyboardUsagePercentage(state);
      const totalGamesStored = statisticToUpdate.totals.won;
      const weightedKeyboardNumerator = (totalGamesStored * statisticToUpdate.letters.keyboardUsed) + keyboardUsagePercentage;

      const weightedKeyboarUsagePercentage = weightedKeyboardNumerator > 0
        ? Math.round(weightedKeyboardNumerator / (totalGamesStored + 1))
        : 0;

      const { words, letters, subtotals } = selectGuessesStatsForLetters(state);

      statisticToUpdate.totals.won += 1;
      statisticToUpdate.totals.letters += letters;
      statisticToUpdate.totals.words += words;
      statisticToUpdate.totals.rejectedWords += rejectedWords;

      if (statisticToUpdate.medianData.rejectedWords[rejectedWords]) {
        statisticToUpdate.medianData.rejectedWords[rejectedWords] += 1;
      } else {
        statisticToUpdate.medianData.rejectedWords[rejectedWords] = 1;
      }

      statisticToUpdate.totals.durationMS += durationMS;

      if (statisticToUpdate.medianData.letters[letters]) {
        statisticToUpdate.medianData.letters[letters] += 1;
      } else {
        statisticToUpdate.medianData.letters[letters] = 1;
      }

      if (statisticToUpdate.medianData.words[words]) {
        statisticToUpdate.medianData.words[words] += 1;
      } else {
        statisticToUpdate.medianData.words[words] = 1;
      }

      statisticToUpdate.letters.keyboardUsed = weightedKeyboarUsagePercentage;
      statisticToUpdate.letters.correct += subtotals.correct;
      statisticToUpdate.letters.position += subtotals.position;
      statisticToUpdate.letters.incorrect += subtotals.incorrect;
      statisticToUpdate.letters.typedKnownIncorrect += subtotals.typedKnownIncorrect;

      const [firstWord, secondWord] = guesses;

      if (!statisticToUpdate.firstWord) {
        statisticToUpdate.firstWord = { letters: 0 };
      }

      statisticToUpdate.firstWord.letters += firstWord.word.length;

      if (!statisticToUpdate.secondWord) {
        statisticToUpdate.secondWord = { letters: 0 };
      }

      statisticToUpdate.secondWord.letters += secondWord.word.length;

      dispatch(track({
        name: `won_${gameLanguage}_${gameMode}`,
        params: {
          timeStamp: todayStamp,
          wordToGuess,
          words,
          letters,
        },
      }));
    }

    saveStatistic({
      gameLanguage, gameMode, hasSpecialCharacters, isShort,
    }, statisticToUpdate);

    return true;
  },
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameLanguage(state, action) {
      const hadGameLanguageSetEarilier = !!state.language;

      state.language = action.payload;

      if (hadGameLanguageSetEarilier) {
        state.mode = GameMode.Daily;
      }

      resetGame(state, '');
    },
    setGameMode(state, action) {
      const gameMode = action.payload;

      state.mode = gameMode;
    },
    setWordToGuess(state, action) {
      const wordToGuess = action.payload;

      resetGame(state, wordToGuess);
    },
    setWordToSubmit(state, action) {
      const wordToSubmit = action.payload;
      state.wordToSubmit = wordToSubmit;

      state.status = wordToSubmit ? GameStatus.Guessing : GameStatus.Unset;
      state.wordToSubmit = '';
      state.caretShift = 0;

      state.letters = {
        correct: { },
        incorrect: { },
        position: { },
      };
    },
    setCaretShift(state, action) {
      const letterIndex = action.payload + 1; // First letter (index: 0)
      const newCaretShift = letterIndex - state.wordToSubmit.length;

      const newCaretShiftClamped = Math.max(
        Math.min(newCaretShift, 0),
        -(state.wordToSubmit.length),
      );

      state.caretShift = newCaretShiftClamped;

      updatePassedTimeInState(state);
    },
    letterChangeInAnswer(state, action) {
      const gameLanguage = state.language;
      const isGameEnded = state.status !== GameStatus.Guessing;
      if (isGameEnded || state.isProcessing || !gameLanguage) {
        return;
      }

      updatePassedTimeInState(state);

      const typed = action.payload;

      if (typed === 'arrowup' || typed === 'arrowdown') {
        if (state.guesses.length > 0) {
          const currentWordToSubmit = state.wordToSubmit;
          const currentWordIndexInGuesses = currentWordToSubmit === ''
            ? state.guesses.length
            : state.guesses.findIndex(({ word }) => word === currentWordToSubmit);

          const hasWordToSet = currentWordIndexInGuesses >= 0;
          if (!hasWordToSet) {
            return;
          }

          const shiftIncrease = typed === 'arrowup' ? -1 : 1;
          const targetIndex = currentWordIndexInGuesses + shiftIncrease;
          const shouldRemoveWord = state.guesses.length === targetIndex;

          state.caretShift = 0;

          if (shouldRemoveWord) {
            state.wordToSubmit = '';
          } else if (state.guesses[targetIndex]) {
            const { word } = state.guesses[targetIndex];

            if (word) {
              state.wordToSubmit = word;
            }
          }
        }

        return;
      }

      if (typed === 'arrowleft') {
        state.caretShift = Math.max(state.caretShift - 1, -(state.wordToSubmit.length));

        return;
      }

      if (typed === 'arrowright') {
        state.caretShift = Math.min(state.caretShift + 1, 0);

        return;
      }

      if (typed === 'backspace' || typed === 'delete') {
        const isDelete = typed === 'delete';

        if (state.caretShift === 0) {
          if (isDelete) {
            // End reached
            return;
          }

          state.wordToSubmit = state.wordToSubmit.slice(0, -1);
        } else {
          const deleteModificator = isDelete ? 1 : 0;

          const position = state.wordToSubmit.length + state.caretShift + deleteModificator;
          state.wordToSubmit = state.wordToSubmit.substring(0, position - 1)
            + state.wordToSubmit.substring(position, state.wordToSubmit.length);

          if (isDelete) {
            state.caretShift += 1;
          }
        }

        state.caretShift = Math.max(state.caretShift, -(state.wordToSubmit.length));

        return;
      }

      const { allowedKeys = [], maxWordLength: maxWordLengthForLanguage } = SUPPORTED_DICTIONARY_BY_LANG[gameLanguage] || {};

      if (allowedKeys.includes(typed)) {
        const maxwordLengt = maxWordLengthForLanguage || WORD_MAXLENGTH;
        if (state.wordToSubmit.length > maxwordLengt - 1) {
          return;
        }

        const typedToAdd = typed === 'spacebar' ? ' ' : typed;

        if (state.caretShift === 0) {
          state.wordToSubmit += typedToAdd;

          return;
        }

        const position = state.wordToSubmit.length + state.caretShift; // caretShift is negative

        state.wordToSubmit = `${state.wordToSubmit.slice(0, position)}${typedToAdd}${state.wordToSubmit.slice(position)}`;
      }
    },
    setProcessing(state, action) {
      state.isProcessing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetEasterDays.pending, (state) => {
      state.easterEggDaysDates = [];
    }).addCase(resetEasterDays.fulfilled, (state, action) => {
      const {
        lang,
        easterEggDaysDates,
      } = action.payload;

      if (state.language === lang) {
        state.easterEggDaysDates = easterEggDaysDates;
      }
    }).addCase(resetEasterDays.rejected, (state) => {
      state.easterEggDaysDates = [];
    }).addCase(submitAnswer.fulfilled, (state, action) => {
      state.isProcessing = false;

      const { isError } = action.payload;

      if (isError) {
        const { type } = action.payload;

        if (type === SUBMIT_ERRORS.HAS_SPACE) {
          state.wordToSubmit = state.wordToSubmit.replaceAll(' ', '');
          state.caretShift = 0;

          return;
        }

        if (type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST) {
          if (!state.rejectedWords.includes(state.wordToSubmit)) {
            state.rejectedWords.push(state.wordToSubmit);
          }

          return;
        }

        return;
      }

      const {
        isWon, affixes = [], word, wordLetters,
      } = action.payload as WordReport;

      if (isWon) {
        state.status = GameStatus.Won;
      }

      state.wordToSubmit = '';
      state.caretShift = 0;

      state.letters = {
        correct: mergeLettersData(state.letters.correct, wordLetters?.correct),
        incorrect: mergeLettersData(state.letters.incorrect, wordLetters?.incorrect),
        position: mergeLettersData(state.letters.position, wordLetters?.position),
      };

      if (word.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS) {
        state.hasLongGuesses = true;
      }

      state.guesses.push({ word, affixes });

      updatePassedTimeInState(state);
    }).addCase(submitAnswer.rejected, (state) => {
      state.isProcessing = false;
    }).addCase(loseGame.fulfilled, (state) => {
      state.status = GameStatus.Lost;
    })
      .addCase(loseGame.rejected, () => {
      //
      })
      .addCase(loadGame.pending, (state) => {
        state.isLoadingGame = true;
      })
      .addCase(loadGame.fulfilled, (state) => {
        state.isLoadingGame = false;
      })
      .addCase(restoreGameState.rejected, (state) => {
        resetGame(state, '');

        state.isErrorLoading = true;
      })
      .addCase(restoreGameState.fulfilled, (state, action) => {
        const {
          gameMode,
          status = GameStatus.Guessing,
          results,
          rejectedWords = [],
          wordToGuess,
          wordsLetters,
          lastUpdateTime,
          durationMS,
        } = action.payload as {
          gameMode: GameMode,
          status: GameStatus,
          results: WordReport[],
          rejectedWords: string[],
          wordToGuess: string,
          wordsLetters: {
            correct: UsedLetters,
            incorrect: UsedLetters,
            position: UsedLetters,
          },
          lastUpdateTime: number,
          durationMS: number,
        };

        const guesses = results.map(({ word = '', affixes = [] }) => ({
          word,
          affixes,
        }));

        state.mode = gameMode;
        state.status = status;
        state.wordToGuess = wordToGuess;
        state.guesses = guesses;
        state.rejectedWords = rejectedWords;
        state.hasLongGuesses = guesses.some(({ word }) => word.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS);
        state.lastUpdateTime = lastUpdateTime;
        state.durationMS = durationMS;
        state.isErrorLoading = false;

        state.letters = {
          correct: {
            ...wordsLetters?.correct,
          },
          incorrect: {
            ...wordsLetters?.incorrect,
          },
          position: {
            ...wordsLetters?.position,
          },
        };
      })
      .addCase(saveEndedGame.fulfilled, (state) => {
        state.lastWordAddedToStatitstic = state.wordToGuess;
      });
  },
});

export const {
  setProcessing,
  setGameLanguage,
  setGameMode,
  setWordToGuess,
  setWordToSubmit,
  setCaretShift,
  letterChangeInAnswer,
} = gameSlice.actions;
export default gameSlice.reducer;
