import { useTranslation } from 'react-i18next';

import StatisticsCard from './StatisticsCard';
import StatisticsFilters from './StatisticsFilters';

import './Statistics.scss'

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const Statistics = () => {
    const { t } = useTranslation();

    return (
        <div className="statistics">
            <StatisticsFilters />
            <div>
                <h3>{t('settings.statisticsTitle')}</h3>
                <StatisticsCard wordsAverage={getRandomArbitrary(3, 16)} />
            </div>
        </div>
    )
};

export default Statistics;
