import { useEffect } from 'react'
import './App.scss'

import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header'
import UserKeyboardListner from '@components/Keyboard/UserKeyboardListner'
import VirualKeyboard from '@components/Keyboard/VirualKeyboard'
import Words from '@components/Words/Words'

import IconLoader from '@components/Icons/IconLoader';

import getWordToGuess from '@api/getWordToGuess'

import { setWordToGuess } from '@store/gameSlice'
import Toast from '@components/Toast/Toast';

const App = () => {
  const dispatch = useDispatch();
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  useEffect(() => {
    getWordToGuess().then(word => {
      dispatch(setWordToGuess(word));
    })
  }, [dispatch]);

  return (
    <div className="wrapper" data-word-to-guess={wordToGuess}>
      <Header />
      <main>
        <Toast />
        <Choose>
          <When condition={!wordToGuess}>
            <IconLoader className="app-loader" />
          </When>
          <Otherwise>
              <Words />
          </Otherwise>
        </Choose>
        <UserKeyboardListner />
        <VirualKeyboard />
      </main>
    </div>
  )
};

export default App;
