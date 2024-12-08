import { useTranslation } from 'react-i18next';

import { YearSummaryInfo } from '@common-types';

import IconFirework from '@components/Icons/IconFirework';

import useEventT from './hooks/useEventT';

import './YearSummaryHeader.scss';

type Props = {
  summary: YearSummaryInfo;
};

const YearSummaryHeader = ({ summary }: Props) => {
  const {
    gamesPlayed, medianWords, medianLetters,
  } = summary.all;
  const {
    activePlayers,
  } = summary;

  const { t } = useTranslation();
  const { eventT } = useEventT();

  return (
      <section className="year-summary-header">
          <IconFirework className="year-summary-header-icon" />
          <h1 className="year-summary-special-text">Hejto 2024</h1>
          <p className="year-sumamry-header-main">
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
                  <strong>
                      {activePlayers}
                  </strong>
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
