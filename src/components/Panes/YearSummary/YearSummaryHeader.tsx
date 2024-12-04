import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import IconFirework from '@components/Icons/IconFirework';

import './YearSummaryHeader.scss';

type Props = {
  summary: YearSummaryInfo;
};

const YearSummaryHeader = ({ summary }: Props) => {
  const {
    gamesPlayed, activePlayers, medianWords, medianLetters,
  } = summary;

  const { t } = useTranslation();

  return (
      <section className="year-summary-header">
          <IconFirework className="year-summary-header-icon" />
          <h1>Hejto 2024</h1>
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('statistics.totalGames', {
                postProcess: 'interval',
                count: gamesPlayed,
              }),
            }}
          />
          {activePlayers}
          <p>
              <strong>{medianLetters.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.letters')}</span>
          </p>
          <p>
              <span>{t('statistics.medianWordsBefore')}</span>
              {' '}
              <strong>{medianWords.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.medianWords')}</span>
          </p>
          {/* <pre>{JSON.stringify(summary, null, 4)}</pre> */}
          {/* <SummaryAll all={all} byLang={byLang} /> */}
      </section>
  );
};

export default YearSummaryHeader;