import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Filters, StatisticDataForCard, Streak } from '@utils/statistics';

import IconChartWithMarkedPart from '@components/Icons/IconChartWithMarkedPart';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import { INITIAL_FILTERS } from './constants';

import './Statistics.scss'

const Statistics = () => {
    // TODO: use one state or useReducer
    const [filtersData, setFiltersData] = useState<Filters>(INITIAL_FILTERS);
    const [statisticData, setStatisticData] = useState<StatisticDataForCard | undefined>(undefined);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const { t } = useTranslation();

    const isMissingData = !statisticData || statisticData.totalGames === 0;

    return (
        <div className="statistics">
            <StatisticsFilters
              setStatisticData={setStatisticData}
              setStreakData={setStreakData}
              setFiltersData={setFiltersData}
            />
            <div>
                <h2>
                    {t('settings.statisticsTitle')}
                    {<span className="statistics-title-total">{statisticData?.totalGames || 0}</span>}
                </h2>
                {isMissingData
                    ? <div className="missing-data"><IconChartWithMarkedPart className="missing-data-icon" /><p>{t('statistics.noData')}</p></div>
                    : <StatisticsCard {...statisticData} {...streakData} {...filtersData} />
                }
            </div>
        </div>
    )
};

export default Statistics;
