import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import { useSelector } from '@store';

import IconGamepad from '@components/Icons/IconGamepad';
import IconPin from '@components/Icons/IconPin';

import CircleScale from '@components/CircleScale/CircleScale';

import Button from '@components/Button/Button';

import './YearSummaryTable.scss';

type Props = {
  summary: YearSummaryInfo;
};

const periodFilters = ['year', ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(String)];

const YearSummaryTable = ({ summary }: Props) => {
  const gameLanguage = useSelector(state => state.game.language);
  const [selected, setSelected] = useState('');
  const [period, setPeriod] = useState('year');
  const [sortBy, setSortBy] = useState<
  'totalPlayed' |
  'bestMedianLetters'
  >('bestMedianLetters');

  const { t } = useTranslation();

  const usernamesBy = useMemo(() => {
    if (!summary) {
      return {
        totalPlayed: [],
        bestMedianLetters: [],
      };
    }

    // playersByTotalPlayed.
    const knownUsernames = Object.keys(summary.byUser).filter(username => summary.byUser[username][period]);

    let minimumNumberOfGamesForRanked = period === 'year' ? 50 : 4;
    if (gameLanguage !== 'pl') {
      minimumNumberOfGamesForRanked = period === 'year' ? 2 : 1;
    }

    const usersThatPlayedMoreAtleastXTimes = knownUsernames.filter(
      username => summary.byUser[username][period].gamesPlayed >= minimumNumberOfGamesForRanked,
    );

    return {
      totalPlayed: knownUsernames.sort(
        (a, b) => {
          if (summary.byUser[b][period].gamesPlayed === summary.byUser[a][period].gamesPlayed) {
            if (summary.byUser[a][period].medianLetters === summary.byUser[b][period].medianLetters) {
              return summary.byUser[a][period].medianWords - summary.byUser[b][period].medianWords;
            }

            return summary.byUser[a][period].medianLetters - summary.byUser[b][period].medianLetters;
          }

          return summary.byUser[b][period].gamesPlayed - summary.byUser[a][period].gamesPlayed
        },
      ).slice(0, 75),
      bestMedianLetters: [...usersThatPlayedMoreAtleastXTimes].sort(
        (a, b) => summary.byUser[a][period].medianLetters - summary.byUser[b][period].medianLetters,
      ).slice(0, 75),
    };
  }, [summary, period, gameLanguage]);

  if (!summary) {
    return null;
  }

  return (
      <>
          <nav>
              {Object.keys(usernamesBy).map(sortByValue => (
                  <Button
                    key={sortByValue}
                    // @ts-expect-error No one sane should define abstract types just to deal with this nonsense.
                    onClick={() => setSortBy(sortByValue)}
                    isInverted
                    hasBorder={false}
                    isText={sortByValue !== sortBy}
                  >
                      {sortByValue}
                      {/* {t(`statistics.filter${capitalize(infoLetter)}`)} */}
                  </Button>
              ))}
              <div>
                  {periodFilters.map(periodValue => (
                      <Button
                        key={periodValue}
                        onClick={() => setPeriod(periodValue)}
                        isInverted
                        hasBorder={false}
                        isText={periodValue !== period}
                      >
                          {periodValue !== 'year' ? periodValue.padStart(2, '0') : periodValue}
                      </Button>
                  ))}
              </div>
          </nav>
          <div className="year-summary-table">
              {usernamesBy[sortBy].map((username, index) => (
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
                                  {summary.byUser[username][period].gamesPlayed}
                                  {sortBy === 'totalPlayed'
                              && (
                              <CircleScale
                                breakPoints={period === 'year' ? [360, 280, 200, 140, 90, 60, 40, 20] : [20, 16, 12, 8, 4]}
                                startFrom={period === 'year' ? 0 : 6}
                                value={summary.byUser[username][period].gamesPlayed}
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
                                'year-summary-value--active': sortBy === 'bestMedianLetters',
                              })}
                              >
                                  {summary.byUser[username][period]?.medianLetters.toFixed(1)}
                              </span>
                              {sortBy === 'bestMedianLetters'
                              && (
                              <CircleScale
                                breakPoints={[32, 31, 29, 28, 27, 25, 24]}
                                startFrom={-22}
                                value={summary.byUser[username][period]?.medianLetters}
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
                          <strong className="year-summary-value">{summary.byUser[username][period]?.medianWords.toFixed(1)}</strong>
                          {' '}
                          <span>{t('statistics.medianWords')}</span>
                      </p>
                      <div className="year-summary-table-best-worst">
                          <span>
                              {'» '}
                              <span className="year-summary-table-best-worst-word">
                                {summary.byUser[username][period].worst.word}
                              </span>
                              {' «'}
                              {' '}
                              <small className="year-summary-table-best-worst-value">
                                  {summary.byUser[username][period].worst.letters}
                                  {' '}
                                  {t('end.lettersUsedShort')}
                              </small>
                          </span>
                          <span>
                              {'» '}
                              <span className="year-summary-table-best-worst-word">
                                {summary.byUser[username][period].best.word}
                              </span>
                              {' «'}
                              {' '}
                              <small className="year-summary-table-best-worst-value">
                                  {summary.byUser[username][period].best.letters}
                                  {' '}
                                  {t('end.lettersUsedShort')}
                              </small>
                          </span>
                      </div>
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
              ))}
          </div>
      </>
  );
};

export default YearSummaryTable;
