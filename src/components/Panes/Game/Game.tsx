import clsx from 'clsx';

import { useSelector } from '@store';

import useSaveProgressLocally from '@hooks/game/useSaveProgressLocally';

import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'

import IconConstruction from '@components/Icons/IconConstruction';
import IconLoader from '@components/Icons/IconLoader';

import './Game.scss'

const Game = () => {
    const todayStamp = useSelector((state) => state.game.today);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);

    useSaveProgressLocally();

    if (!wordToGuess) {
        return (<IconLoader className="game-loader" />);
    }

    if (todayStamp === '08.01.2024') {
        return (
            <div className={clsx('game', { 'isSmallKeyboard': isSmallKeyboard })}>
                <IconConstruction className="icon-soon" />
                <p>
                    Gra wraca wraz z nowym słowem <strong>09.01.2024</strong>.
                </p>
            </div>
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
