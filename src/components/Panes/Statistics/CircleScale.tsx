import clsx from 'clsx';

import './CircleScale.scss'

interface Props {
    breakPoints: number[],
    value: number,
    isScaleOnLeft?: boolean,
    startFrom?: number,
    isInvert?: boolean,
    isPercentage?: boolean,
}

const CircleScale = ({
    breakPoints,
    value,
    startFrom = 0,
    isScaleOnLeft = false,
    isInvert = false,
    isPercentage = false,
}: Props) => {
    const maxPoint = isInvert ? breakPoints.at(0) : breakPoints.at(-1);

    if (!maxPoint) {
        return null;
    }

    return (
        <div className={clsx('circle-scale', {
            'circle-scale-scale-on-left': isScaleOnLeft,
            'circle-scale-is-normal': !isInvert,
        })}>
            {breakPoints.map((breakPoint) => {
                const progressX = ((breakPoint + startFrom) / maxPoint);
            
                return (
                    <span
                    key={breakPoint}
                    className={clsx('circle-scale-border', {
                        'circle-scale-border-checked': isInvert ? value <= breakPoint : value >= breakPoint,
                    })}
                    style={{ width: `${progressX * 100}%` }}
                    >
                        <span>{breakPoint}{isPercentage ? '%' : ''}</span>
                    </span>
                );
            })}
        </div>
    )
};

export default CircleScale;
