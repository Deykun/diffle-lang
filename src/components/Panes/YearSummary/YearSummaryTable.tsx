import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import { useSelector } from '@store';

import IconGamepad from '@components/Icons/IconGamepad';
import IconPin from '@components/Icons/IconPin';

import CircleScale from '@components/CircleScale/CircleScale';

import Button from '@components/Button/Button';

import YearSummaryTableItem from './YearSummaryTableItem';

import './YearSummaryTable.scss';

type Props = {
  summary: YearSummaryInfo;
};

const periodFilters = ['year', ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(String)];

const sortByLabelByValue = {
  en: {
    totalPlayed: 'Games',
    bestMedianLetters: 'Median',
    bestDailyResults: "Day's best result",
    bestMedianFrom50BestResults: 'Median (Top 50)',
  },
  pl: {
    totalPlayed: 'Gry',
    bestMedianLetters: 'Mediana',
    bestDailyResults: 'Wynik dnia',
    bestMedianFrom50BestResults: 'Mediana (Top 50)',
  },
};

const YearSummaryTable = ({ summary }: Props) => {
  const gameLanguage = useSelector(state => state.game.language);
  const [selected, setSelected] = useState('');
  const [period, setPeriod] = useState('year');
  const [sortBy, setSortBy] = useState<
  'totalPlayed' |
  'bestMedianLetters' |
  'bestMedianFrom50BestResults' |
  'bestDailyResults'
  >('bestMedianLetters');

  const { t } = useTranslation();

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
      ).slice(0, 75),
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
      worstWords: [...Object.keys(summary.rankByWords)].sort(
        (a, b) => summary.rankByWords[b].medianLetters - summary.rankByWords[a].medianLetters,
      ).slice(0, 10),
      bestWords: [...Object.keys(summary.rankByWords)].sort(
        (a, b) => summary.rankByWords[a].medianLetters - summary.rankByWords[b].medianLetters,
      ).slice(0, 10),
    };
  }, [summary, period, gameLanguage]);

  if (!summary) {
    return null;
  }

  return (
      <>
          <div>
              <div>
                  <h3>Hardest to guess</h3>
                  <ul>
                      {(dataBy?.worstWords || []).map(word => (
                          <li>
                              {word}
                          </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <h3>Easist to guess</h3>
                  <ul>
                      {(dataBy?.bestWords || []).map(word => (
                          <li>
                              {word}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
          <nav>
              {['bestDailyResults', 'bestMedianLetters', 'bestMedianFrom50BestResults', 'totalPlayed'].map(sortByValue => (
                  <Button
                    key={sortByValue}
                    // @ts-expect-error No one sane should define abstract types just to deal with this nonsense.
                    onClick={() => setSortBy(sortByValue)}
                    isInverted
                    hasBorder={false}
                    isText={sortByValue !== sortBy}
                    isDisabled={period !== 'year' && sortByValue === 'bestMedianFrom50BestResults'}
                  >
                      {sortByLabelByValue[gameLanguage][sortByValue] || sortByLabelByValue.en[sortByValue]}
                  </Button>
              ))}
              <div className="year-summary-period-nav">
                  {periodFilters.map(periodValue => (
                      <Button
                        key={periodValue}
                        onClick={() => setPeriod(periodValue)}
                        isInverted
                        hasBorder={false}
                        isText={periodValue !== period}
                        isDisabled={sortBy === 'bestMedianFrom50BestResults'}
                      >
                          {periodValue !== 'year' ? periodValue : 2024}
                      </Button>
                  ))}
              </div>
          </nav>
          <div className="year-summary-table">
              {dataBy[sortBy].map((username, index) => (
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
