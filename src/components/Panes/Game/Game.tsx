import { useEffect } from 'react'
import clsx from 'clsx';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE, LOCAL_STORAGE_GAME_BY_MODE } from '@const';

import { useSelector, useDispatch } from '@store';
import { setToast } from '@store/appSlice'
import { setWordToGuess, loadGame } from '@store/gameSlice'

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
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);

    // TODO new recovery will be called here
    useEffect(() => {
        dispatch(loadGame());
    }, [dispatch, gameMode, wordToGuess, todayStamp]);

    // useEffect(() => {
    //     if (!wordToGuess) {
    //         const storedState = localStorage.getItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]) ;

    //         if (storedState) {
    //             const {
    //                 wordToGuess: lastWordToGuess = '',
    //                 guessesWords = [],
    //                 rejectedWords = [],
    //                 lastUpdateTime = 0,
    //                 durationMS = 0,
    //             } = JSON.parse(storedState);

    //             const isDailyMode = gameMode === GameMode.Daily;
    //             const lastDailyStamp = localStorage.getItem(LOCAL_STORAGE.LAST_DAILY_STAMP);
    //             const isExpiredDailyGame = isDailyMode && lastDailyStamp !== todayStamp;

    //             if (isExpiredDailyGame) {
    //                 localStorage.removeItem(LOCAL_STORAGE_GAME_BY_MODE[gameMode]);

    //                 if (lastWordToGuess && lastDailyStamp) {
    //                     const isLostGame = guessesWords.length > 0 && !guessesWords.includes(lastWordToGuess);

    //                     if (isLostGame) {
    //                         dispatch(setToast({ text: `"${lastWordToGuess.toUpperCase()}" to nieodgadnięte słowo z ${lastDailyStamp}` }));
    //                     }
    //                 }
    //             } else {
    //                 dispatch(restoreGameState({ wordToGuess: lastWordToGuess, guessesWords, rejectedWords, lastUpdateTime, durationMS }));

    //                 return;
    //             }
    //         }

    //         getWordToGuess({ gameMode }).then(word => {
    //             dispatch(setWordToGuess(word));
    //         });
    //     }
    // }, [dispatch, gameMode, todayStamp, wordToGuess]);

    useSaveProgressLocally();

    if (!wordToGuess) {
        return (<IconLoader className="game-loader" />);
    }

    return (
        <div className={clsx('game', { 'isSmallKeyboard': isSmallKeyboard })}>
            {wordToGuess ? <Words /> : <IconLoader className="game-loader" />}
            <UserKeyboardListner />
            <VirualKeyboard />
        </div>
    )
};

export default Game;
