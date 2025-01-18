import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ResultsInfo } from '@common-types';

import IconGamepad from '@components/Icons/IconGamepad';

import CircleScale from '@components/CircleScale/CircleScale';

import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';

type Props = {
  index: number,
  word: string,
  resultInfo?: ResultsInfo,
};

const YearSummaryWordsTableItem = ({
  index,
  word,
  resultInfo,
}: Props) => {
  const { t } = useTranslation();

  if (!resultInfo) {
    return null;
  }

  const {
    gamesPlayed,
    medianLetters,
    medianWords,
  } = resultInfo;

  return (
      <div className={clsx('year-summary-table-row-word')}>
          <div className="year-summary-table-row-title">
              <h3>
                  <span>
                      {index + 1}
                      .
                  </span>
                  {/* » */}
                  {/* {' '} */}
                  {word}
                  {/* {' '} */}
                  {/* « */}
              </h3>
              <strong className="year-summary-table-games">
                  <span className={clsx('year-summary-value')}>
                      {gamesPlayed}
                  </span>
                  <IconGamepad />
              </strong>
          </div>
          <p>
              <strong className="year-summary-table-letters">
                  <span className={clsx('year-summary-value', {
                    'year-summary-value--active': true,
                  })}
                  >
                      {medianLetters.toFixed(1)}
                  </span>
                  <CircleScale
                    breakPoints={[32, 31, 29, 28, 27, 25, 24]}
                    startFrom={-22}
                    value={medianLetters}
                    shouldShowLabels={false}
                    isInvert
                  />
              </strong>
              {' '}
              <span>
                  {t('statistics.letters')}
              </span>
              {' '}
              <span>{t('statistics.medianWordsBefore')}</span>
              {' '}
              <strong className="year-summary-value">{medianWords.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.medianWords')}</span>
              <GoToDictionaryButton word={word} className="year-summary-dictionary" />
          </p>
      </div>
  );
};

export default YearSummaryWordsTableItem;
