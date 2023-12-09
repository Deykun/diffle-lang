import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import { StatisticForCard } from '@utils/statistics';
import { getNow } from '@utils/date';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconPicture from '@components/Icons/IconPicture';

import Button from '@components/Button/Button';

import CircleScale from './CircleScale';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

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
                        <CircleScale breakPoints={BREAKPOINTS.LETTERS_AVERAGE} startFrom={START_FROM.LETTERS_AVERAGE} value={lettersPerGame} isInvert isScaleOnLeft/>
                    </strong>
                    <span>{t('statistics.letters')}</span>
                    <span className="tooltip">{t('statistics.medianTooltip')}</span>
                </p>
                <p className={clsx('statistics-words', 'has-tooltip')}>
                    <span>{t('statistics.medianWordsBefore')}</span>
                    <strong>
                        {wordsPerGame.toFixed(1)}
                        <CircleScale breakPoints={BREAKPOINTS.WORDS_AVERAGES} startFrom={START_FROM.WORDS_AVERAGES} value={wordsPerGame} isInvert />
                    </strong>
                    <span>{t('statistics.medianWords')}</span>
                    <span className="tooltip">{t('statistics.medianTooltip')}</span>
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
