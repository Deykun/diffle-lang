import { useQuery } from '@tanstack/react-query';

import { YearSummaryInfo } from '@common-types';

import { useSelector } from '@store';

import IconLoader from '@components/Icons/IconLoader';

import YearSummaryHeader from './YearSummaryHeader';
import YearSummaryTable from './YearSummaryTable';

import './YearSummary.scss';

const getSummaryData = async (
  lang: string | undefined,
): Promise<YearSummaryInfo | undefined> => {
  if (!lang) {
    return undefined;
  }

  const response = await fetch(`./year-summary/${lang}-info.json`);
  const rawData = await response.json();

  return rawData;
};

const Summary = () => {
  const gameLanguage = useSelector(state => state.game.language);

  const {
    isLoading,
    // error,
    data,
  } = useQuery({
    queryFn: () => getSummaryData(gameLanguage),
    queryKey: [`year-${gameLanguage}`, gameLanguage],
  });

  return (
      <div className="summary">
          {isLoading && <IconLoader className="summary-content-loader" />}
          {data && (
          <>
              <YearSummaryHeader summary={data} />
              <YearSummaryTable summary={data} />
          </>
          )}
      </div>
  );
};

export default Summary;
