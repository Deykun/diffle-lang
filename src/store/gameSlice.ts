import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { RootState, RootGameState, UsedLetters, GameStatus, GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';
import { getNow } from '@utils/date';

import { getInitMode } from '@api/getInit';
import getWordReport, { getWordReportForMultipleWords, WordReport } from '@api/getWordReport';

import { setToast } from '@store/appSlice';

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
            dispatch(setToast({ text: 'Usunięto spacje.' }));

            return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
        }

        dispatch(gameSlice.actions.setProcessing(true));

        const wordToGuess = state.game.wordToGuess;

        const result = await getWordReport(wordToGuess, wordToSubmit);

        const isWordDoesNotExistError = result.isError && result.type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST;
        if (isWordDoesNotExistError) {
            dispatch(setToast({ text: 'Brak słowa w słowniku.' }));
        }

        const isWordFetchError = result.isError && result.type === SUBMIT_ERRORS.WORD_FETCH_ERROR;
        if (isWordFetchError) {
            dispatch(setToast({ text: 'Błąd pobierania, spróbuj ponownie.' }));
        }

        return result;
    },
);

export const restoreGameState = createAsyncThunk(
    'game/restoreGameState',
    async ({ wordToGuess, guessesWords = [], rejectedWords = [] }: { wordToGuess: string, guessesWords: string[], rejectedWords: string[] }) => {
        if (!wordToGuess) {
            return;
        }


        const { hasError, isWon, results, wordsLetters } = await getWordReportForMultipleWords(wordToGuess, guessesWords);

        if (hasError) {
            // dispatch(setToast({ text: 'Wystąpił błąd podczas przywracania stanu gry.' }));

            // return { isError: true, type: SUBMIT_ERRORS.HAS_SPACE };
        }

        return {
            isWon,
            results,
            wordToGuess,
            wordsLetters,
            rejectedWords,
        };
    },
);

export const loseGame = createAsyncThunk(
    'game/loseGame',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const state  = getState() as RootState;

        const isInRightModeAndNotEnded = state.game.mode === GameMode.Practice && state.game.status === GameStatus.Guessing;
        const canBeGivenUp = isInRightModeAndNotEnded && state.game.guesses.length > 0;

        console.log({
            canBeGivenUp,
        })

        if (!canBeGivenUp) {
            dispatch(setToast({ text: 'game.givingUpIsNotPossible', timeoutSeconds: 5 }));

            return rejectWithValue(GIVE_UP_ERRORS.WRONG_MODE);
        }

        localStorage.removeItem(LOCAL_STORAGE.TYPE_PRACTICE);

        // Save lost game
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
            }
        },
        setCaretShift(state, action) {
            const letterIndex = action.payload + 1; // First letter (index: 0)
            const newCaretShift = letterIndex - state.wordToSubmit.length;

            const newCaretShiftClamped = Math.max(
                Math.min(newCaretShift, 0),
                -(state.wordToSubmit.length)
            );

            state.caretShift = newCaretShiftClamped;
        },
        letterChangeInAnswer(state, action) {
            const isGameEnded = state.status !== GameStatus.Guessing;
            if (isGameEnded || state.isProcessing) {
                return;
            }

            const typed = action.payload;

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
        }).addCase(submitAnswer.rejected, (state) => {
            state.isProcessing = false;
        }).addCase(loseGame.fulfilled, (state) => {
            state.status = GameStatus.Lost;
        }).addCase(loseGame.rejected, () => {
            // 
        }).addCase(restoreGameState.fulfilled, (state, action) => {
            const {
                isWon,
                results,
                rejectedWords = [],
                wordToGuess,
                wordsLetters,
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

export const { setGameMode, setWordToGuess, setWordToSubmit, setCaretShift, letterChangeInAnswer } = gameSlice.actions;
export default gameSlice.reducer;
