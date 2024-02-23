import React, {
  useCallback, useState, useRef, useEffect,
} from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import useVibrate from '@hooks/useVibrate';

import './ButtonSetting.scss';

interface Props {
  className?: string,
  children: React.ReactNode,
  onClick: () => void,
  isDisabled?: boolean,
  secondsToConfirm?: number,
}

function ButtonSettingWithConfirm({
  className = '',
  children,
  onClick,
  isDisabled = false,
  secondsToConfirm = 5,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(secondsToConfirm);
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const setIntervalUnlockActionRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { t } = useTranslation();
  const { vibrate } = useVibrate();

  const handleClick = useCallback(() => {
    vibrate();

    if (setIntervalUnlockActionRef.current) {
      clearInterval(setIntervalUnlockActionRef.current);
    }

    const hasStartedButNotYetAllowed = shouldStartTimer && secondsLeft > 0;
    if (hasStartedButNotYetAllowed) {
      setShouldStartTimer(false);

      return;
    }

    const hasStartedButAndAllowed = shouldStartTimer && secondsLeft < 1;
    if (hasStartedButAndAllowed) {
      onClick();
      setShouldStartTimer(false);

      return;
    }

    setShouldStartTimer(true);
  }, [onClick, secondsLeft, shouldStartTimer, vibrate]);

  useEffect(() => {
    if (setIntervalUnlockActionRef.current) {
      clearInterval(setIntervalUnlockActionRef.current);
    }

    if (shouldStartTimer) {
      setIntervalUnlockActionRef.current = setInterval(() => {
        setSecondsLeft((previousSeconds) => previousSeconds - 1);
      }, 1000);
    } else {
      setSecondsLeft(secondsToConfirm);
    }
  }, [secondsToConfirm, shouldStartTimer]);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (setIntervalUnlockActionRef.current) {
        clearInterval(setIntervalUnlockActionRef.current);
      }
    }
  }, [secondsLeft]);

  const isCountingToAllowConfirm = shouldStartTimer && secondsLeft > 0;
  const isConfirmAllowed = shouldStartTimer && !isCountingToAllowConfirm;

  return (
      <button
        className={clsx('setting', {
          [className]: className,
          'setting-confirm-timer': isCountingToAllowConfirm,
          'setting-confirm-allowed': isConfirmAllowed,
        })}
        onClick={handleClick}
        disabled={isDisabled}
        type="button"
      >
          {children}
          {isCountingToAllowConfirm && (
          <p className="setting-confirm">
              {t('settings.confirmInSeconds', {
                postProcess: 'interval',
                count: secondsLeft,
              })}
          </p>
          )}
          {isConfirmAllowed && <p className="setting-confirm">{t('settings.confirmAfterWaiting')}</p>}
      </button>
  );
}

export default ButtonSettingWithConfirm;
