import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane } from '@common-types';

import { useSelector } from '@store';
import { selectIsGameEnded } from '@store/selectors';

import usePanes from '@hooks/usePanes';
import useEffectChange from '@hooks/useEffectChange';
import usePrevious from '@hooks/usePrevious';

import IconClose from '@components/Icons/IconClose';
import IconHelp from '@components/Icons/IconHelp';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayers from '@components/Icons/IconLayers';

import LanguagePicker from '@components/Language/LanguagePicker';
import SharedContent from '@components/Share/SharedContent';

import './Header.scss';

const Header = () => {
  const [flagKey, setFlagKey] = useState('');
  const [shouldShowShared, setShouldShowShared] = useState(false);
  const gameLanguage = useSelector(state => state.game.language);
  const isGameEnded = useSelector(selectIsGameEnded);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const gameMode = useSelector(state => state.game.mode);
  const guesses = useSelector(state => state.game.guesses);

  const { t } = useTranslation();

  const { pane, changePane } = usePanes();

  const prevGameLanguage = usePrevious(gameLanguage);

  useEffectChange(() => {
    if (prevGameLanguage && gameLanguage && prevGameLanguage !== gameLanguage) {
      setFlagKey(gameLanguage);
    }
  }, [gameLanguage]);

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
                type="button"
              >
                  {pane === Pane.Help ? <IconClose /> : <IconHelp />}
                  <span className="tooltip">
                      {pane === Pane.Help && t('common.close')}
                      {pane !== Pane.Help && isQuiteBadGameShouldHintHelp && t('help.howToPlayTitle')}
                      {pane !== Pane.Help && !isQuiteBadGameShouldHintHelp && t('help.title')}
                  </span>
              </button>
          </div>
          <h1>
              <button className="header-title" onClick={() => changePane(Pane.Game)} type="button">
                  Diffle
                  {gameMode === GameMode.Practice && <IconInfinity />}
              </button>
              {gameLanguage && (
              <LanguagePicker className="header-language-picker" place="header">
                  <img
                    key={flagKey}
                    className={clsx('header-flag', { 'header-flag--animation': flagKey })}
                    src={`./flags/${flagKey || gameLanguage}.svg`}
                    alt={flagKey || gameLanguage}
                  />
              </LanguagePicker>
              )}
          </h1>
          <div className="header-right">
              {shouldShowShared && <SharedContent />}
              <button
                className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-right', {
                  'button-active': pane === Pane.Settings,
                })}
                onClick={() => changePane(Pane.Settings)}
                type="button"
              >
                  {[Pane.Settings, Pane.Statistics, Pane.AboutLanguage].includes(pane) ? <IconClose /> : <IconLayers />}
                  <span className="tooltip">{t(pane === Pane.Settings ? 'common.close' : 'settings.title')}</span>
              </button>
          </div>
      </header>
  );
};

export default Header;
