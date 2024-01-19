import clsx from 'clsx';

import { UPDATE_BLOCK_DAILY } from '@const';

import { useSelector } from '@store';

import useSaveProgressLocally from '@hooks/game/useSaveProgressLocally';

import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'

import IconLoader from '@components/Icons/IconLoader';

import GameServiceMode from './GameServiceMode';

import './Game.scss'

const Game = () => {
    const todayStamp = useSelector((state) => state.game.today);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);

    useSaveProgressLocally();

    if (!wordToGuess) {
        return (<IconLoader className="game-loader" />);
    }

    const isUpdateScreenActive = todayStamp === UPDATE_BLOCK_DAILY;

    // To allow: sessionStorage.setItem('allowDate', '01.01.2000');
    const isUpdateScreenActiveButBypassed = isUpdateScreenActive && sessionStorage.getItem('allowDate') === UPDATE_BLOCK_DAILY;

    if (isUpdateScreenActive && !isUpdateScreenActiveButBypassed) {
        return (
            <GameServiceMode today={todayStamp} />
        );
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
