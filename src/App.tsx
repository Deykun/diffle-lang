import { useEffect } from 'react';

import { Pane as PaneInterface } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector } from '@store';

import useAppUpdateIfNeeded from '@hooks/useAppUpdateIfNeeded';
import useLangugeChangeIfNeeded from '@hooks/useLangugeChangeIfNeeded';

import Header from '@components/Header'

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Settings from '@components/Panes/Settings/Settings';
import Statistics from '@components/Panes/Statistics/Statistics';

import Toast from '@components/Toast/Toast';

import './App.scss'

const App = () => {
    const pane = useSelector(state => state.app.pane);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);

    useAppUpdateIfNeeded();

    useLangugeChangeIfNeeded();

    useEffect(() => {
        const isSavedLightTheme = localStorage.getItem(LOCAL_STORAGE.THEME) === 'light';
        const isNotSavedAndSystemUsesLightTheme = !localStorage.getItem(LOCAL_STORAGE.THEME) && window?.matchMedia('(prefers-color-scheme: light)');
        const isLightTheme = isSavedLightTheme || isNotSavedAndSystemUsesLightTheme;

        if (isLightTheme) {
            document.documentElement.classList.add('light');
        }

        const isSavedContrastTheme = localStorage.getItem(LOCAL_STORAGE.THEME_CONTRAST) === 'true';
        if (isSavedContrastTheme) {
            document.documentElement.classList.add('contrast');
        }
    }, []);

    return (
        <div className="wrapper" data-word-to-guess-for-cheaters={wordToGuess}>
            <Header />
            <main>
                <Toast />
                {pane === PaneInterface.Help && <Help />}
                {pane === PaneInterface.Game && <Game />}
                {pane === PaneInterface.Settings && <Settings />}
                {pane === PaneInterface.Statistics && <Statistics />}
            </main>
        </div>
    )
};

export default App;
