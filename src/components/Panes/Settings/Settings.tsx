import clsx from 'clsx';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane } from '@common-types';
import { UPDATE_BLOCK_DAILY } from '@const';

import { useSelector, useDispatch } from '@store';
import { loseGame } from '@store/gameSlice';
import { selectIsGameEnded } from '@store/selectors';

import { getNow, getYesterdaysSeed, getYesterdaysStamp } from '@utils/date';

import getWordToGuess from '@api/getWordToGuess';

import useScrollEffect from '@hooks/useScrollEffect';
import usePanes from '@hooks/usePanes';
import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconBandage from '@components/Icons/IconBandage';
import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconGamepad from '@components/Icons/IconGamepad';
import IconInfinity from '@components/Icons/IconInfinity';

import ButtonTile from '@components/Button/ButtonTile';
import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';

import './Settings.scss';

import SettingsModes from './SettingsModes';
import SettingsPreferences from './SettingsPreferences';
import SettingsSources from './SettingsSources';

const Settings = () => {
  const dispatch = useDispatch();
  const [yesterdayWord, setYesterdayWord] = useState('');
  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);
  const isGameEnded = useSelector(selectIsGameEnded);

  const isGivingUpDisabled = isGameEnded || gameMode !== GameMode.Practice;

  const { t } = useTranslation();
  const { changePane } = usePanes();

  useScrollEffect('top', []);

  const { handleClickSummary } = useEnhancedDetails();

  useEffect(() => {
    if (gameLanguage) {
      const yesterdaysSeed = getYesterdaysSeed();

      getWordToGuess({ gameMode: GameMode.Daily, gameLanguage, seedNumber: yesterdaysSeed }).then((dayWord) => {
        setYesterdayWord(dayWord);
      });
    }
  }, [gameLanguage]);

  const handleGiveUp = () => {
    dispatch(loseGame());
    changePane(Pane.Game);
  };

  const wasYesterdayBlockedByUpdate = useMemo(() => {
    return [getNow().stamp, getYesterdaysStamp()].includes(UPDATE_BLOCK_DAILY);
  }, []);

  return (
      <div className="settings">
          <ul>
              <li>
                  <ButtonTile onClick={() => changePane(Pane.Statistics)}>
                      <IconDiffleChart />
                      <span>{t('settings.statisticsTitle')}</span>
                  </ButtonTile>
              </li>
              {gameMode === GameMode.Practice && isGivingUpDisabled ? (
                  <li>
                      <ButtonTile onClick={() => changePane(Pane.Game)}>
                          <IconGamepad />
                          <span>{t('common.play')}</span>
                      </ButtonTile>
                  </li>
              ) : (
                  <li>
                      <ButtonTile onClick={handleGiveUp} isDisabled={isGivingUpDisabled}>
                          <IconBandage />
                          <span>{t('game.iGiveUp')}</span>
                          {gameMode !== GameMode.Practice && (
                          <span className={clsx('button-tile-label', 'info', 'mode')}>
                              <span>{t('settings.onlyIn')}</span>
                              <IconInfinity />
                          </span>
                          )}
                      </ButtonTile>
                  </li>
              )}
          </ul>
          <SettingsModes changePane={changePane} />
          <details>
              <summary onClick={handleClickSummary}>
                  <h2>{t('settings.lastDailyWordsTitle')}</h2>
                  <IconAnimatedCaret className="details-icon" />
              </summary>
              {yesterdayWord && (
              <div className="details-content">
                  <p>
                      {t('settings.lastDailyWordsYesterday', { word: yesterdayWord })}
                  </p>
                  <GoToDictionaryButton word={yesterdayWord} />
                  {wasYesterdayBlockedByUpdate && (
                  <small className="yesterday-day-tip">
                      {t('settings.lastDailyWordsCanBeWrongBecauseOfUpdate')}
                  </small>
                  )}
              </div>
              )}
          </details>
          <SettingsPreferences />
          <footer>
              <SettingsSources />
          </footer>
      </div>
  );
};

export default Settings;
