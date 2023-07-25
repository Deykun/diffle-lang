import { useState, useEffect } from 'react'
import './App.scss'

import Header from './components/Header'
import VirualKeyboard from './components/Keyboard/VirualKeyboard'
import Words from './components/Words/Words'

import IconLoader from './components/Icons/IconLoader';

import getDoesWordExist from './actions/getDoesWordExist'
import getWordToGuess from './actions/getWordToGuess'

const App = () => {
  const [wordToGuess, setWordToGuess] = useState('');
  const [wordToSubmit, setWordToSubmit] = useState('');

  // window.getDoesWordExist = getDoesWordExist;
  // window.getWordToGuess = getWordToGuess;

  useEffect(() => {
    getWordToGuess().then(word => {
      setWordToGuess(word);
    })
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <main>
        <Choose>
          <When condition={!wordToGuess}>
            <IconLoader className="app-loader" />
          </When>
          <Otherwise>
              <Words typedWord={wordToSubmit} />
              <h2>{wordToGuess}</h2>
          </Otherwise>
        </Choose>
        <VirualKeyboard value={wordToSubmit} setValue={setWordToSubmit} />
      </main>
    </div>
  )
};

export default App;
