import { useEffect, useCallback, useState } from 'react';

import { Pane as PaneInterface } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector } from '@store';

import { getInitPane } from '@api/getInit';

import useVibrate from '@hooks/useVibrate';

import Header from '@components/Header'

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Settings from '@components/Panes/Settings/Settings';
import Statistics from '@components/Panes/Statistics/Statistics';

import Toast from '@components/Toast/Toast';

import './App.scss'

const App = () => {
    // const [pane, setPane] = useState(getInitPane());
    const [pane, setPane] = useState(PaneInterface.Statistics);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);

    const { vibrate } = useVibrate();

    useEffect(() => {
        const isSavedDarkTheme = localStorage.getItem(LOCAL_STORAGE.THEME) === 'dark';
        const isNotSavedAndSystemUsesDarkTheme = !localStorage.getItem(LOCAL_STORAGE.THEME) && window?.matchMedia('(prefers-color-scheme: dark)');
        const isDarkTheme = isSavedDarkTheme || isNotSavedAndSystemUsesDarkTheme;

        if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handlePaneChange = useCallback((pickedPane: PaneInterface) => {
        const isClose = pickedPane === pane;

        if (isClose && pickedPane === PaneInterface.Game) {
            return;
        }

        vibrate();

        setPane(isClose ? PaneInterface.Game : pickedPane);
    }, [pane, vibrate]);

    return (
        <div className="wrapper" data-word-to-guess-for-cheaters={wordToGuess}>
            <Header pane={pane} changePane={handlePaneChange} />
            <main>
                <Toast />
                {pane === PaneInterface.Help && <Help changePane={handlePaneChange} />}
                {pane === PaneInterface.Game && <Game />}
                {pane === PaneInterface.Settings && <Settings changePane={handlePaneChange} />}
                {pane === PaneInterface.Statistics && <Statistics />}
            </main>
        </div>
    )
};

export default App;
