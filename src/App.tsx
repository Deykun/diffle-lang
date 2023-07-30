import { useCallback, useState } from 'react';
import { useSelector } from '@store';

import Header from '@components/Header'

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Toast from '@components/Toast/Toast';

import './App.scss'
import Summary from '@components/Panes/Summary/Summary';

const App = () => {
  const [pane, setPane] = useState('game');
  const wordToGuess = useSelector((state) => state.game.wordToGuess);

  const handlePaneChange = useCallback((pickedPane: string) => {
    const isClose = pickedPane === pane;

    setPane(isClose ? 'game' : pickedPane);
  }, [pane]);

  return (
    <div className="wrapper" data-word-to-guess-for-cheaters={wordToGuess}>
      <Header pane={pane} changePane={handlePaneChange} />
      <main>
        <Toast />
        {pane === 'help' && <Help changePane={handlePaneChange} />}
        {pane === 'game' && <Game />}
        {pane === 'summary' && <Summary />}
      </main>
    </div>
  )
};

export default App;
