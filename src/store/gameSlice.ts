import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { RootState, RootGameState, UsedLetters } from '@common-types';

import { getNow } from '@utils/date';

import { getInitMode } from '@api/getInit';
import getWordReport, { getWordReportForMultipleWords, WordReport } from '@api/getWordReport';

import { setToast } from '@store/appSlice';

import { SUBMIT_ERRORS, ALLOWED_KEYS, WORD_MAXLENGTH, WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

const initialState: RootGameState = {
    mode: getInitMode(),
    today: getNow().stamp,
    wordToGuess: '',
    wordToSubmit: '',
    isWon: false,
    letters: { correct: {}, incorrect: {}, position: {} },
    guesses: [],
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

        if (state.game.isWon) {
            return { isError: true, type: SUBMIT_ERRORS.ALREADY_WON };
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

        return result;
    },
);

export const restoreGameState = createAsyncThunk(
    'game/restoreGameState',
    async ({ wordToGuess, guessesWords = [] }: { wordToGuess: string, guessesWords: string[] }) => {
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
        };
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
            state.guesses = [];
            state.isWon = false;
            state.hasLongGuesses = false;
            state.letters = {
                correct: {},
                incorrect: {},
                position: {},
            }
        },
        setWordToSubmit(state, action) {
            state.wordToSubmit = action.payload;

            state.isWon = false;
            state.wordToSubmit = '';

            state.letters = {
                correct: { },
                incorrect: { },
                position: { },
            }
        },
        letterChangeInAnswer(state, action) {
            if (state.isWon || state.isProcessing) {
                return;
            }

            const typed = action.payload;

            if (typed === 'backspace') {
                state.wordToSubmit = state.wordToSubmit.slice(0, -1);
            
                return;
            }

            if (ALLOWED_KEYS.includes(typed)) {
                if (state.wordToSubmit.length >= WORD_MAXLENGTH) {
                    return;
                }

                state.wordToSubmit = state.wordToSubmit + typed;
            }
        },
        setProcessing(state, action) {
            state.isProcessing = action.payload;
        }
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

                    return;
                }

                if (type === SUBMIT_ERRORS.WORD_DOES_NOT_EXIST) {

                    return;
                }
                
                return;
            }

            const { isWon, affixes = [], word, wordLetters } = action.payload as WordReport;

            state.isWon = isWon;
            state.wordToSubmit = '';

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
        }).addCase(restoreGameState.fulfilled, (state, action) => {
            const {
                isWon,
                results,
                wordToGuess,
                wordsLetters,
            } = action.payload as {
                isWon: boolean,
                results: WordReport[],
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

            state.isWon = isWon;

            state.wordToGuess = wordToGuess;
            state.guesses = guesses;


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

export const { setGameMode, setWordToGuess, setWordToSubmit, letterChangeInAnswer } = gameSlice.actions;
export default gameSlice.reducer;
