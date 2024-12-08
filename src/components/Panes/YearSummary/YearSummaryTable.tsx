import { useMemo, useState } from 'react';

import { YearSummaryInfo } from '@common-types';

import { useSelector } from '@store';

import Button from '@components/Button/Button';

import useEventT from './hooks/useEventT';

import YearSummaryTableItem from './YearSummaryTableItem';
import YearSummaryWordsTable from './YearSummaryWordsTable';


import './YearSummaryTable.scss';

type Props = {
  summary: YearSummaryInfo;
};

const listFilters = [
  'bestDailyResults',
  'bestMedianLetters',
  'totalPlayed',
  'bestMedianFrom50BestResults',
  'bestMedianFrom50HardestWordsResults',
];

const periodFilters = ['year', ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(String)];

const YearSummaryTable = ({ summary }: Props) => {
  const gameLanguage = useSelector(state => state.game.language);
  const [selected, setSelected] = useState('');
  const [period, setPeriod] = useState('year');
  const [sortBy, setSortBy] = useState<
  'bestDailyResults' |
  'bestMedianLetters' |
  'totalPlayed' |
  'bestMedianFrom50BestResults' |
  'bestMedianFrom50HardestWordsResults'
  >('bestMedianLetters');

  const { eventT } = useEventT();

  const dataBy = useMemo(() => {
    if (!summary) {
      return {
        totalPlayed: [],
        bestMedianLetters: [],
      };
    }

    const knownUsernames = Object.keys(summary.byUser).filter(username => summary.byUser[username].results[period]);

    let minimumNumberOfGamesForRanked = period === 'year' ? 50 : 4;
    if (gameLanguage !== 'pl') {
      minimumNumberOfGamesForRanked = period === 'year' ? 5 : 1;
    }

    const usersThatPlayedMoreAtleastXTimes = knownUsernames.filter(
      username => summary.byUser[username].results[period].gamesPlayed >= minimumNumberOfGamesForRanked,
    );

    // rankByWords

    return {
      totalPlayed: knownUsernames.sort(
        (a, b) => {
          if (summary.byUser[b].results[period].gamesPlayed === summary.byUser[a].results[period].gamesPlayed) {
            if (summary.byUser[a].results[period].medianLetters === summary.byUser[b].results[period].medianLetters) {
              return summary.byUser[a].results[period].medianWords - summary.byUser[b].results[period].medianWords;
            }

            const bestB = (summary.byUser[b].dates[period]?.length || 0);
            const bestA = (summary.byUser[a].dates[period]?.length || 0);
            if (bestA !== bestB) {
              return bestB - bestA;
            }

            return summary.byUser[a].results[period].medianLetters - summary.byUser[b].results[period].medianLetters;
          }

          return summary.byUser[b].results[period].gamesPlayed - summary.byUser[a].results[period].gamesPlayed;
        },
      ),
      bestMedianLetters: [...usersThatPlayedMoreAtleastXTimes].sort(
        (a, b) => summary.byUser[a].results[period].medianLetters - summary.byUser[b].results[period].medianLetters,
      ).slice(0, 75),
      bestMedianFrom50BestResults: [...knownUsernames].filter(
        username => Boolean(summary.byUser[username].best50),
      ).sort(
        (a, b) => {
          if (summary.byUser[a].best50.medianLetters === summary.byUser[b].best50.medianLetters) {
            if (summary.byUser[a].results[period].medianWords === summary.byUser[b].results[period].medianWords) {
              return summary.byUser[a].results.year.gamesPlayed - summary.byUser[b].results.year.gamesPlayed;
            }

            return summary.byUser[a].results[period].medianWords - summary.byUser[b].results[period].medianWords;
          }

          return summary.byUser[a].best50.medianLetters - summary.byUser[b].best50.medianLetters;
        },
      ).slice(0, 75),
      bestMedianFrom50HardestWordsResults: [...knownUsernames].filter(
        username => Boolean(summary.byUser[username].hardest50),
      ).sort(
        (a, b) => {
          if (summary.byUser[a].hardest50.medianLetters === summary.byUser[b].hardest50.medianLetters) {
            if (summary.byUser[a].results[period].medianWords === summary.byUser[b].results[period].medianWords) {
              return summary.byUser[a].results.year.gamesPlayed - summary.byUser[b].results.year.gamesPlayed;
            }

            return summary.byUser[a].results[period].medianWords - summary.byUser[b].results[period].medianWords;
          }

          return summary.byUser[a].hardest50.medianLetters - summary.byUser[b].hardest50.medianLetters;
        },
      ).slice(0, 75),
      bestDailyResults: [...knownUsernames].sort(
        (a, b) => {
          const bestB = (summary.byUser[b].dates[period]?.length || 0);
          const bestA = (summary.byUser[a].dates[period]?.length || 0);
          if (bestA === bestB) {
            if (summary.byUser[a].results[period].medianLetters === summary.byUser[b].results[period].medianLetters) {
              return summary.byUser[a].results[period].medianWords - summary.byUser[b].results[period].medianWords;
            }

            return summary.byUser[a].results[period].medianLetters - summary.byUser[b].results[period].medianLetters;
          }

          return bestB - bestA;
        },
      ).slice(0, 75),
      hardestWords: summary.hardestWords,
      bestWords: summary.bestWords,
    };
  }, [summary, period, gameLanguage]);

  if (!summary || !gameLanguage) {
    return null;
  }

  return (
      <>
          <YearSummaryWordsTable summary={summary} bestWords={dataBy.bestWords} hardestWords={dataBy.hardestWords} />
          <nav className="year-summary-nav">
              {listFilters.map((sortByValue) => {
                return (
                    <Button
                      key={sortByValue}
                      // @ts-expect-error No one sane should define abstract types just to deal with this nonsense.
                      onClick={() => setSortBy(sortByValue)}
                      isInverted
                      hasBorder={false}
                      isText={sortByValue !== sortBy}
                      isDisabled={period !== 'year'
                      && ['bestMedianFrom50BestResults', 'bestMedianFrom50HardestWordsResults'].includes(sortByValue)}
                    >
                        <span>

                            {eventT(`label.${sortByValue}`)}
                            {eventT(`label.description.${sortByValue}`, '') && (
                            <small>
                                {' '}
                                {eventT(`label.description.${sortByValue}`)}
                            </small>
                            )}
                        </span>

                    </Button>
                );
              })}
              <div
                className="year-summary-period-nav"
                style={{ opacity: ['bestMedianFrom50BestResults', 'bestMedianFrom50HardestWordsResults'].includes(sortBy) ? 0 : 100 }}
              >
                  {periodFilters.map(periodValue => (
                      <Button
                        key={periodValue}
                        onClick={() => setPeriod(periodValue)}
                        isInverted
                        hasBorder={false}
                        isText={periodValue !== period}
                        isDisabled={['bestMedianFrom50BestResults', 'bestMedianFrom50HardestWordsResults'].includes(sortBy)}
                      >
                          {periodValue !== 'year' ? periodValue : 2024}
                      </Button>
                  ))}
              </div>
          </nav>
          <div className="year-summary-table">
              {(dataBy[sortBy] || []).map((username, index) => (
                  <YearSummaryTableItem
                    index={index}
                    key={username}
                    summary={summary}
                    sortBy={sortBy}
                    period={period}
                    username={username}
                    selected={selected}
                    setSelected={setSelected}
                  />
              ))}
          </div>
      </>
  );
};

export default YearSummaryTable;
