import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane } from '@common-types';

import { useSelector } from '@store';
import { selectIsGameEnded } from '@store/selectors';

import usePanes from '@hooks/usePanes';

import IconClose from '@components/Icons/IconClose';
import IconHelp from '@components/Icons/IconHelp';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayers from '@components/Icons/IconLayers';

import SharedContent from '@components/Share/SharedContent';

import './Header.scss';



const Header = () => {
    const [shouldShowShared, setShouldShowShared] = useState(false);
    const gameLanguage = useSelector((state) => state.game.language);
    const isGameEnded = useSelector(selectIsGameEnded);
    const wordToGuess = useSelector(state => state.game.wordToGuess);
    const gameMode = useSelector(state => state.game.mode);
    const guesses = useSelector((state) => state.game.guesses);

    const { t } = useTranslation();

    const { pane, changePane } = usePanes();

    useEffect(() => {
      if (wordToGuess) {
        setShouldShowShared(true);
      }
    }, [wordToGuess]);

    const isQuiteBadGameShouldHintHelp = pane === Pane.Game && guesses.length >= 8 && !isGameEnded;

    return (
        <header className="header">
            <div className="header-left">
                <button
                  className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-left', {
                    'button-active': pane === Pane.Help,
                    'has-tooltip-activated': isQuiteBadGameShouldHintHelp,
                  })}
                  onClick={() => changePane(Pane.Help)}
                >
                    {pane === Pane.Help ? <IconClose /> : <IconHelp />}
                    <span className="tooltip">
                      {t(pane === Pane.Help ? 'common.close' : (isQuiteBadGameShouldHintHelp ? 'help.howToPlayTitle' : 'help.title'))}
                    </span>
                </button>
            </div>
            <h1>
              <button onClick={() => changePane(Pane.Game)}>
                Diffle{gameMode === GameMode.Practice && <IconInfinity />}
                {gameLanguage && <img key={gameLanguage} className="header-flag" src={`/flags/${gameLanguage}.svg`} alt={gameLanguage} /> }
              </button>
            </h1>
            <div className="header-right">
                {shouldShowShared && <SharedContent />}
                <button
                  className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-right', {
                    'button-active': pane === Pane.Settings
                  })}
                  onClick={() => changePane(Pane.Settings)}
                >
                    {pane === Pane.Settings ? <IconClose /> : <IconLayers />}
                    <span className="tooltip">{t(pane === Pane.Settings ? 'common.close' : 'settings.title')}</span>
                </button>
            </div>
        </header>
    )
};

export default Header;
