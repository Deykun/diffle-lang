import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'
import IconLoader from '@components/Icons/IconLoader';

import getWordToGuess from '@api/getWordToGuess'

import { setWordToGuess } from '@store/gameSlice'

import './Game.scss'

const Game = () => {
  const dispatch = useDispatch();
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  useEffect(() => {
    getWordToGuess().then(word => {
      dispatch(setWordToGuess(word));
    })
  }, [dispatch]);

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
