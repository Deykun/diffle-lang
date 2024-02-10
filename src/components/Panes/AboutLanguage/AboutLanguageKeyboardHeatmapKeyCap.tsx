import clsx from 'clsx';

import CircleScale from '@components/CircleScale/CircleScale';

import './AboutLanguageKeyboardHeatmapKeyCap.scss'

interface Props {
    text: string,
    value: number,
    min: number,
    max: number,
    middle: number,
}

const AboutLanguageKeyboardHeatmapKeyCap = ({
    text,
    value = 0,
    min,
    max,
    middle,
}: Props) => {
    const percentage = value / max;
    const isHot = value >= middle;
    const heatOpacity = isHot ?
        ((max - middle + value - middle) / (2 * (max - middle)))
        : (value / 2) / middle;

    return (
        <span className={clsx('heatmap-keyboard-cap', 'has-tooltip', 'has-tooltip-from-left', {
            'heatmap-keyboard-cap--hot': isHot,
            'heatmap-keyboard-cap--cold': !isHot,
        })}>
            <span className="heatmap-keyboarc-cap-heat" style={{ opacity: heatOpacity }}></span>
            <span className="heatmap-keyboard-cap-content">
                {text}
            </span>
            <CircleScale startFrom={20} breakPoints={[5, 10, 15, 30, 60, 90, 100]} value={percentage * 100} shouldShowLabels={false} isGreen />
            <span className="tooltip">{(percentage * 100).toFixed(percentage < 0.03 ? 2 : 1)}%</span>
        </span>
    )
};

export default AboutLanguageKeyboardHeatmapKeyCap;
