import { useTranslation } from 'react-i18next';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import './Statistics.scss'
import { useState } from 'react';

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const Statistics = () => {
    const [statisticData, setStatisticData] = useState(undefined);
    const { t } = useTranslation();

    const isMissingData = !statisticData || statisticData.totalGames === 0;

    return (
        <div className="statistics">
            <StatisticsFilters setStatisticData={setStatisticData} />
            <div>
                <h3>{t('settings.statisticsTitle')}</h3>
                {!isMissingData && <StatisticsCard {...statisticData} />}
            </div>
        </div>
    )
};

export default Statistics;
