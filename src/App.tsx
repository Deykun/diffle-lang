import './App.scss'

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import Header from '@components/Header'

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Toast from '@components/Toast/Toast';

const App = () => {
  const [pane, setPane] = useState('game');
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  const handlePaneChange = useCallback((pickedPane) => {
    const isClose = pickedPane === pane;

    setPane(isClose ? 'game' : pickedPane);
  }, [pane]);

  return (
    <div className="wrapper" data-word-to-guess={wordToGuess}>
      <Header pane={pane} onPaneChange={handlePaneChange} />
      <main>
        <Toast />
        <Choose>
          <When condition={pane === 'help'}>
            <Help onPaneChange={handlePaneChange} />
          </When>
          <Otherwise>
            <Game />
          </Otherwise>
        </Choose>
      </main>
    </div>
  )
};

export default App;
