import { useTranslation } from 'react-i18next';

import Chart from './StatisticsCard';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import CircleScale from './CircleScale';


import './Statistics.scss'  

const roundMath = num => Math.round(num * 10) / 10;

const StatisticsCard = ({ lettersAverage = 72.3, wordsAverage = 8.1 }) => {
    const { t } = useTranslation();

    return (
        <div className="statistics-summary">
            <IconDiffleChart className="statistics-summary-icon" />
            <p className="statistics-letters">
                <strong>
                    {lettersAverage}
                    <CircleScale breakPoints={[20, 40, 60, 80, 110]} value={lettersAverage} />
                </strong>
                liter
            </p>
            <p className="statistics-words">
                w
                <strong>
                    {wordsAverage}
                    <CircleScale breakPoints={[2, 4, 7, 10, 14]} value={wordsAverage} />
                </strong>
                słowach    
            </p>
            <p>średnio liter <strong>{roundMath(lettersAverage / wordsAverage)}</strong> w słowie</p>
            <p>średnio liter <strong>6.1</strong> w pierwszym słowie</p>
            <p>średnio liter <strong>4.7</strong> w drugi słowie</p>
            <p>Ostatnie nie odgadnięte słowo <strong>lekoman</strong></p>
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
