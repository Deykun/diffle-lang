import { useEffect } from 'react'
import clsx from 'clsx';

import { useSelector, useDispatch } from '@store';
import { loadGame } from '@store/gameSlice'

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

    useEffect(() => {
        dispatch(loadGame());
    }, [dispatch, gameMode, wordToGuess, todayStamp]);

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
