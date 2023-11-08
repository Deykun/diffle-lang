import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StatisticForCard, Streak } from '@utils/statistics';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import useScrollEffect from '@hooks/useScrollEffect';

import './Statistics.scss'

const Statistics = () => {
    const [statisticData, setStatisticData] = useState<StatisticForCard | undefined>(undefined);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const { t } = useTranslation();
      
    useScrollEffect('bottom', [statisticData])

    const isMissingData = !statisticData || statisticData.totalGames === 0;

    console.log('streakData', streakData);

    return (
        <div className="statistics">
            <StatisticsFilters setStatisticData={setStatisticData} setStreakData={setStreakData} />
            <div>
                <h2>{t('settings.statisticsTitle')}</h2>
                {isMissingData ? <p>{t('statistics.noData')}</p> : <StatisticsCard {...statisticData} {...streakData} />}
            </div>
        </div>
    )
};

export default Statistics;
