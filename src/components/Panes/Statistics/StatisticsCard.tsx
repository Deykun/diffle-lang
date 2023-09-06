
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Chart from './StatisticsCard';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import CircleScale from './CircleScale';


import './StatisticsCard.scss';

const BREAKPOINTS = {
    LETTERS_AVERAGE: [105, 85, 65, 45, 25],
    WORDS_AVERAGES: [21, 17, 13, 10, 7, 4],
    LETTER_TYPES: [10, 25, 40, 55],
};

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const StatisticsCard = ({ lettersAverage_ = 72.3, wordsAverage = 8.1 }) => {
    const { t } = useTranslation();

    const lettersAverage = roundMath(wordsAverage * getRandomArbitrary(4, 9));

    const {
        correct,
        incorrect,
        position,
    } = useMemo(() => {
        const position = getRandomArbitrary(0, 12);
        const correct = getRandomArbitrary(position, 100);
        const incorrect = 100 - correct;

        return {
            correct,
            incorrect,
            position,
        };
    }, []);

    return (
        <div className="statistics-card">
            <IconDiffleChart className="statistics-card-icon" />
            <p className="statistics-letters">
                <strong>
                    {lettersAverage.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.LETTERS_AVERAGE} value={lettersAverage} isInvert isScaleOnLeft/>
                </strong>
                <span>liter</span>
            </p>
            <p className="statistics-words">
                <span>w</span>
                <strong>
                    {wordsAverage.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.WORDS_AVERAGES} value={wordsAverage} isInvert />
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
                    <strong>
                        {(lettersAverage * correct / 100).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={correct} isPercentage />
                    </strong>
                </span>
                <span className="position">
                    <strong>
                        {(lettersAverage * position / 100).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={position} isPercentage />
                    </strong>
                </span>
                <span className="incorrect">
                    <strong>
                        {(lettersAverage * incorrect / 100).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={incorrect} isPercentage />
                    </strong>
                </span>
            </p>
            <div className="statistics-other">
                <p><strong>15</strong> gier</p>
                <p><strong>14</strong> wygranych</p>
                <p><strong>4</strong> z rzędu</p>
                <p><strong>9</strong> najwięcej z rzędu</p>
            </div>
            <footer>
                {location.href}
            </footer>
        </div>
    )
};

export default StatisticsCard;
