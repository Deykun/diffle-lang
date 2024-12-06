import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { YearSummaryInfo, ResultsInfo } from '@common-types';

import { useSelector } from '@store';

import IconGamepad from '@components/Icons/IconGamepad';
import IconCrown from '@components/Icons/IconCrown';
import IconPin from '@components/Icons/IconPin';

import CircleScale from '@components/CircleScale/CircleScale';

import Button from '@components/Button/Button';

import './YearSummaryTable.scss';

type Props = {
  summary: YearSummaryInfo;
};

const YearSummaryTableItem = ({
  index,
  key,
  summary,
  sortBy,
  period,
  username,
  selected,
  setSelected,
}: Props) => {
  const { t } = useTranslation();

  const resultsData = sortBy === 'bestMedianFrom50BestResults'
    ? summary.byUser[username].best50 as ResultsInfo
    : summary.byUser[username].results[period] as ResultsInfo;

  const totalBestDaily = sortBy === 'bestMedianFrom50BestResults' ? 0 : summary.byUser[username].dates[period]?.length;
  const {
    gamesPlayed,
    medianLetters,
    worst,
    best,
  } = resultsData;

  return (
      <div className={clsx('year-summary-table-row', { 'year-summary-table-row--active': selected === username })}>
          <div className="year-summary-table-row-title">
              <h3>
                  <span>
                      {index + 1}
                      .
                  </span>
                  {username}
              </h3>
              <strong className="year-summary-table-games">
                  <span className={clsx('year-summary-value', { 'year-summary-value--active': sortBy === 'totalPlayed' })}>
                      {gamesPlayed}
                      {sortBy === 'totalPlayed'
                        && (
                        <CircleScale
                          breakPoints={period === 'year' ? [360, 280, 200, 140, 90, 60, 40, 20] : [20, 16, 12, 8, 4]}
                          startFrom={period === 'year' ? 0 : 6}
                          value={gamesPlayed}
                          shouldShowLabels={false}
                        />
                        )}
                  </span>
                  <IconGamepad />
              </strong>
          </div>
          <p>
              <strong className="year-summary-table-letters">
                  <span className={clsx('year-summary-value', {
                    'year-summary-value--active': ['bestMedianLetters', 'bestMedianFrom50BestResults'].includes(sortBy),
                  })}
                  >
                      {medianLetters.toFixed(1)}
                  </span>
                  {['bestMedianLetters', 'bestMedianFrom50BestResults'].includes(sortBy)
                    && (
                    <CircleScale
                      breakPoints={[32, 31, 29, 28, 27, 25, 24]}
                      startFrom={-22}
                      value={medianLetters}
                      shouldShowLabels={false}
                      isInvert
                    />
                    )}
              </strong>
              {' '}
              <span>
                  {t('statistics.letters')}
              </span>
              {' '}
              <span>{t('statistics.medianWordsBefore')}</span>
              {' '}
              <strong className="year-summary-value">{summary.byUser[username].results[period]?.medianWords.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.medianWords')}</span>
          </p>
          <div className="year-summary-table-best-worst">
              <span>
                  {'» '}
                  <span className="year-summary-table-best-worst-word">
                      {worst.word}
                  </span>
                  {' «'}
                  {' '}
                  <small className="year-summary-table-best-worst-value">
                      {worst.letters}
                      {' '}
                      {t('end.lettersUsedShort')}
                  </small>
              </span>
              <span>
                  {'» '}
                  <span className="year-summary-table-best-worst-word">
                      {best.word}
                  </span>
                  {' «'}
                  {' '}
                  <small className="year-summary-table-best-worst-value">
                      {best.letters}
                      {' '}
                      {t('end.lettersUsedShort')}
                  </small>
              </span>
          </div>
          {totalBestDaily > 0 && (
          <strong className="year-summary-table-daily">
              <IconCrown />
              <span className={clsx('year-summary-value', { 'year-summary-value--active': sortBy === 'bestDailyResults' })}>
                  {totalBestDaily}
                  {sortBy === 'bestDailyResults'
                    && (
                    <CircleScale
                      breakPoints={period === 'year' ? [50, 40, 30, 20, 10, 5] : [14, 12, 9, 8, 6, 5, 3, 2]}
                      value={totalBestDaily}
                      shouldShowLabels={false}
                    />
                    )}
              </span>
          </strong>
          )}
          <Button
            className="year-summary-value-pin-button"
            onClick={() => setSelected((previousUsername) => {
              return previousUsername === username ? '' : username;
            })}
            isInverted
            hasBorder={false}
            isText={selected !== username}
          >
              <IconPin />
          </Button>
      </div>
  );
};

export default YearSummaryTableItem;
