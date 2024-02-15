import clsx from 'clsx';

import CircleScale from '@components/CircleScale/CircleScale';

import './KeyboardHeatmapKeyCap.scss'

interface Props {
    text: string,
    value: number,
    min: number,
    max: number,
    middle: number,
    all: number,
    hasCircle?: boolean,
    hasTooltip?: boolean,
}

const KeyboardHeatmapKeyCap = ({
    text,
    value = 0,
    max,
    all,
    hasCircle = false,
    hasTooltip = false,
}: Props) => {
    const percentageCircle = value / max;
    const percentageText = value / all;

    const precision = percentageText > 0.10 ?
        1 : percentageText > 0.05 ?
        2 : 3;

    return (
        <span className={clsx('heatmap-keyboard-cap', {
            'has-tooltip': hasTooltip,
        })}>
            <span className="heatmap-keyboard-cap-content">
                {text}
            </span>
            {hasCircle && <CircleScale startFrom={10} breakPoints={[5, 10, 15, 30, 50, 75, 100]} value={percentageCircle * 100} shouldShowLabels={false} isGreen />}
            {hasTooltip && <span className="tooltip">{(percentageText * 100).toFixed(precision)}%</span>}
        </span>
    )
};

export default KeyboardHeatmapKeyCap;
