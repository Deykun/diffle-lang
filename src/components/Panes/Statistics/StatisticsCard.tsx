import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { StatisticDataForCard, Filters, CharactersFilter, LengthFilter } from '@utils/statistics';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconGithub from '@components/Icons/IconGithub';

import CircleScale from './CircleScale';

import StatisticsCardActiveFilters from './StatisticsCardActiveFilters';

import './StatisticsCard.scss';

interface StatisticForCard extends StatisticDataForCard, Filters {
    wonStreak?: number,
    lostStreak?: number,
    bestStreak?: number,
    worstStreak?: number,
}

const BREAKPOINTS = {
    LETTERS: [90, 75, 60, 45, 35, 25],
    WORDS: [15, 13, 11, 9, 7, 5],
    LETTER_TYPES: [5, 20, 35, 50],
};

const START_FROM = {
    LETTERS: -10,
    WORDS: -2.5,
}

const StatisticsCard = ({
    totalGames,
    totalWon,
    lostStreak = 0,
    worstStreak = 0,
    wonStreak = 0,
    bestStreak = 0,
    rejectedWordsWorstWonInGame,
    rejectedWordsPerGame,
    lettersPerGame,
    averageLettersPerGame,
    maxLettersInGame,
    wordsPerGame,
    averageWordsPerGame,
    maxWordsInGame,
    timePerGame,
    totalTime,
    lettersPerWord,
    lettersInFirstWord,
    lettersInSecondWord,
    lettersCorrect,
    lettersPosition,
    lettersIncorrect,
    lettersTypedKnownIncorrect,
    // keyboardUsed,
    modeFilter,
    charactersFilter,
    lengthFilter,
}: StatisticForCard) => {
    const { t } = useTranslation();

    const diffleURL = location.href.replace('http://', '').replace('https://', '').split('?')[0];

    const canShowStreak = charactersFilter === CharactersFilter.All && lengthFilter === LengthFilter.All;

    return (
        <div className={clsx('wrapper-padding-escape', 'statistics-card-margins')}>
            <div id="sharable-card" className={clsx('statistics-card-wrapper')}>
                <div className="statistics-card">
                    <IconDiffleChart className="statistics-card-icon" />
                    <div className="circles-below-visual">
                        <p className={clsx('statistics-letters')}>
                            <strong>
                                {lettersPerGame.toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.LETTERS} startFrom={START_FROM.LETTERS} value={lettersPerGame} isInvert isScaleOnLeft/>
                            </strong>
                            <span>{t('statistics.letters')}</span>
                        </p>
                        <p className={clsx('statistics-words')}>
                            <span>{t('statistics.medianWordsBefore')}</span>
                            <strong>
                                {wordsPerGame.toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.WORDS} startFrom={START_FROM.WORDS} value={wordsPerGame} isInvert />
                            </strong>
                            <span>{t('statistics.medianWords')}</span>
                        </p>
                    </div>
                    <p className={clsx('statistics-letters', 'has-tooltip', 'has-tooltip-from-left')}>
                        <strong>
                            {lettersPerGame.toFixed(1)}
                        </strong>
                        <span>{t('statistics.letters')}</span>
                        <span className="tooltip">
                            {t('statistics.median')}
                            {' ('}
                            {t('statistics.average')}
                            <strong>{averageLettersPerGame.toFixed(1)}</strong>
                            {', '}
                            {t('statistics.maximum')}
                            <strong>{maxLettersInGame}</strong>
                            {')'}
                        </span>
                    </p>
                    <p className={clsx('statistics-words', 'has-tooltip', 'has-tooltip-from-right')}>
                        <span>{t('statistics.medianWordsBefore')}</span>
                        <strong>
                            {wordsPerGame.toFixed(1)}
                        </strong>
                        <span>{t('statistics.medianWords')}</span>
                        <span className="tooltip">
                            {t('statistics.median')}
                            {' ('}
                            {t('statistics.average')}
                            <strong>{averageWordsPerGame.toFixed(1)}</strong>
                            {', '}
                            {t('statistics.maximum')}
                            <strong>{maxWordsInGame}</strong>
                            {')'}
                        </span>
                    </p>
                    <div className="statistics-text">
                        <p>{t('statistics.averageLetters')} <strong>{lettersPerWord.toFixed(1)}</strong> {t('statistics.inWord')}</p>
                        <p className="has-tooltip tooltip-relative">
                            {t('statistics.averageLetters')}
                            <strong>{lettersInFirstWord.toFixed(1)}</strong>
                            {t('statistics.inFirstWord')}
                            <span className="tooltip">
                                <strong>{lettersInSecondWord.toFixed(1)}</strong>
                                {t('statistics.inSecondWord')}
                            </span>                    
                        </p>
                        <p className="has-tooltip tooltip-relative">
                            {t('statistics.averageGameTime')}
                            {timePerGame.hours > 0 && <><strong>{timePerGame.hours}</strong>h</>}
                            {' '}
                            {timePerGame.minutes > 0 && <><strong>{timePerGame.minutes}</strong>m</>}
                            {' '}
                            {timePerGame.seconds > 0 && <><strong>{timePerGame.seconds}</strong>s</>}
                            <span className="tooltip">
                                {t('statistics.totalGameTime')}
                                {' '}
                                {totalTime.hours > 0 && <><strong>{totalTime.hours}</strong> h</>}
                                {' '}
                                {totalTime.minutes > 0 && <><strong>{totalTime.minutes}</strong> m</>}
                                {' '}
                                {totalTime.seconds > 0 && <><strong>{totalTime.seconds}</strong> s</>}
                            </span>
                        </p>
                        {rejectedWordsPerGame > 0 && (
                            <p className="has-tooltip tooltip-relative">
                                <span dangerouslySetInnerHTML={{
                                    __html: t('statistics.averageWordsNotFound', { value: rejectedWordsPerGame.toFixed(1) })
                                }} />
                                <span className="tooltip">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: t('statistics.worstWordsNotFound', { value: rejectedWordsWorstWonInGame })
                                    }} />
                                </span>
                            </p>
                        )}
                        {rejectedWordsPerGame === 0 && rejectedWordsWorstWonInGame > 0 && (
                            <p>
                                <span dangerouslySetInnerHTML={{
                                    __html: t('statistics.worstWordsNotFoundLonger', { value: rejectedWordsWorstWonInGame })
                                }} />
                            </p>
                        )}
                    </div>
                    <p className="statistics-letters-types">
                        <span className="correct has-tooltip has-tooltip-from-left">
                            <strong>
                                {(lettersCorrect * lettersPerGame).toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersCorrect * 100} isPercentage />
                            </strong>
                            <span className="tooltip">{t('statistics.lettersCorrect')}</span>
                        </span>
                        <span className="position has-tooltip">
                            <strong>
                                {(lettersPosition * lettersPerGame).toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersPosition * 100} isPercentage />
                            </strong>
                            <span className="tooltip">{t('statistics.lettersPosition')}</span>
                        </span>
                        <span className="incorrect has-tooltip">
                            <strong>
                                {(lettersIncorrect * lettersPerGame).toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersIncorrect * 100} isPercentage />
                            </strong>
                            <span className="tooltip">{t('statistics.lettersIncorrect')}</span>
                        </span>
                        <span className="incorrect typed has-tooltip has-tooltip-from-right">
                            <strong>
                                {(lettersTypedKnownIncorrect * lettersPerGame).toFixed(1)}
                                <CircleScale breakPoints={BREAKPOINTS.LETTER_TYPES} value={lettersTypedKnownIncorrect * 100} isPercentage />
                            </strong>
                            <span className="tooltip">{t('statistics.lettersIncorrectAndTyped')}</span>
                        </span>
                    </p>
                    <div className="statistics-other">
                        <p dangerouslySetInnerHTML={{
                            __html: t('statistics.totalGames', {
                                postProcess: 'interval',
                                count: totalGames,
                            })
                        }} />
                        <p className="statistics-other-percentage">
                            <strong>{((totalWon / totalGames) * 100).toFixed(0)}<small>%</small></strong>
                            {t('statistics.totalWon')}
                        </p>
                        {canShowStreak && wonStreak > 0 && <p>
                            <strong>{wonStreak}</strong>
                            {t('statistics.totalWonStreak', {
                                postProcess: 'interval',
                                count: wonStreak
                            })}
                        </p>}
                        {canShowStreak && lostStreak > 0 && <p>
                            <strong>{lostStreak}</strong>
                            {t('statistics.totalLostStreak', {
                                postProcess: 'interval',
                                count: lostStreak
                            })}
                        </p>}
                        {canShowStreak && bestStreak > 0 && <p className="has-tooltip has-tooltip-from-right tooltip-relative">
                            <strong>{bestStreak}</strong> {t('statistics.totalBestStreak')}
                            <span className="tooltip">{t('statistics.streakTooltipWithWorstStreak')} <strong>{worstStreak}</strong></span>
                        </p>}
                    </div>
                    <footer>
                        {diffleURL.includes('github') && <IconGithub />}
                        {diffleURL}
                        {' '}
                        <StatisticsCardActiveFilters modeFilter={modeFilter} charactersFilter={charactersFilter} lengthFilter={lengthFilter} />
                    </footer>
                </div>
            </div>
        </div>
    )
};

export default StatisticsCard;
