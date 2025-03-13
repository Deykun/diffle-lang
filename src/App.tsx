import { useEffect } from 'react';

import { Pane as PaneType } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';
import { loadGame } from '@store/gameSlice';

import useAppUpdateIfNeeded from '@hooks/useAppUpdateIfNeeded';
import useLangugeChangeIfNeeded from '@features/routes/hooks/useLangugeChangeIfNeeded';
import useAddTrackersScriptsIfNeeded from '@hooks/useAddTrackersScriptsIfNeeded';
import usePanes from '@features/routes/hooks/usePanes';
import useTrackGlobal from '@hooks/useTrackGlobal';
import useUnlockEasterDaysIfPossible from '@hooks/useUnlockEasterDaysIfPossible';
import useUpdateIfSpecialWord from '@features/specialWords/hooks/useUpdateIfSpecialWord';

import Header from '@components/Header';

import Routes from '@features/routes/components/Routes/Routes';

import CookiesPopup from '@components/Cookies/CookiesPopup';

import Game from '@components/Panes/Game/Game';
import Help from '@components/Panes/Help/Help';
import Settings from '@components/Panes/Settings/Settings';
import Statistics from '@components/Panes/Statistics/Statistics';
import YearSummary from '@components/Panes/YearSummary/YearSummary';
import AboutLanguage from '@components/Panes/AboutLanguage/AboutLanguage';

import Toast from '@components/Toast/Toast';

import './App.scss';

function App() {
  const dispatch = useDispatch();
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);
  const todayStamp = useSelector(state => state.game.today);
  const isErrorLoading = useSelector(state => state.game.isErrorLoading);

  const { pane } = usePanes();

  useEffect(() => {
    dispatch(loadGame());
  }, [dispatch, gameLanguage, gameMode, wordToGuess, todayStamp, isErrorLoading]);

  useAppUpdateIfNeeded();

  useLangugeChangeIfNeeded();

  useUnlockEasterDaysIfPossible();

  useUpdateIfSpecialWord();

  useAddTrackersScriptsIfNeeded();

  useTrackGlobal();

  useEffect(() => {
    const isSavedLightTheme = localStorage.getItem(LOCAL_STORAGE.THEME) === 'light';
    const isNotSavedAndSystemUsesLightTheme = !localStorage.getItem(LOCAL_STORAGE.THEME)
        && window?.matchMedia('(prefers-color-scheme: light)');
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
              <Routes />
              {/* {pane === PaneType.Help && <Help />}
              {pane === PaneType.Game && <Game />}
              {pane === PaneType.Settings && <Settings />}
              {pane === PaneType.Statistics && <Statistics />}
              {pane === PaneType.YearSummary && <YearSummary />}
              {pane === PaneType.AboutLanguage && <AboutLanguage />} */}
          </main>
          <CookiesPopup />
      </div>
  );
}

export default App;
