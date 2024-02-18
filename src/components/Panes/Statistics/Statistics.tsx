import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane as PaneInterface } from '@common-types';

import { useSelector } from '@store';

import {
    Filters,
    StatisticDataForCard,
    Streak,
    getStatisticForFilter,
    getStreakForFilter,
    getStatisticCardDataFromStatistics,
} from '@utils/statistics';

import usePanes from '@hooks/usePanes';
import useScrollEffect from '@hooks/useScrollEffect';

import IconBookOpen from '@components/Icons/IconBookOpen';
import IconGamepad from '@components/Icons/IconGamepad';

import Button from '@components/Button/Button';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';
import StatisticsActions from './StatisticsActions';

import { INITIAL_FILTERS } from './constants';

import './Statistics.scss'

const Statistics = () => {
    const gameLanguage = useSelector((state) => state.game.language);
    const [filtersData, setFiltersData] = useState<Filters>(INITIAL_FILTERS);
    const [{ statisticsData, streakData }, setData] = useState<{
        statisticsData: StatisticDataForCard | undefined,
        streakData: Streak | undefined,
    }>({
        statisticsData: undefined,
        streakData: undefined,
    });

    const { t } = useTranslation();
    const { changePane } = usePanes();

    useScrollEffect('top', []);

    const refreshStatitics = useCallback(() => {
        if (!gameLanguage) {
            return;
        }

        const statistics = getStatisticForFilter(gameLanguage, filtersData);
        const streakData = getStreakForFilter(gameLanguage, filtersData);

        const statisticsData = getStatisticCardDataFromStatistics(statistics);

        setData({
            statisticsData,
            streakData,
        });
    }, [filtersData, gameLanguage]);

    useEffect(() => {
        refreshStatitics();
    }, [refreshStatitics])

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
                    ? <p className="missing-data">
                        {t('statistics.noData')}
                    </p>
                    : <>
                        <StatisticsCard {...statisticsData} {...streakData} {...filtersData} />
                        <StatisticsActions refreshStatitics={refreshStatitics} modeFilter={filtersData.modeFilter} />
                    </>
                }
            </div>
        </div>
    )
};

export default Statistics;
