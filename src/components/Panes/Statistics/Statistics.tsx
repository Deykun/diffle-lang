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
    // TODO: use one state or useReducer
    // const [filtersData, setFiltersData] = useState<Filters>(INITIAL_FILTERS);
    // const [statisticData, setStatisticData] = useState<StatisticDataForCard | undefined>(undefined);
    // const [streakData, setStreakData] = useState<Streak | undefined>(undefined);

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

    const isMissingData = !statisticsData || statisticsData.totalGames === 0;

    return (
        <div className="statistics">
            <StatisticsFilters
              setData={setData}
            />
            <div>
                <h2 className="statistics-title">
                    {t('settings.statisticsTitle')}
                    <span className="statistics-title-total">
                        <span>{statisticsData?.totalGames || 0}</span>
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
