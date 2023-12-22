import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { RootState, RootGameState, UsedLetters, GameStatus, GameMode } from '@common-types';

import { LOCAL_STORAGE, PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';
import { getNow, getTimeUpdateFromTimeStamp } from '@utils/date';
import {
    getStreak,
    saveStreak,
    getStatistic,
    saveStatistic,
} from '@utils/statistics';
import { getHasSpecialCharacters } from '@utils/normilzeWord';

import { getInitMode } from '@api/getInit';
import getWordReport, { getWordReportForMultipleWords, WordReport } from '@api/getWordReport';

import { setToast } from '@store/appSlice';
import {
    selectIsWon,
    selectIsLost,
    selectGuesses,
    selectWordToGuess,
    selectKeyboardUsagePercentage,
    selectGuessesStatsForLetters,
} from '@store/selectors';

import { SUBMIT_ERRORS, GIVE_UP_ERRORS, ALLOWED_KEYS, WORD_MAXLENGTH, WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

const initialState: RootGameState = {
    mode: getInitMode(),
    today: getNow().stamp,
    wordToGuess: '',
    caretShift: 0,
    wordToSubmit: '',
    status: GameStatus.Unset,
    letters: { correct: {}, incorrect: {}, position: {} },
    guesses: [],
    rejectedWords: [],
    hasLongGuesses: false,
    isProcessing: false,
    lastUpdateTime: 0,
    durationMS: 0,
};

const updatePassedTimeInState = (state: RootGameState) => {
    // Updates are counted after first word
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

export const submitAnswer = createAsyncThunk(
    'game/submitAnswer',
    async (_, { dispatch, getState }) => {
        const state  = getState() as RootState;

        if (state.game.isProcessing) {
            return { isError: true, type: SUBMIT_ERRORS.ALREADY_PROCESSING };
        }

        const isGameEnded = state.game.status !== GameStatus.Guessing;
        if (isGameEnded) {
            return { isError: true, type: SUBMIT_ERRORS.ALREADY_ENDED };
        }

        const wordToSubmit = state.game.wordToSubmit;
        if (wordToSubmit.includes(' ')) {
            dispatch(setToast({ text: 'game.spacesRemoved' }));

            return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
        }

        if (state.game.guesses.some(({ word }) => word === wordToSubmit)) {
            dispatch(setToast({ text: 'game.wordAlreadyUsed' }));

            return { isError: true, type: SUBMIT_ERRORS.ALREADY_SUBMITED };
        }        

        dispatch(gameSlice.actions.setProcessing(true));

        const wordToGuess = state.game.wordToGuess;

        const result = await getWordReport(wordToGuess, wordToSubmit);

        const isWordDoesNotExistError = result.isError && result.type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST;
        if (isWordDoesNotExistError) {
            dispatch(setToast({ text: 'game.isNotInDictionary' }));
        }

        const isWordFetchError = result.isError && result.type === SUBMIT_ERRORS.WORD_FETCH_ERROR;
        if (isWordFetchError) {
            dispatch(setToast({ text: 'common.fetchError' }));
        }

        return result;
    },
);

export const restoreGameState = createAsyncThunk(
    'game/restoreGameState',
    async ({
        wordToGuess, guessesWords = [], rejectedWords = [], lastUpdateTime, durationMS,
    }: { wordToGuess: string, guessesWords: string[], rejectedWords: string[], lastUpdateTime: number, durationMS: number }, { dispatch }) => {
        if (!wordToGuess) {
            return;
        }

        const { hasError, isWon, results, wordsLetters } = await getWordReportForMultipleWords(wordToGuess, guessesWords);

        if (hasError) {
            dispatch(setToast({ text: 'Wystąpił błąd podczas przywracania stanu gry.' }));

            return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
        }

        return {
            isWon,
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
        const state  = getState() as RootState;

        const isInRightModeAndNotEnded = state.game.mode === GameMode.Practice && state.game.status === GameStatus.Guessing;
        const canBeGivenUp = isInRightModeAndNotEnded && state.game.guesses.length > 0;

        if (!canBeGivenUp) {
            dispatch(setToast({ text: 'game.givingUpIsNotPossible', timeoutSeconds: 3 }));

            return rejectWithValue(GIVE_UP_ERRORS.WRONG_MODE);
        }

        localStorage.removeItem(LOCAL_STORAGE.TYPE_PRACTICE);
    },
);

export const saveEndedGame = createAsyncThunk(
    'game/saveEndedGame',
    async (_, { getState }) => {
        const gameLanguage = 'pl';
        const state  = getState() as RootState;
        
        const isWon = selectIsWon(state);
        const isLost = selectIsLost(state);
        const wordToGuess = selectWordToGuess(state);
        const isGameEnded = wordToGuess.length > 0 && (isWon || isLost);
        if (!isGameEnded) {
            return;
        }

        const guesses = selectGuesses(state);

        // Fortunetellers aren't counted
        const isImpossibleWin = isWon && guesses.length === 1;
        if (isImpossibleWin) {
            return;
        }

        const gameMode = state.game.mode;
        const isShort = wordToGuess.length <= PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS;
        const hasSpecialCharacters = getHasSpecialCharacters(wordToGuess);

        const statisticToUpdate = getStatistic({ gameLanguage, gameMode, hasSpecialCharacters, isShort });

        const isAlreadySaved = wordToGuess === statisticToUpdate.lastGame?.word;
        if (isAlreadySaved) {
            return;
        }

        const globalStreakToUpdate = getStreak({ gameLanguage });
        const gameModeToUpdate = getStreak({ gameLanguage, gameMode });

        console.log('gameModeToUpdate', gameModeToUpdate);

        if (isLost) {
            globalStreakToUpdate.streak = 0;
            gameModeToUpdate.streak = 0;
        } else if (isWon) {
            globalStreakToUpdate.streak += 1;
            if (globalStreakToUpdate.streak > globalStreakToUpdate.bestStreak) {
                globalStreakToUpdate.bestStreak = globalStreakToUpdate.streak;
            }

            gameModeToUpdate.streak += 1;
            if (gameModeToUpdate.streak > gameModeToUpdate.bestStreak) {
                gameModeToUpdate.bestStreak = gameModeToUpdate.streak;
            }
        }

        saveStreak({ gameLanguage }, globalStreakToUpdate);
        saveStreak({ gameLanguage, gameMode }, gameModeToUpdate);

        if (!statisticToUpdate.lastGame) {
            statisticToUpdate.lastGame = { word: 'Hey ;)', letters: 0, words: 0, rejectedWords: 0, durationMS: 0 };
        }

        const durationMS = state.game.durationMS;
        const rejectedWords = state.game.rejectedWords.length;

        statisticToUpdate.lastGame.word = wordToGuess;
        statisticToUpdate.lastGame.letters = wordToGuess.length;
        statisticToUpdate.lastGame.words = guesses.length;
        statisticToUpdate.lastGame.rejectedWords = rejectedWords;
        statisticToUpdate.lastGame.durationMS = durationMS;

        if (isLost) {
            statisticToUpdate.totals.lost += 1;
        } else if (isWon) {
            const keyboardUsagePercentage = selectKeyboardUsagePercentage(state);
            const totalGamesStored = statisticToUpdate.totals.won;
            const weightedKeyboardNumerator = (totalGamesStored * statisticToUpdate.letters.keyboardUsed) + keyboardUsagePercentage;
        
            const weightedKeyboarUsagePercentage = weightedKeyboardNumerator > 0 ? Math.round(weightedKeyboardNumerator / (totalGamesStored + 1)) : 0;

            const { words, letters, subtotals } = selectGuessesStatsForLetters(state);

            statisticToUpdate.totals.won += 1;
            statisticToUpdate.totals.letters += letters;
            statisticToUpdate.totals.words += words;
            statisticToUpdate.totals.rejectedWords += rejectedWords;
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
        }

        saveStatistic({ gameLanguage, gameMode, hasSpecialCharacters, isShort }, statisticToUpdate);
    },
);

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameMode(state, action) {
            const gameMode = action.payload;

            state.mode = gameMode;
        },
        setWordToGuess(state, action) {
            const wordToGuess = action.payload;

            state.wordToGuess = wordToGuess;
            state.wordToSubmit = '';
            state.caretShift = 0;
            state.guesses = [];
            state.rejectedWords = [],
            state.status = wordToGuess ? GameStatus.Guessing : GameStatus.Unset;
            state.hasLongGuesses = false;
            state.letters = {
                correct: {},
                incorrect: {},
                position: {},
            }
            state.lastUpdateTime = 0;
            state.durationMS = 0;
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
                -(state.wordToSubmit.length)
            );

            state.caretShift = newCaretShiftClamped;

            updatePassedTimeInState(state);
        },
        letterChangeInAnswer(state, action) {
            const isGameEnded = state.status !== GameStatus.Guessing;
            if (isGameEnded || state.isProcessing) {
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
                    state.wordToSubmit = state.wordToSubmit.substring(0, position - 1) + state.wordToSubmit.substring(position, state.wordToSubmit.length);

                    if (isDelete) {
                        state.caretShift = state.caretShift + 1;
                    }
                }

                state.caretShift = Math.max(state.caretShift, -(state.wordToSubmit.length));
            
                return;
            }

            if (ALLOWED_KEYS.includes(typed)) {
                if (state.wordToSubmit.length > WORD_MAXLENGTH + 1) {
                    return;
                }

                const typedToAdd = typed === 'spacebar' ? ' ' : typed;

                if (state.caretShift === 0) {
                    state.wordToSubmit = state.wordToSubmit + typedToAdd;

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
        builder.addCase(submitAnswer.pending, () => {
            // 
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

            const { isWon, affixes = [], word, wordLetters } = action.payload as WordReport;

            if (isWon) {
                state.status = GameStatus.Won;
            }

            state.wordToSubmit = '';
            state.caretShift = 0;

            state.letters = {
                correct: {
                    ...state.letters.correct,
                    ...wordLetters?.correct,
                },
                incorrect: {
                    ...state.letters.incorrect,
                    ...wordLetters?.incorrect,
                },
                position: {
                    ...state.letters.position,
                    ...wordLetters?.position,
                },
            }

            if (word.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS) {
                state.hasLongGuesses = true;
            }

            state.guesses.push({ word, affixes });

            updatePassedTimeInState(state);
        }).addCase(submitAnswer.rejected, (state) => {
            state.isProcessing = false;
        }).addCase(loseGame.fulfilled, (state) => {
            state.status = GameStatus.Lost;
        }).addCase(loseGame.rejected, () => {
            // 
        }).addCase(restoreGameState.fulfilled, (state, action) => {
            // TODO add timespent restore
            const {
                isWon,
                results,
                rejectedWords = [],
                wordToGuess,
                wordsLetters,
                lastUpdateTime,
                durationMS,
            } = action.payload as {
                isWon: boolean,
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

            if (isWon) {
                state.status = GameStatus.Won;
            } else {
                // Lost games should be removed from restoring
                state.status = GameStatus.Guessing;
            }

            state.wordToGuess = wordToGuess;
            state.guesses = guesses;
            state.rejectedWords = rejectedWords;
            state.lastUpdateTime = lastUpdateTime;
            state.durationMS = durationMS;

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
            }
        })
    },
})

export const { setProcessing, setGameMode, setWordToGuess, setWordToSubmit, setCaretShift, letterChangeInAnswer } = gameSlice.actions;
export default gameSlice.reducer;
