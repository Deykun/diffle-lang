import clsx from 'clsx';

import './CircleScale.scss';

interface Props {
  breakPoints: number[],
  value: number,
  shouldShowLabels?: boolean,
  isScaleOnLeft?: boolean,
  startFrom?: number,
  isInvert?: boolean,
  isPercentage?: boolean,
  isGreen?: boolean,
}

function CircleScale({
  breakPoints,
  value,
  startFrom = 0,
  shouldShowLabels = true,
  isScaleOnLeft = false,
  isInvert = false,
  isPercentage = false,
  isGreen = false,
}: Props) {
  const maxPoint = isInvert ? breakPoints.at(0) : breakPoints.at(-1);

  if (!maxPoint) {
    return null;
  }

  return (
      <span className={clsx('circle-scale', {
        'circle-scale-scale-on-left': isScaleOnLeft,
        'circle-scale-is-normal': !isInvert,
        'circle-scale-is-green': isGreen,
      })}
      >
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
                    {shouldShowLabels && (
                    <span>
                        {breakPoint}
                        {isPercentage ? '%' : ''}
                    </span>
                    )}
                </span>
            );
          })}
      </span>
  );
}

export default CircleScale;
