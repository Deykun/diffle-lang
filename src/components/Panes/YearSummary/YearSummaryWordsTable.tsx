import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import Button from '@components/Button/Button';

import useEventT from './hooks/useEventT';

import YearSummaryWordsTableItem from './YearSummaryWordsTableItem';

import './YearSummaryWordsTable.scss';

type Props = {
  summary: YearSummaryInfo;
  hardestWords?: string[],
  bestWords?: string[],
};

const YearSummaryWordsTable = ({ summary, hardestWords = [], bestWords = [] }: Props) => {
  const [list, setList] = useState('easiestWords');
  const [limit, setLimit] = useState(5);

  const { t } = useTranslation();
  const { eventT } = useEventT();

  const words = list === 'easiestWords' ? bestWords : hardestWords;

  if (!summary || (hardestWords.length === 0 && bestWords.length === 0)) {
    return null;
  }

  return (
      <>
          <nav className="year-summary-nav">
              {['hardestWords', 'easiestWords'].map((listValue) => {
                return (
                    <Button
                      key={listValue}
                      onClick={() => { setList(listValue); setLimit(5); }}
                      isInverted
                      hasBorder={false}
                      isText={listValue !== list}
                    >
                        <span>
                            {eventT(`title.${listValue}`)}
                        </span>
                    </Button>
                );
              })}
          </nav>
          <div className="year-summary-table year-summary-table--word">
              <ul>
                  {words.slice(0, limit).map((word, index) => (
                      <li key={word}>
                          <YearSummaryWordsTableItem index={index} word={word} resultInfo={summary.rankByWords[word]} />
                      </li>
                  ))}
              </ul>
              {limit < 25 && (
              <Button
                onClick={() => setLimit(limit + 5)}
                isInverted
                hasBorder={false}
                isText
              >
                  {t('common.more')}

              </Button>
              )}
          </div>
      </>
  );
};

export default YearSummaryWordsTable;
