import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { GameMode, GameStatus } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { reloadGame } from '@store/gameSlice';

import './NextDailyTip.scss';

const nearEndMinutes = 15;

// That 1 + at the end moves the edge to the next day
const getCurrentMinutesTo = () => 24 * 60 - (getNow().nowUTC.getHours() * 60 + getNow().nowUTC.getMinutes());

type Props = {
  shouldWarnIfNearEnd?: boolean,
};

const NextDailyTip = ({
  shouldWarnIfNearEnd = true,
}: Props) => {
  const dispatch = useDispatch();
  const setIntervalClockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [minutesToNext, setMinutesToNext] = useState(getCurrentMinutesTo());
  const today = useSelector(state => state.game.today);
  const endStatus = useSelector(state => state.game.status);
  const gameMode = useSelector(state => state.game.mode);

  const { t } = useTranslation();

  useEffect(() => {
    setIntervalClockRef.current = setInterval(() => {
      const minutesToNextValue = getCurrentMinutesTo();

      setMinutesToNext(minutesToNextValue);
    }, 1000);

    return () => {
      if (setIntervalClockRef.current) {
        clearInterval(setIntervalClockRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const shouldReload = today !== getNow().stamp;
    if (shouldReload) {
      dispatch(reloadGame());
    }
  }, [dispatch, minutesToNext, today]);

  const hoursToNext = 24 - getNow().nowUTC.getHours() - 1;

  const shouldRender = gameMode === GameMode.Daily
    && (endStatus === GameStatus.Won || hoursToNext < 2);

  if (!shouldRender) {
    return null;
  }

  if (hoursToNext < 1) {
    if (minutesToNext < 0 || minutesToNext > 99) {
      return null;
    }

    return (
        <p
          className={clsx('next-daily-tip', {
            'next-daily-tip--is-near-end': shouldWarnIfNearEnd && minutesToNext <= nearEndMinutes && endStatus !== GameStatus.Won,
          })}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t('end.nextDailyMinutes', {
              postProcess: 'interval',
              count: minutesToNext,
            }),
          }}
        />
    );
  }

  return (
      <p
        className="next-daily-tip"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: t('end.nextDailyHours', {
            postProcess: 'interval',
            count: hoursToNext + 1, // Works as Math.ceil
          }),
        }}
      />
  );
};

export default NextDailyTip;
