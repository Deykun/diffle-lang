import { useState, useEffect } from 'react'
import './App.scss'

import { useDispatch, useSelector } from 'react-redux';

import Header from './components/Header'
import UserKeyboardListner from './components/Keyboard/UserKeyboardListner'
import VirualKeyboard from './components/Keyboard/VirualKeyboard'
import Words from './components/Words/Words'

import IconLoader from './components/Icons/IconLoader';

import getDoesWordExist from './actions/getDoesWordExist'
import getWordToGuess from './actions/getWordToGuess'
import compareWords from './actions/compareWords';

import { setWordToGuess } from './store/gameSlice'

const App = () => {
  const dispatch = useDispatch();
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  useEffect(() => {
    getWordToGuess().then(word => {
      dispatch(setWordToGuess(word));
    })
  }, [dispatch]);

  // const handleSubmit = async (word) => {
  //   const workToCheck = word || wordToSubmit;

  //   const doesWordExist = await getDoesWordExist(workToCheck);

  //   console.log('word sumbited', workToCheck);
    
  //   if (!doesWordExist) {
  //     console.log('Does not');
  //     return;
  //   }
    
  //   const x = compareWords(workToCheck, wordToGuess);

  //   console.log(x);
  // };

  return (
    <div className="wrapper">
      <Header />
      <main>
        <Choose>
          <When condition={!wordToGuess}>
            <IconLoader className="app-loader" />
          </When>
          <Otherwise>
              <Words />
              <h2>{wordToGuess}</h2>
          </Otherwise>
        </Choose>
        <UserKeyboardListner />
        <VirualKeyboard />
      </main>
    </div>
  )
};

export default App;
