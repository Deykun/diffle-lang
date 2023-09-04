import { useTranslation } from 'react-i18next';

import Chart from './StatisticsCard';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import CircleScale from './CircleScale';


import './Statistics.scss'  

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const StatisticsCard = ({ lettersAverage_ = 72.3, wordsAverage = 8.1 }) => {
    const { t } = useTranslation();

    const lettersAverage = roundMath(wordsAverage * getRandomArbitrary(4, 9));

    return (
        <div className="statistics-summary">
            <IconDiffleChart className="statistics-summary-icon" />
            <p className="statistics-letters">
                <strong>
                    {lettersAverage.toFixed(1)}
                    <CircleScale breakPoints={[120, 100, 80, 60, 42]} value={lettersAverage} />
                </strong>
                <span>liter</span>
            </p>
            <p className="statistics-words">
                <span>w</span>
                <strong>
                    {wordsAverage.toFixed(1)}
                    <CircleScale breakPoints={[20, 16, 12, 9, 6]} value={wordsAverage} />
                </strong>
                <span>słowach</span>
            </p>
            <div className="statistics-text">
                <p>średnio liter <strong>{roundMath(lettersAverage / wordsAverage)}</strong> w słowie</p>
                <p>średnio liter <strong>6.1</strong> w pierwszym słowie</p>
                <p>średnio liter <strong>4.7</strong> w drugi słowie</p>
                <p>ostatnie nie odgadnięte słowo <strong>lekoman</strong></p>
            </div>
            <p className="statistics-letters-types">
                <span className="correct">
                    <strong>25.4</strong>
                </span>
                <span className="position">
                    <strong>5.6</strong>
                </span>
                <span className="incorrect">
                    <strong>21.1</strong>
                </span>
            </p>
            {/* <IconHeartStreak /> */}
            <div className="statistics-other">
                <p><strong>15</strong> gier</p>
                <p><strong>14</strong> wygranych</p>
                <p><strong>4</strong> z rzędu</p>
                <p><strong>9</strong> najwięcej z rzędu</p>
            </div>
        </div>
    )
};

export default StatisticsCard;
