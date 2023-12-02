import { useEffect } from 'react';

import { GameMode } from '@common-types';
import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';

import { useSelector } from '@store';
import {
    selectIsWon,
    selectIsLost,
    selectWordToGuess,
    selectHasWordToGuessSpecialCharacters,
    selectGuessesStatsForLetters,
    selectKeyboardUsagePercentage,
} from '@store/selectors';

import { saveWinIfNeeded } from '@utils/statistics';

import useEffectChange from "@hooks/useEffectChange";


function useSaveProgressLocally() {
    const isWon = useSelector(selectIsWon);
    const isLost = useSelector(selectIsLost);
    const gameMode = useSelector(state => state.game.mode);
    const todayStamp = useSelector(state => state.game.today);
    const wordToGuess = useSelector(selectWordToGuess);
    const hasSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);
    const rejectedWords = useSelector(state => state.game.rejectedWords);
    const guesses = useSelector(state => state.game.guesses);
    const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
    const keyboardUsagePercentage = useSelector(selectKeyboardUsagePercentage);
    const wasGivenUp = isLost && gameMode === GameMode.Practice;

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, gameMode);
        localStorage.setItem(LOCAL_STORAGE.LAST_DAILY_STAMP, todayStamp);

        if (wasGivenUp) {
            localStorage.removeItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);
        }
    }, [gameMode, wasGivenUp, todayStamp]);

    useEffectChange(() => {        
        if (!wordToGuess || wasGivenUp) {
            localStorage.removeItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);

            return;
        }

        const guessesWords = guesses.map(({ word }) => word);

        const recoveryState = {
            wordToGuess,
            guessesWords,
            rejectedWords,
        };

        localStorage.setItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode], JSON.stringify(recoveryState));
    }, [wordToGuess, guesses, rejectedWords]);

    useEffect(() => {
        if (isWon) {
            saveWinIfNeeded({
                wordToGuess,
                gameLanguage: 'pl',
                gameMode,
                hasSpecialCharacters: hasSpecialCharacters,
                guesses,
                words,
                rejectedWords,
                letters,
                subtotals,
                keyboardUsagePercentage,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWon]);
}

export default useSaveProgressLocally;
