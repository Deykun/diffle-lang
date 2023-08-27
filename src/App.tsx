import { useEffect, useCallback, useState } from 'react';

import { LOCAL_STORAGE } from '@const';

import { useSelector } from '@store';

import { getInitPane } from '@api/getInit';

import Header from '@components/Header'

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Settings from '@components/Panes/Settings/Settings';

import Toast from '@components/Toast/Toast';

import './App.scss'

const App = () => {
    const [pane, setPane] = useState(getInitPane());
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);

    useEffect(() => {
        const isSavedDarkTheme = localStorage.getItem(LOCAL_STORAGE.THEME) === 'dark';
        const isNotSavedAndSystemUsesDarkTheme = !localStorage.getItem(LOCAL_STORAGE.THEME) && window?.matchMedia('(prefers-color-scheme: dark)');
        const isDarkTheme = isSavedDarkTheme || isNotSavedAndSystemUsesDarkTheme;

        if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handlePaneChange = useCallback((pickedPane: string) => {
        const isClose = pickedPane === pane;

        if (isClose && pickedPane === 'game') {
            return;
        }

        if (shouldVibrate) {
            navigator?.vibrate(150);
        }

        setPane(isClose ? 'game' : pickedPane);
    }, [pane, shouldVibrate]);

    return (
        <div className="wrapper" data-word-to-guess-for-cheaters={wordToGuess}>
            <Header pane={pane} changePane={handlePaneChange} />
            <main>
                <Toast />
                {pane === 'help' && <Help changePane={handlePaneChange} />}
                {pane === 'game' && <Game />}
                {pane === 'settings' && <Settings changePane={handlePaneChange} />}
            </main>
        </div>
    )
};

export default App;
