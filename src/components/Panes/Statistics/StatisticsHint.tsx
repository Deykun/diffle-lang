import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane } from '@common-types';

import { useSelector } from '@store';

import {
    getStatistic,
    getStatisticParamsForWord,
    getStreakForFilter,
} from '@utils/statistics';

import Button from '@components/Button/Button';

import usePanes from '@hooks/usePanes';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import './StatisticsHint.scss';

const StatisticsHint = () => {
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const gameLanguage = useSelector((state) => state.game.language);
    const lastWordAddedToStatitstic = useSelector((state) => state.game.lastWordAddedToStatitstic);
    const gameMode = useSelector((state) => state.game.mode);

    const { t } = useTranslation();

    const { changePane } = usePanes();

    const { wonStreak } = useMemo(() => {
        try {
            if (!gameLanguage) {
                return { wonStreak: 0 };
            }

            if (lastWordAddedToStatitstic ){
                return getStreakForFilter(gameLanguage, { modeFilter: gameMode });
            } else {
                const {
                    isShort,
                    hasSpecialCharacters,
                } = getStatisticParamsForWord(wordToGuess);

                const {
                    lastGame: {
                        word: lastIndexeWord,
                    } = {},
                } = getStatistic({ gameLanguage, gameMode, hasSpecialCharacters, isShort });
        
                if (lastIndexeWord === wordToGuess) {
                    return getStreakForFilter(gameLanguage, { modeFilter: gameMode });
                }
            }
        } catch {
            //
        }

        return { wonStreak: 0 };
    }, [gameLanguage, gameMode, wordToGuess, lastWordAddedToStatitstic]);

    const handleClick = useCallback(() => {
        changePane(Pane.Statistics, { modeFilter: gameMode });
    }, [changePane, gameMode]);

    const isNiceNumberToHint = [5, 10].includes(wonStreak) || (wonStreak % 25 === 0 && wonStreak !== 0);
    const shouldRender = gameLanguage && isNiceNumberToHint;

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="statistics-hint">
            <p className="has-tooltip tooltip-relative">
                <IconHeartStreak />
                <strong>{wonStreak}</strong>
                <span className="tooltip">
                    {t('statistics.totalWonStreak', {
                        postProcess: 'interval',
                        count: wonStreak
                    })}
                </span>
            </p>
            <Button onClick={handleClick} isInverted isText hasBorder={false}>
                <IconDiffleChart />
                <span>{t('settings.statisticsTitle')}</span>
            </Button>
        </div>
    )
};

export default StatisticsHint;
