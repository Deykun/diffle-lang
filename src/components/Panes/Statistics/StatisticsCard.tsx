import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import { StatisticDataForCard, Filters } from '@utils/statistics';
import { getNow } from '@utils/date';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconPicture from '@components/Icons/IconPicture';

import Button from '@components/Button/Button';

import CircleScale from './CircleScale';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import StatisticsCardActiveFilters from './StatisticsCardActiveFilters';

import './StatisticsCard.scss';

interface StatisticForCard extends StatisticDataForCard, Filters {
    streak?: number,
    bestStreak?: number,
}

const BREAKPOINTS = {
    LETTERS: [90, 75, 60, 45, 35, 25],
    WORDS: [15, 13, 11, 9, 7, 5],
    LETTER_TYPES: [10, 25, 40, 55],
};

const START_FROM = {
    LETTERS: -10,
    WORDS: -2.5,
}

const StatisticsCard = ({
    totalGames,
    totalWon,
    streak,
    bestStreak,
    rejectedWordsPerGame,
    lettersPerGame,
    averageLettersPerGame,
    wordsPerGame,
    averageWordsPerGame,
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
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleDownload = async () => {
        const  domElement = document.getElementById('sharable-card');

        if (!domElement) {
            return;
        }
    
        try {
            const dataUrl = await htmlToImage.toJpeg(domElement);

            const { stamp, stampOnlyTime } = getNow();
            const fullStamp = `${stamp} ${stampOnlyTime}`;
            
            download(dataUrl, `DIFFLE ${fullStamp}.jpeg`);
        } catch (error) {
            console.error(error);

            dispatch(setToast({ text: `common.downloadError` }));
        }
    };

    return (
        <>
            <div className="statistics-card" id="sharable-card">
                <IconDiffleChart className="statistics-card-icon" />
                <p className={clsx('statistics-letters', 'has-tooltip')}>
                    <strong>
                        {lettersPerGame.toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.LETTERS} startFrom={START_FROM.LETTERS} value={lettersPerGame} isInvert isScaleOnLeft/>
                    </strong>
                    <span>{t('statistics.letters')}</span>
                    <span className="tooltip">{t('statistics.medianTooltipWithAverage')} {averageLettersPerGame.toFixed(1)}</span>
                </p>
                <p className={clsx('statistics-words', 'has-tooltip')}>
                    <span>{t('statistics.medianWordsBefore')}</span>
                    <strong>
                        {wordsPerGame.toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.WORDS} startFrom={START_FROM.WORDS} value={wordsPerGame} isInvert />
                    </strong>
                    <span>{t('statistics.medianWords')}</span>
                    <span className="tooltip">{t('statistics.medianTooltipWithAverage')} {averageWordsPerGame.toFixed(1)}</span>
                </p>
                <div className="statistics-text">
                
                    <p>{t('statistics.averageLetters')} <strong>{lettersPerWord.toFixed(1)}</strong> {t('statistics.inWord')}</p>
                    <p>{t('statistics.averageLetters')} <strong>{lettersInFirstWord.toFixed(1)}</strong> {t('statistics.inFirstWord')}</p>
                    <p>{t('statistics.averageLetters')} <strong>{lettersInSecondWord.toFixed(1)}</strong> {t('statistics.inSecondWord')}</p>
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
                            {totalTime.hours > 0 && `${totalTime.hours} h`}
                            {' '}
                            {totalTime.minutes > 0 && `${totalTime.minutes} m`}
                            {' '}
                            {totalTime.seconds > 0 && `${totalTime.seconds} s`}
                        </span>
                    </p>
                    {rejectedWordsPerGame > 0 && (
                        <p dangerouslySetInnerHTML={{
                            __html: t('statistics.averageWordsNotFound', { value: rejectedWordsPerGame.toFixed(1) })
                        }} />
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
                    <p dangerouslySetInnerHTML={{
                        __html: t('statistics.totalWon', {
                            postProcess: 'interval',
                            count: totalWon,
                        })
                    }} />
                    {bestStreak && bestStreak > 0 && <>
                        <p><strong>{streak}</strong> {t('statistics.totalStreak')}</p>
                        <p><strong>{bestStreak}</strong> {t('statistics.totalBestStreak')}</p>
                    </>}
                </div>
                <footer>
                    {location.href}
                    {' '}
                    <StatisticsCardActiveFilters modeFilter={modeFilter} charactersFilter={charactersFilter} lengthFilter={lengthFilter} />
                </footer>
            </div>
            <div className="statistics-card-actions">
                <Button onClick={handleDownload} isInverted>
                    <IconPicture />
                    <span>{t('common.download')}</span>
                </Button>
            </div>
        </>
    )
};

export default StatisticsCard;
