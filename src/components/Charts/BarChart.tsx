import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { formatLargeNumber } from '@utils/format';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { capitalize } from '@utils/format';

import CircleScale from '@components/CircleScale/CircleScale';

import KeyboardHeatmapKeyCap from './KeyboardHeatmapKeyCap'
import './BarChart.scss'

interface Props {
    entries: {
        [key: string]: number,
    }
}

const BarChart = ({
    entries = [],
}: Props) => {
    const { t } = useTranslation();

    const entriesData = useMemo(() => {
        const {
            total,
            max,
        } = Object.entries(entries).reduce((stack, [_, value]) => {

            return {
                total: stack.total + value,
                max: value > stack.max ? value : stack.max,
            };
        }, {
            total: 0,
            max: 0,
        });

        return Object.entries(entries).map(([label, value]) => ({
            label,
            value,
            percentageText: (value / total),
            percentageMax: (value / max),
        }));
    }, [entries]);

    return (
        <>
            <h2 className="heatmap-keyboard-title">
                {/* {t(`statistics.languageTitleHighestLetterFor${capitalize(groupBy)}`)} */}
                Popularność długości słowa
            </h2>
            <p className="heatmap-keyboard-description">
                Najpopularniejsza długość słowa to <strong className="keyboard-heatmap-max-letter">1</strong><strong className="keyboard-heatmap-max-letter">2</strong> liter.
            </p>
            <div className="bar-chart-wrapper">
                <div className="bar-chart bar-chart--background">
                    {entriesData.map(({ label, value, percentageText, percentageMax }) => {
                        return <div className="bar-chart-row">
                            <strong className="bar-chart-label">
                                {label.padStart(2, ' ').split('').map((letter) => (
                                    <span data-bar-letter={letter}>
                                        {letter}
                                    </span>
                                ))}
                            </strong>
                            <span className="bar-chart-axis">
                                <span className="bar-chart-point" style={{ left: `${(percentageMax * 100).toFixed(1)}%` }}>
                                    {(percentageText * 100).toFixed(1)}%
                                    <CircleScale
                                        startFrom={15}
                                        breakPoints={[0, 5, 15, 30, 50, 75, 100]}
                                        value={percentageMax * 100}
                                        shouldShowLabels={false}
                                        isGreen
                                    />
                                </span>
                            </span>
                        </div>
                    })}
                </div>
                <div className="bar-chart bar-chart--front">
                    {entriesData.map(({ label, value, percentageText, percentageMax }) => {
                        return <div className="bar-chart-row">
                            <strong className="bar-chart-label">
                                {label.padStart(2, ' ').split('').map((letter) => (
                                    <span data-bar-letter={letter}>
                                        {letter}
                                    </span>
                                ))}
                            </strong>
                            <span className="bar-chart-axis">
                                <span className="bar-chart-point" style={{ left: `${(percentageMax * 100).toFixed(1)}%` }}>
                                    {(percentageText * 100).toFixed(1)}%
                                </span>
                                {/* <span className="bar-chart-value">{(percentageText * 100).toFixed(1)}% {(percentageMax * 100).toFixed(1)}% {formatLargeNumber(value)}</span> */}
                            </span>
                        </div>
                    })}
                </div>
            </div>
        </>
    );
};

export default BarChart;
