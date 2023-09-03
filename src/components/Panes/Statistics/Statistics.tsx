import { useTranslation } from 'react-i18next';

import Chart from './StatisticsCard';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import CircleScale from './CircleScale';

import StatisticsCard from './StatisticsCard';


import './Statistics.scss'

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const Statistics = () => {
    const { t } = useTranslation();

    return (
        <div className="statistics">
            <div>
                <h3>{t('settings.statisticsTitle')}</h3>
                <StatisticsCard lettersAverage={getRandomArbitrary(24, 160)} wordsAverage={getRandomArbitrary(3, 21)} />
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            {/* <CircleScale /> */}
        </div>
    )
};

export default Statistics;
