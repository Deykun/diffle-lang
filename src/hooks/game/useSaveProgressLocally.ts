import { useEffect } from 'react';

import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';

import { useSelector } from '@store';

import useEffectChange from "@hooks/useEffectChange";


function useSaveProgressLocally() {
    const gameMode = useSelector(state => state.game.mode);
    const todayStamp = useSelector(state => state.game.today);
    const wordToGuess = useSelector(state => state.game.wordToGuess);
    const guesses = useSelector(state => state.game.guesses);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, gameMode);
        localStorage.setItem(LOCAL_STORAGE.LAST_DAILY_STAMP, todayStamp);
    }, [gameMode, todayStamp]);

    useEffectChange(() => {
        const guessesWords = guesses.map(({ word }) => word);

        const recoveryState = {
            wordToGuess,
            guessesWords,
        };

        localStorage.setItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode], JSON.stringify(recoveryState));
    }, [wordToGuess, guesses]);
}

export default useSaveProgressLocally;
