import { useEffect } from 'react'

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import useSaveProgressLocally from '@hooks/game/useSaveProgressLocally';

import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'
import IconLoader from '@components/Icons/IconLoader';

import getWordToGuess from '@api/getWordToGuess'

import { setWordToGuess, restoreGameState } from '@store/gameSlice'

import './Game.scss'

const Game = () => {
  const dispatch = useDispatch();
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  useEffect(() => {
    if (!wordToGuess) {
      const storedState = localStorage.getItem(LOCAL_STORAGE.LAST_GAME);
  
      if (storedState) {
            const {
                wordToGuess: lastWordToGuess = '',
                guessesWords = [],
            } = JSON.parse(storedState);

            if (lastWordToGuess) {
                dispatch(restoreGameState({ wordToGuess: lastWordToGuess, guessesWords }));
                
                return;
            }
      }

      getWordToGuess().then(word => {
        dispatch(setWordToGuess(word));  
      });
    }
  }, [dispatch, wordToGuess]);

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
