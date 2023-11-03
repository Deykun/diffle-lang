import { useTranslation } from 'react-i18next';

import { Statistic } from '@utils/statistics';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import useScrollEffect from '@hooks/useScrollEffect';



import './Statistics.scss'
import { useState } from 'react';

const Statistics = () => {
    const [statisticData, setStatisticData] = useState<Statistic | undefined>(undefined);
    const { t } = useTranslation();
    
    useScrollEffect('bottom', [statisticData])

    const isMissingData = !statisticData || statisticData.totalGames === 0;

    return (
        <div className="statistics">
            <StatisticsFilters setStatisticData={setStatisticData} />
            <div>
                <h2>{t('settings.statisticsTitle')}</h2>
                {isMissingData ? <p>{t('statistics.noData')}</p> : <StatisticsCard {...statisticData} />}
            </div>
        </div>
    )
};

export default Statistics;
