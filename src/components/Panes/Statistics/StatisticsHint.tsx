import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';

import { useDispatch, useSelector } from '@store';
import { track } from '@store/appSlice';

import { getStatistic, getStatisticParamsForWord, getStreakForFilter } from '@utils/statistics';

import Button from '@components/Button/Button';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import './StatisticsHint.scss';
import useLinks from '@features/routes/hooks/useLinks';

import { getSearchForMode } from './utils/statistics-params';

const StatisticsHint = () => {
  const { getLinkPath } = useLinks();
  const dispatch = useDispatch();
  const wordToGuess = useSelector((state) => state.game.wordToGuess);
  const gameLanguage = useSelector((state) => state.game.language);
  const lastWordAddedToStatitstic = useSelector((state) => state.game.lastWordAddedToStatitstic);
  const gameMode = useSelector((state) => state.game.mode);

  const { t } = useTranslation();

  const { wonStreak } = useMemo(() => {
    try {
      if (!gameLanguage) {
        return { wonStreak: 0 };
      }

      if (lastWordAddedToStatitstic) {
        return getStreakForFilter(gameLanguage, { modeFilter: gameMode });
      }
      const { isShort, hasSpecialCharacters } = getStatisticParamsForWord(wordToGuess);

      const { lastGame: { word: lastIndexeWord } = {} } = getStatistic({
        gameLanguage,
        gameMode,
        hasSpecialCharacters,
        isShort,
      });

      if (lastIndexeWord === wordToGuess) {
        return getStreakForFilter(gameLanguage, { modeFilter: gameMode });
      }
    } catch {
      //
    }

    return { wonStreak: 0 };
  }, [gameLanguage, gameMode, wordToGuess, lastWordAddedToStatitstic]);

  const trackHintDetailsClicked = useCallback(() => {
    dispatch(track({ name: `click_streak_${wonStreak}_${gameMode}_check` }));
  }, [wonStreak, gameMode]);

  const isNiceNumberToHint = [5, 10].includes(wonStreak) || (wonStreak % 25 === 0 && wonStreak !== 0);
  const isModeWithoutStatistics = gameMode === GameMode.SandboxLive;
  const shouldRender = gameLanguage && isNiceNumberToHint && !isModeWithoutStatistics;

  useEffect(() => {
    if (shouldRender) {
      dispatch(track({ name: `displayed_streak_${wonStreak}_${gameMode}_check` }));
    }
  }, [shouldRender, wonStreak, gameMode]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="statistics-hint">
      <p className="has-tooltip tooltip-relative">
        <IconHeartStreak />
        <strong>{wonStreak}</strong>
        <span className="tooltip">
          {t('statistics.totalWonStreak', {
            postProcess: 'interval',
            count: wonStreak,
          })}
        </span>
      </p>
      <Button
        onClick={trackHintDetailsClicked}
        isInverted
        isText
        hasBorder={false}
        tagName="link"
        href={`${getLinkPath({ route: 'statistics' })}${getSearchForMode(gameMode)}`}
      >
        <IconDiffleChart />
        <span>{t('settings.statisticsTitle')}</span>
      </Button>
    </div>
  );
};

export default StatisticsHint;
