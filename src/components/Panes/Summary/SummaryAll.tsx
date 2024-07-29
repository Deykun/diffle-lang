import clsx from 'clsx';
import {
  StatisticDataForCard,
} from '@utils/statistics';

import Image from '@components/Image/Image';

import './SummaryAll.scss';

type Props = {
  all: StatisticDataForCard,
  byLang: {
    [lang: string]: StatisticDataForCard
  },
};

const SummaryAll = ({ all, byLang }: Props) => {
  return (
      <div className="summary-all">
          <div className="summary-all-numbers">
              {all.totalGames}
              {' '}
              played
              {all.totalWon}
              {' '}
              won
              {all.totalLost}
              {' '}
              lost
              in
              {' '}
              {all.totalTime.hours}
              h
              {all.totalTime.minutes}
              m
              {all.totalTime.seconds}
              s
          </div>
          <div className="summary-all-langs">
              {Object.keys(byLang).map(lang => (
                  <Image
                    className="summary-all-flag"
                    src={`./flags/${lang}.svg`}
                    alt=""
                  />
              ))}
          </div>
      </div>
  );
};

export default SummaryAll;
