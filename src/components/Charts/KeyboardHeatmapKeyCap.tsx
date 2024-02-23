import clsx from 'clsx';

import CircleScale from '@components/CircleScale/CircleScale';

import './KeyboardHeatmapKeyCap.scss';

interface Props {
  text: string,
  value: number,
  max: number,
  all: number,
  hasCircle?: boolean,
  hasTooltip?: boolean,
}

function KeyboardHeatmapKeyCap({
  text,
  value = 0,
  max,
  all,
  hasCircle = false,
  hasTooltip = false,
}: Props) {
  const percentageCircle = value / max;
  const percentageText = value / all;

  let precision = 3;

  if (percentageText < 0.05) {
    precision = 2;
  } else if (percentageText < 0.10) {
    precision = 1;
  }

  return (
      <span className={clsx('heatmap-keyboard-cap', {
        'has-tooltip': hasTooltip,
      })}
      >
          <span className="heatmap-keyboard-cap-content">
              {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
              {text.replace('ß', 'ẞ')}
          </span>
          {hasCircle && (
          <CircleScale
            startFrom={10}
            breakPoints={[5, 10, 15, 30, 50, 75, 100]}
            value={percentageCircle * 100}
            shouldShowLabels={false}
            isGreen
          />
          )}
          {hasTooltip && (
          <span className="tooltip">
              {(percentageText * 100).toFixed(precision)}
              %
          </span>
          )}
      </span>
  );
}

export default KeyboardHeatmapKeyCap;
