import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { YearSummaryInfo } from '@common-types';

import { useSelector } from '@store';

import IconLoader from '@components/Icons/IconLoader';

import YearSummaryHeader from './YearSummaryHeader';
import YearSummaryTable from './YearSummaryTable';

import './YearSummary.scss';

const getSummaryData = async (
  lang: string | undefined,
  year: number,
): Promise<YearSummaryInfo | undefined> => {
  if (!lang) {
    return undefined;
  }

  const response = await fetch(`./year-summary/${year}/${lang}-info.json`);
  const rawData = await response.json();

  return rawData;
};

const Summary = () => {
  const [year] = useState(location.href?.includes('24') ? 2024 : 2025);
  const gameLanguage = useSelector(state => state.game.language);

  const {
    isLoading,
    // error,
    data,
  } = useQuery({
    queryFn: () => getSummaryData(gameLanguage, year),
    queryKey: [`year-${gameLanguage}`, year, gameLanguage],
  });

  return (
      <div className="summary">
          {isLoading && <IconLoader className="summary-content-loader" />}
          {data && (
          <>
              <YearSummaryHeader summary={data} year={year} />
              <YearSummaryTable summary={data} year={year} />
          </>
          )}
      </div>
  );
};

export default Summary;
