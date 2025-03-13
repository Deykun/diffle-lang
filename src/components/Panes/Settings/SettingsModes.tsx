import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

import { GameMode, Pane, PaneChange } from '@common-types';

import useLink from '@features/routes/hooks/useLinks';

import { useSelector, useDispatch } from '@store';
import { selectIsWon } from '@store/selectors';
import { setGameMode, setWordToGuess } from '@store/gameSlice';

import { getNow } from '@utils/date';
import { getLocalStorageKeyForLastGameMode } from '@utils/game';

import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconFlask from '@components/Icons/IconFlask';
import IconShare from '@components/Icons/IconShare';

import ButtonTile from '@components/Button/ButtonTile';

import './Settings.scss';

const SettingsModes = () => {
  const [, navigation] = useLocation();
  const { getLinkPath } = useLink();
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);
  const isWon = useSelector(selectIsWon);

  const { t } = useTranslation();

  const handleChangeGameMode = useCallback((newGameMode: GameMode) => {
    if (!gameLanguage) {
      return;
    }

    const localStorageKeyForLastGameMode = getLocalStorageKeyForLastGameMode({ gameLanguage });
    localStorage.setItem(localStorageKeyForLastGameMode, newGameMode);

    dispatch(setGameMode(newGameMode));
    dispatch(setWordToGuess(''));
    navigation(getLinkPath({ route: 'game' }));
  }, [gameLanguage, dispatch, navigation, getLinkPath]);

  const shouldShowCheckedDaily = gameMode !== GameMode.Daily || isWon;
  const shouldShowTimeForDaily = gameMode === GameMode.Daily && isWon;

  return (
      <>
          <h2>{t('settings.gameModeTitle')}</h2>
          <ul>
              <li>
                  <ButtonTile
                    isActive={gameMode === GameMode.Daily}
                    onClick={() => handleChangeGameMode(GameMode.Daily)}
                  >
                      <IconDay />
                      <span>{t('game.modeDaily')}</span>
                      {shouldShowCheckedDaily && !shouldShowTimeForDaily && (
                      <span className={clsx('button-tile-label', 'correct')}>
                          <span>{t('end.completed')}</span>
                          <IconFancyCheck />
                      </span>
                      )}
                      {shouldShowTimeForDaily && (
                      <span className={clsx('button-tile-label', 'correct')}>
                          <span>{t('end.nextDailyShort', { count: 24 - getNow().nowUTC.getHours() })}</span>
                          <IconFancyCheck />
                      </span>
                      )}
                  </ButtonTile>
              </li>
              <li>
                  <ButtonTile
                    isActive={gameMode === GameMode.Practice}
                    isDisabled={!shouldShowCheckedDaily}
                    onClick={() => handleChangeGameMode(GameMode.Practice)}
                  >
                      <IconInfinity />
                      <span>{t('game.modePractice')}</span>
                      {!shouldShowCheckedDaily && (
                      <span className={clsx('button-tile-label', 'incorrect')}>
                          <span>{t('settings.labelFinishGame')}</span>
                          {' '}
                          <IconDay />
                      </span>
                      )}
                  </ButtonTile>
              </li>
              <li style={{ display: 'none' }}>
                  <ButtonTile
                    isActive={gameMode === GameMode.Share}
                    isDisabled
                    onClick={() => handleChangeGameMode(GameMode.Share)}
                  >
                      <IconShare />
                      <span>{t('game.modeShare')}</span>
                      <span className={clsx('button-tile-label', 'info', 'lab')}>
                          <span>{t('settings.considered')}</span>
                          {' '}
                          <IconFlask />
                      </span>
                  </ButtonTile>
              </li>
          </ul>
      </>
  );
};

export default SettingsModes;
