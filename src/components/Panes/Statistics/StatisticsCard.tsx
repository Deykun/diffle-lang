import { useTranslation } from 'react-i18next';

import { StatisticForCard } from '@utils/statistics';

import IconDiffleChart from '@components/Icons/IconDiffleChart';

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

const StatisticsCard = ({
    totalGames,
    totalWon,
    streak,
    bestStreak,
    rejectedWordsPerGame,
    lettersPerGame,
    wordsPerGame,
    secondsPerGame,
    lettersPerWord,
    lettersInFirstWord,
    lettersInSecondWord,
    lettersCorrect,
    lettersPosition,
    lettersIncorrect,
    lettersTypedKnownIncorrect,
    keyboardUsed,
}: StatisticForCard) => {
    const { t } = useTranslation();

    return (
        <div className="statistics-card">
            <IconDiffleChart className="statistics-card-icon" />
            <p className="statistics-letters">
                <strong>
                    {lettersPerGame.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.LETTERS_AVERAGE} startFrom={START_FROM.LETTERS_AVERAGE} value={lettersPerGame} isInvert isScaleOnLeft/>
                </strong>
                <span>{t('statistics.letters')}</span>
            </p>
            <p className="statistics-words">
                <span>{t('statistics.averageWordsBefore')}</span>
                <strong>
                    {wordsPerGame.toFixed(1)}
                    <CircleScale breakPoints={BREAKPOINTS.WORDS_AVERAGES} startFrom={START_FROM.WORDS_AVERAGES} value={wordsPerGame} isInvert />
                </strong>
                <span>{t('statistics.averageWords')}</span>
            </p>
            <div className="statistics-text">
            
                <p>{t('statistics.averageLetters')} <strong>{lettersPerWord.toFixed(1)}</strong> {t('statistics.inWord')}</p>
                <p>{t('statistics.averageLetters')} <strong>{lettersInFirstWord.toFixed(1)}</strong> {t('statistics.inFirstWord')}</p>
                <p>{t('statistics.averageLetters')} <strong>{lettersInSecondWord.toFixed(1)}</strong> {t('statistics.inSecondWord')}</p>
                <p><strong>{secondsPerGame.toFixed(1)}</strong>s</p>
                <p dangerouslySetInnerHTML={{
                    __html: t('statistics.keyboardUsed', { value: keyboardUsed })
                }} />
                {rejectedWordsPerGame > 0 && (
                    <p dangerouslySetInnerHTML={{
                        __html: t('statistics.averageWordsNotFound', { value: rejectedWordsPerGame.toFixed(1) })
                    }} />
                )}
            </div>
            <p className="statistics-letters-types">
                <span className="correct">
                    <strong>
                        {(lettersCorrect * lettersPerGame).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersCorrect * 100} isPercentage />
                    </strong>
                </span>
                <span className="position">
                    <strong>
                        {(lettersPosition * lettersPerGame).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersPosition * 100} isPercentage />
                    </strong>
                </span>
                <span className="incorrect">
                    <strong>
                        {(lettersIncorrect * lettersPerGame).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersIncorrect * 100} isPercentage />
                    </strong>
                </span>
                <span className="incorrect typed">
                    <strong>
                        {(lettersTypedKnownIncorrect * lettersPerGame).toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersTypedKnownIncorrect * 100} isPercentage />
                    </strong>
                </span>
            </p>
            <div className="statistics-other">
                <p dangerouslySetInnerHTML={{
                    __html: t('statistics.totalGames', {
                        postProcess: 'interval',
                        count: totalGames,
                    })
                }} />
                <p dangerouslySetInnerHTML={{
                    __html: t('statistics.totalWon', {
                        postProcess: 'interval',
                        count: totalWon,
                    })
                }} />
                {bestStreak > 0 && <p><strong>{streak}</strong> {t('statistics.totalStreak')}</p>}
                {bestStreak > 0 && <p><strong>{bestStreak}</strong> {t('statistics.totalBestStreak')}</p>}                
            </div>
            <footer>
                {location.href}
            </footer>
        </div>
    )
};

export default StatisticsCard;
