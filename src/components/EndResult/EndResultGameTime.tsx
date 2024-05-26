import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { convertMillisecondsToTime } from '@utils/date';

import { useSelector } from '@store';

import IconTimmer from '@components/Icons/IconTimmer';

const EndResultGameTime = () => {
  const shouldShowDuration = useSelector(state => state.app.shouldShowDuration);
  const durationMS = useSelector(state => state.game.durationMS);

  const { t } = useTranslation();

  if (!shouldShowDuration || durationMS < 1) {
    return null;
  }

  const duration = convertMillisecondsToTime(durationMS);

  return (
      <p className={clsx('end-result-game-duration', 'has-tooltip', 'tooltip-relative')}>
          <IconTimmer />
          {duration.hours > 0 && (
          <>
              <strong>{duration.hours}</strong>
              {' '}
              h
          </>
          )}
          {' '}
          {duration.minutes > 0 && (
          <>
              <strong>{duration.minutes}</strong>
              {' '}
              m
          </>
          )}
          {' '}
          <strong>
              {duration.seconds}
              <small>
                  .
                  {`${duration.milliseconds}`.padStart(3, '0')}
              </small>
          </strong>
          {' '}
          s
          <span className="tooltip">
              {t('end.gameDuration')}
          </span>
      </p>
  );
};

export default EndResultGameTime;
