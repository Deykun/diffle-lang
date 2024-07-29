import { useMemo } from 'react';
import { SUPPORTED_LANGS } from '@const';
import {
  StatisticDataForCard,
  Statistic,
  getStatisticForFilter,
  mergeStatistics,
  getStatisticCardDataFromStatistics,
} from '@utils/statistics';

import { ALL_DATA_FILTERS } from '@components/Panes/Statistics/constants';

import SummaryAll from './SummaryAll';

import './Summary.scss';

const Summary = () => {
  const { all, byLang } = useMemo(() => {
    const statisticsByLang = SUPPORTED_LANGS.reduce((stack: { [lang: string]: Statistic }, lang) => {
      const statisticForLang = getStatisticForFilter(lang, ALL_DATA_FILTERS);
      if (statisticForLang.totals.won > 0) {
        stack[lang] = getStatisticForFilter(lang, ALL_DATA_FILTERS);
      }

      return stack;
    }, {});

    const allLangs = mergeStatistics(Object.values(statisticsByLang));

    return {
      all: getStatisticCardDataFromStatistics(allLangs),
      byLang: {
        ...Object.entries(statisticsByLang).reduce((stack: { [lang: string]: StatisticDataForCard }, [lang, statistic]) => {
          stack[lang] = getStatisticCardDataFromStatistics(statistic);

          return stack;
        }, {}),
      },
    };
  }, []);

  return (
      <div className="summary">
          <SummaryAll all={all} byLang={byLang} />
      </div>
  );
};

export default Summary;
