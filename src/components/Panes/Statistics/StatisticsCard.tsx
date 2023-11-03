
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Chart from './StatisticsCard';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import CircleScale from './CircleScale';


import './StatisticsCard.scss';

const BREAKPOINTS = {
    LETTERS_AVERAGE: [78, 62, 52, 42, 32, 22],
    WORDS_AVERAGES: [10, 8, 7, 6, 5, 4, 3],
    LETTER_TYPES: [10, 25, 40, 55],
};

const START_FROM = {
    LETTERS_AVERAGE: -10,
    WORDS_AVERAGES: -2,
}

const roundMath = num => Math.round(num * 10) / 10;

function getRandomArbitrary(min, max) {
    return roundMath(Math.random() * (max - min) + min);
}

const StatisticsCard = ({
    lettersAverage_ = 72.3,
    wordsAverage = 4.5,
    keyboardPercentageUsed = 35,
    totalGames,
    totalWon,
    currentStreak,
    bestStreak,
    lettersPerGame,
    wordsPerGame,
    lettersPerWord,
    lettersInFirstWord,
    lettersInSecondWord,
    lettersCorrect,
    lettersPosition,
    lettersIncorrect,
    keyboardUsed,
}) => {
    const { t } = useTranslation();

    const lettersAverage = roundMath(wordsAverage * getRandomArbitrary(4, 7));

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
                    {lettersPerGame.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.LETTERS_AVERAGE} startFrom={START_FROM.LETTERS_AVERAGE} value={lettersPerGame} isInvert isScaleOnLeft/>
                </strong>
                <span>liter</span>
            </p>
            <p className="statistics-words">
                <span>w</span>
                <strong>
                    {wordsPerGame.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.WORDS_AVERAGES} startFrom={START_FROM.WORDS_AVERAGES} value={wordsPerGame} isInvert />
                </strong>
                <span>słowach</span>
            </p>
            <div className="statistics-text">
                <p>średnio liter <strong>{lettersPerWord.toFixed(1)}</strong> w słowie</p>
                <p>średnio liter <strong>{lettersInFirstWord.toFixed(1)}</strong> w pierwszym słowie</p>
                <p>średnio liter <strong>{lettersInSecondWord.toFixed(1)}</strong> w drugim słowie</p>
                {/* <p>ostatnie nieodgadnięte słowo <strong>lekoman</strong></p> */}
                <p>średnio <strong>{keyboardUsed}%</strong> odkrytej klawiatury</p>
            </div>
            <p className="statistics-letters-types">
                <span className="correct">
                    <strong>
                        {(lettersCorrect).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={(lettersCorrect / lettersPerGame) * 100} isPercentage />
                    </strong>
                </span>
                <span className="position">
                    <strong>
                        {(lettersPosition).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={(lettersPosition / lettersPerGame) * 100} isPercentage />
                    </strong>
                </span>
                <span className="incorrect">
                    <strong>
                        {(lettersIncorrect).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={(lettersIncorrect / lettersPerGame) * 100} isPercentage />
                    </strong>
                </span>
            </p>
            <div className="statistics-other">
                <p><strong>{totalGames}</strong> gier</p>
                <p><strong>{totalWon}</strong> wygranych</p>
                <p><strong>{currentStreak}</strong> z rzędu</p>
                <p><strong>{bestStreak}</strong> najwięcej z rzędu</p>
            </div>
            <footer>
                {location.href}
            </footer>
        </div>
    )
};

export default StatisticsCard;
