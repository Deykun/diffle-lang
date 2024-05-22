import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CircleScale from '@components/CircleScale/CircleScale';

import './BarChart.scss';

type Props = {
  lng?: string,
  entries: {
    [key: string]: number,
  }
};

function BarChart({
  lng,
  entries,
}: Props) {
  const { t } = useTranslation();

  const {
    dominant,
    entriesData,
  } = useMemo(() => {
    const {
      total,
      max,
      dominantKey,
    } = Object.entries(entries).reduce((stack, [key, value]) => {
      stack.total += value;

      if (value > stack.max) {
        stack.max = value;
        stack.dominantKey = key;
      }

      return stack;
    }, {
      total: 0,
      max: 0,
      dominantKey: '',
    });

    return {
      max,
      dominant: dominantKey,
      entriesData: Object.entries(entries).map(([label, value]) => ({
        label,
        value,
        percentageText: (value / total),
        percentageMax: (value / max),
      })),
    };
  }, [entries]);

  return (
      <>
          <h2 className="heatmap-keyboard-title">
              {t('statistics.languageTitleLength', { lng })}
          </h2>
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('statistics.languageDescriptionMostPopularLength', {
                lng,
                letters: dominant.split('').map(letter => `<strong class="about-language-small-key-cap">${letter}</strong>`).join(' '),
              }),
            }}
          />
          <div className="bar-chart-wrapper">
              <div className="bar-chart bar-chart--background">
                  {entriesData.map(({ label, percentageText, percentageMax }) => {
                    return (
                        <div key={`${label}-${percentageText}`} className="bar-chart-row">
                            <strong className="bar-chart-label">
                                {label.padStart(2, ' ').split('').map((digit, index) => (
                                    <span
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={`${index}-${digit}`}
                                      className="about-language-small-key-cap"
                                      data-bar-letter={digit}
                                    >
                                        {digit}
                                    </span>
                                ))}
                            </strong>
                            <span className="bar-chart-axis">
                                <span className="bar-chart-point" style={{ left: `${(percentageMax * 100).toFixed(1)}%` }}>
                                    {(percentageText * 100).toFixed(1)}
                                    %
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
                    );
                  })}
              </div>
              <div className="bar-chart bar-chart--front">
                  {entriesData.map(({ label, percentageText, percentageMax }) => {
                    return (
                        <div key={`${label}-${percentageText}`} className="bar-chart-row">
                            <strong className="bar-chart-label">
                                {label.padStart(2, ' ').split('').map((digit, index) => (
                                    <span
                                     // eslint-disable-next-line react/no-array-index-key
                                      key={`${index}-${digit}`}
                                      className="about-language-small-key-cap"
                                      data-bar-letter={digit}
                                    >
                                        {digit}
                                    </span>
                                ))}
                            </strong>
                            <span className="bar-chart-axis">
                                <span className="bar-chart-point has-tooltip" style={{ left: `${(percentageMax * 100).toFixed(1)}%` }}>
                                    <span>
                                        {(percentageText * 100).toFixed(1)}
                                        %
                                    </span>
                                    <span className="tooltip">
                                        {label}
                                        {' '}
                                        {t('end.lettersUsed', { lng, postProcess: 'interval', count: Number(label) })}
                                    </span>
                                </span>
                            </span>
                        </div>
                    );
                  })}
              </div>
          </div>
      </>
  );
}

export default BarChart;
