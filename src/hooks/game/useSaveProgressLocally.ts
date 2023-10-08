import { useEffect } from 'react';

import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';

import { useSelector } from '@store';
import { selectWordToGuess, selectHasWordToGuessSpecialCharacters } from '@store/selectors';

import { saveWinIfNeeded } from '@utils/statistics';

import useEffectChange from "@hooks/useEffectChange";


function useSaveProgressLocally() {
    const isWon = useSelector(state => state.game.isWon);
    const gameMode = useSelector(state => state.game.mode);
    const todayStamp = useSelector(state => state.game.today);
    const wordToGuess = useSelector(selectWordToGuess);
    const hasSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);
    const guesses = useSelector(state => state.game.guesses);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, gameMode);
        localStorage.setItem(LOCAL_STORAGE.LAST_DAILY_STAMP, todayStamp);
    }, [gameMode, todayStamp]);

    useEffectChange(() => {
        if (!wordToGuess) {
            localStorage.removeItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);

            return;
        }

        const guessesWords = guesses.map(({ word }) => word);

        const recoveryState = {
            wordToGuess,
            guessesWords,
        };

        localStorage.setItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode], JSON.stringify(recoveryState));
    }, [wordToGuess, guesses]);

    useEffect(() => {
        if (isWon) {
            saveWinIfNeeded({
                gameLanguage: 'pl',
                gameMode,
                hasSpecialCharacters: hasSpecialCharacters,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWon]);
}

export default useSaveProgressLocally;
