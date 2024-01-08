import { useEffect } from 'react';

import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';
import { saveEndedGame } from '@store/gameSlice';

import { useDispatch, useSelector } from '@store';
import {
    selectWordToGuess,
} from '@store/selectors';

import useEffectChange from "@hooks/useEffectChange";

function useSaveProgressLocally() {
    const dispatch = useDispatch();
    const gameStatus = useSelector(state => state.game.status);
    const gameMode = useSelector(state => state.game.mode);
    const todayStamp = useSelector(state => state.game.today);
    const lastUpdateTime = useSelector(state => state.game.lastUpdateTime);
    const durationMS = useSelector(state => state.game.durationMS);
    const wordToGuess = useSelector(selectWordToGuess);
    const rejectedWords = useSelector(state => state.game.rejectedWords);
    const guesses = useSelector(state => state.game.guesses);

    useEffect(() => {
        dispatch(saveEndedGame())
    }, [dispatch, gameStatus]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, gameMode);
        localStorage.setItem(LOCAL_STORAGE.LAST_DAILY_STAMP, todayStamp);  
    }, [gameMode, todayStamp]);

    useEffectChange(() => {
        const guessesWords = guesses.map(({ word }) => word);

        const recoveryState = {
            status: gameStatus,
            wordToGuess,
            guessesWords,
            rejectedWords,
            lastUpdateTime,
            durationMS,
        };

        localStorage.setItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode], JSON.stringify(recoveryState));
    }, [wordToGuess, gameStatus, guesses, rejectedWords, durationMS]);
}

export default useSaveProgressLocally;
