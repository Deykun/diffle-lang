import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Filters,
    StatisticDataForCard,
    Streak,
    getStatisticForFilter,
    getStreakForFilter,
    getStatisticCardDataFromStatistics,
} from '@utils/statistics';

import useScrollEffect from '@hooks/useScrollEffect';

import IconChartWithMarkedPart from '@components/Icons/IconChartWithMarkedPart';
import IconGamepad from '@components/Icons/IconGamepad';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';
import StatisticsActions from './StatisticsActions';

import { INITIAL_FILTERS } from './constants';

import './Statistics.scss'

const Statistics = () => {
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
        const statistics = getStatisticForFilter(filtersData);
        const streakData = getStreakForFilter(filtersData);

        const statisticsData = getStatisticCardDataFromStatistics(statistics);

        setData({
            statisticsData,
            streakData,
        });
    }, [filtersData]);

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
                    ? <div className="missing-data"><IconChartWithMarkedPart className="missing-data-icon" /><p>{t('statistics.noData')}</p></div>
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
