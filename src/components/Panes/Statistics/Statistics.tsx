import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';

import {
  Filters,
  StatisticDataForCard,
  Streak,
  getStatisticForFilter,
  getStreakForFilter,
  getStatisticCardDataFromStatistics,
} from '@utils/statistics';

import useScrollEffect from '@hooks/useScrollEffect';

import IconGamepad from '@components/Icons/IconGamepad';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';
import StatisticsActions from './StatisticsActions';

import { INITIAL_FILTERS } from './constants';

import './Statistics.scss';

const Statistics = () => {
  const gameLanguage = useSelector(state => state.game.language);
  const [filtersData, setFiltersData] = useState<Filters>(INITIAL_FILTERS);
  const [{ statisticsData, streakData }, setData] = useState<{
    statisticsData: StatisticDataForCard | undefined,
    streakData: Streak | undefined,
  }>({
    statisticsData: undefined,
    streakData: undefined,
  });

  const { t } = useTranslation();

  useScrollEffect('top', []);

  const refreshStatitics = useCallback(() => {
    if (!gameLanguage) {
      return;
    }

    const statistics = getStatisticForFilter(gameLanguage, filtersData);
    const streakDataToUpdate = getStreakForFilter(gameLanguage, filtersData);

    const statisticsDataToUpadate = getStatisticCardDataFromStatistics(statistics);

    setData({
      statisticsData: statisticsDataToUpadate,
      streakData: streakDataToUpdate,
    });
  }, [filtersData, gameLanguage]);

  useEffect(() => {
    refreshStatitics();
  }, [refreshStatitics]);

  const isMissingData = !statisticsData || statisticsData.totalWon === 0;

  return (
      <div className="statistics">
          <StatisticsFilters
            setFiltersData={setFiltersData}
          />
          <div>
              <h2 className="statistics-title">
                  {t('settings.statisticsTitle')}
                  <span className="statistics-title-total">
                      <span>{isMissingData ? 0 : statisticsData.totalGames}</span>
                      <IconGamepad />
                  </span>
              </h2>
              {isMissingData
                ? (
                    <p className="missing-data">
                        {t('statistics.noData')}
                    </p>
                )
                : (
                    <>
                        <StatisticsCard
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...statisticsData}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...streakData}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...filtersData}
                        />
                        <StatisticsActions refreshStatitics={refreshStatitics} modeFilter={filtersData.modeFilter} />
                    </>
                )}
          </div>
      </div>
  );
};

export default Statistics;
