import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import IconFirework from '@components/Icons/IconFirework';
import IconParty from '@components/Icons/IconParty';

import useEventT from './hooks/useEventT';

import './YearSummaryHeader.scss';

type Props = {
  year: number;
  summary: YearSummaryInfo;
};

const YearSummaryHeader = ({ year, summary }: Props) => {
  const { gamesPlayed, medianWords, medianLetters } = summary.all;
  const { activePlayers } = summary;

  const { t } = useTranslation();
  const { eventT } = useEventT();

  return (
      <section className="year-summary-header">
          {year === 2024 && <IconFirework className="year-summary-header-icon" />}
          {year === 2025 && <IconParty className="year-summary-header-icon" />}
          <h1 className="year-summary-special-text">
              Hejto
              {' '}
              {year}
          </h1>
          <p className="year-summary-header-main">
              <span
          // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t('statistics.totalGames', {
                    postProcess: 'interval',
                    count: gamesPlayed,
                  }),
                }}
              />
              <span>
                  <strong>{activePlayers}</strong>
                  {' '}
                  {eventT('main.players')}
              </span>
          </p>
          <p>
              <strong>{medianLetters.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.letters')}</span>
              {' '}
              <span>{t('statistics.medianWordsBefore')}</span>
              {' '}
              <strong>{medianWords.toFixed(1)}</strong>
              {' '}
              <span>{t('statistics.medianWords')}</span>
          </p>
      </section>
  );
};

export default YearSummaryHeader;
