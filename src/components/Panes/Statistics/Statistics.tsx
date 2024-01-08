import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Filters, StatisticDataForCard, Streak } from '@utils/statistics';

import IconChartWithMarkedPart from '@components/Icons/IconChartWithMarkedPart';
import IconGamepad from '@components/Icons/IconGamepad';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import { INITIAL_FILTERS } from './constants';

import './Statistics.scss'

const Statistics = () => {
    const [{ filtersData, statisticsData, streakData }, setData] = useState<{
        filtersData: Filters,
        statisticsData: StatisticDataForCard | undefined,
        streakData: Streak | undefined,
    }>({
        filtersData: INITIAL_FILTERS,
        statisticsData: undefined,
        streakData: undefined,
    });
    const { t } = useTranslation();

    const isMissingData = !statisticsData || statisticsData.totalWon === 0;

    return (
        <div className="statistics">
            <StatisticsFilters
              setData={setData}
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
                    : <StatisticsCard {...statisticsData} {...streakData} {...filtersData} />
                }
            </div>
        </div>
    )
};

export default Statistics;
