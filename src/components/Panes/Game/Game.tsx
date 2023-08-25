import { useEffect } from 'react'

import { GameMode } from '@common-types';

import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';

import { useSelector, useDispatch } from '@store';
import { setToast } from '@store/appSlice'
import { setWordToGuess, restoreGameState } from '@store/gameSlice'

import getWordToGuess from '@api/getWordToGuess'

import useSaveProgressLocally from '@hooks/game/useSaveProgressLocally';

import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'
import IconLoader from '@components/Icons/IconLoader';

import './Game.scss'

const Game = () => {
    const dispatch = useDispatch();
    const gameMode = useSelector((state) => state.game.mode);
    const todayStamp = useSelector((state) => state.game.today);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);

    useEffect(() => {
        if (!wordToGuess) {
            const storedState = localStorage.getItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);

            if (storedState) {
                const {
                    wordToGuess: lastWordToGuess = '',
                    guessesWords = [],
                } = JSON.parse(storedState);

                const isDailyMode = gameMode === GameMode.Daily;
                const lastDailyStamp = localStorage.getItem(LOCAL_STORAGE.LAST_DAILY_STAMP);
                const isExpiredDailyGame = isDailyMode && lastDailyStamp !== todayStamp;

                if (isExpiredDailyGame) {
                    localStorage.removeItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);

                    if (lastWordToGuess && lastDailyStamp) {
                        dispatch(setToast({ text: `"${lastWordToGuess.toUpperCase()}" to nieodgadnięte słowo z ${lastDailyStamp}` }));
                    }
                } else {
                    dispatch(restoreGameState({ wordToGuess: lastWordToGuess, guessesWords }));

                    return;
                }
            }

            getWordToGuess({ gameMode }).then(word => {
                dispatch(setWordToGuess(word));
            });
        }
    }, [dispatch, gameMode, todayStamp, wordToGuess]);

    useSaveProgressLocally();

    if (!wordToGuess) {
        return (<IconLoader className="game-loader" />);
    }

    return (
        <div className="game">
            {wordToGuess ? <Words /> : <IconLoader className="game-loader" />}
            <UserKeyboardListner />
            <VirualKeyboard />
        </div>
    )
};

export default Game;
