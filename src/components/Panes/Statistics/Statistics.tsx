import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StatisticForCard, Streak } from '@utils/statistics';

import IconChartWithMarkedPart from '@components/Icons/IconChartWithMarkedPart';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import './Statistics.scss'

const Statistics = () => {
    const [statisticData, setStatisticData] = useState<StatisticForCard | undefined>(undefined);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const { t } = useTranslation();

    const isMissingData = !statisticData || statisticData.totalGames === 0;

    return (
        <div className="statistics">
            <StatisticsFilters setStatisticData={setStatisticData} setStreakData={setStreakData} />
            <div>
                <h2>{t('settings.statisticsTitle')}</h2>
                {isMissingData ? <div className="missing-data"><IconChartWithMarkedPart className="missing-data-icon" /><p>{t('statistics.noData')}</p></div> : <StatisticsCard {...statisticData} {...streakData} />}
            </div>
        </div>
    )
};

export default Statistics;
