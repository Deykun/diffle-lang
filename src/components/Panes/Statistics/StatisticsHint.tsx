import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane, GameMode } from '@common-types';

import { useSelector } from '@store';

import { getStreakForFilter } from '@utils/statistics';

import Button from '@components/Button/Button';

import usePanes from '@hooks/usePanes';

import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconHeartStreak from '@components/Icons/IconHeartStreak';

import './StatisticsHint.scss';

const StatisticsHint = () => {
    const gameMode = useSelector((state) => state.game.mode);

    const { t } = useTranslation();

    const { changePane } = usePanes();

    const { wonStreak } = useMemo(() => {
        return getStreakForFilter({ modeFilter: gameMode })
    }, [gameMode]);

    const handleClick = useCallback(() => {
        changePane(Pane.Statistics);
    }, [changePane]);

    const isDailyMode = gameMode === GameMode.Daily;
    const isNiceNumberToHint = [5, 10].includes(wonStreak) || (wonStreak % 25 === 0 && wonStreak !== 0);
    const shouldRender = isDailyMode && isNiceNumberToHint;

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
