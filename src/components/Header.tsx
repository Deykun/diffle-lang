import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';
import { ROOT_PATH } from '@const';

import { useSelector } from '@store';
import { selectIsGameEnded, selectIsTodayEasterDay } from '@store/selectors';

import useEffectChange from '@hooks/useEffectChange';
import usePrevious from '@hooks/usePrevious';

import IconClose from '@components/Icons/IconClose';
import IconEgg from '@components/Icons/IconEgg';
import IconHelp from '@components/Icons/IconHelp';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayers from '@components/Icons/IconLayers';

import LanguagePicker from '@components/Language/LanguagePicker';
import SharedContent from '@components/Share/SharedContent';

import './Header.scss';
import { Link } from 'wouter';
import useLink from '@features/routes/hooks/useLinks';

const Header = () => {
  const { activeLink, getLinkPath } = useLink();
  const [flagKey, setFlagKey] = useState('');
  const [shouldShowShared, setShouldShowShared] = useState(false);
  const isTodayEasterDay = useSelector(selectIsTodayEasterDay);
  const today = useSelector((state) => state.game.today);
  const gameLanguage = useSelector((state) => state.game.language);
  const isGameEnded = useSelector(selectIsGameEnded);
  const wordToGuess = useSelector((state) => state.game.wordToGuess);
  const gameMode = useSelector((state) => state.game.mode);
  const guesses = useSelector((state) => state.game.guesses);

  const { t } = useTranslation();

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

  const isQuiteBadGameShouldHintHelp = activeLink.route === 'game' && guesses.length >= 8 && !isGameEnded;

  const isLeftActive = activeLink.route === 'help';
  const isRightActive = ['settings', 'statistics', 'aboutLanguage'].includes(activeLink.route);

  return (
    <header className="header">
      <div className="header-left">
        <Link
          className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-left', {
            'button-active': isLeftActive,
            'has-tooltip-activated': isQuiteBadGameShouldHintHelp,
          })}
          href={getLinkPath({ route: isLeftActive ? 'game' : 'help' })}
        >
          {isLeftActive ? <IconClose /> : <IconHelp />}
          <span className="tooltip">
            {isLeftActive && t('common.close')}
            {!isLeftActive && isQuiteBadGameShouldHintHelp && t('help.howToPlayTitle')}
            {!isLeftActive && !isQuiteBadGameShouldHintHelp && t('help.title')}
          </span>
        </Link>
      </div>
      <h1>
        <Link className="header-title" href={getLinkPath({ route: 'game' })}>
          Diffle
          {gameMode === GameMode.Practice && <IconInfinity />}
          {gameMode === GameMode.SandboxLive && <IconEgg className="header-title-icon-small" />}
          {isTodayEasterDay && (
            <span className="header-title-easter-day">
              {today
                .split('.')
                .filter((_, index) => index !== 2)
                .join('.')}
            </span>
          )}
        </Link>
        {gameLanguage && (
          <LanguagePicker className="header-language-picker" place="header">
            <img
              key={flagKey}
              className={clsx('header-flag', { 'header-flag--animation': flagKey })}
              src={`${ROOT_PATH}flags/${flagKey || gameLanguage}.svg`}
              alt={flagKey || gameLanguage}
            />
          </LanguagePicker>
        )}
      </h1>
      <div className="header-right">
        {shouldShowShared && <SharedContent />}
        <Link
          className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-right', {
            'button-active': isRightActive,
          })}
          href={getLinkPath({ route: activeLink.route === 'settings' ? 'game' : 'settings' })}
          type="button"
        >
          {isRightActive ? <IconClose /> : <IconLayers />}
          <span className="tooltip">{t(isRightActive ? 'common.close' : 'settings.title')}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
