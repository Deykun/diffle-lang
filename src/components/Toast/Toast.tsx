import clsx from 'clsx';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from '@store';
import { clearToast } from '@store/appSlice';

import './Toast.scss';

const Toasts = () => {
  const setTimeoutShowToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setTimeoutShakeToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useDispatch();
  const [{ shouldShake, didShake }, setShake] = useState({ shouldShake: false, didShake: false });
  const {
    type, text, timeoutSeconds = 4, toastTime, params = {},
  } = useSelector(state => state.app.toast);

  const { t } = useTranslation();

  const resetToast = useCallback(() => {
    if (setTimeoutShowToastRef.current) {
      clearTimeout(setTimeoutShowToastRef.current);
    }

    setTimeoutShowToastRef.current = setTimeout(() => {
      dispatch(clearToast());
    }, timeoutSeconds * 1000);
  }, [dispatch, timeoutSeconds]);

  useEffect(() => {
    if (toastTime) {
      if (setTimeoutShakeToastRef.current) {
        clearTimeout(setTimeoutShakeToastRef.current);
      }

      setShake({ shouldShake: true, didShake: false });

      resetToast();

      setTimeoutShakeToastRef.current = setTimeout(() => {
        setShake({ shouldShake: false, didShake: true });
      }, 0.5 * 1000);
    }

    return () => {
      if (setTimeoutShakeToastRef.current) {
        clearTimeout(setTimeoutShakeToastRef.current);
      }
    };
  }, [resetToast, toastTime]);

  useEffect(() => {
    setShake({ shouldShake: false, didShake: false });

    if (text) {
      resetToast();
    }

    return () => {
      if (setTimeoutShowToastRef.current) {
        clearTimeout(setTimeoutShowToastRef.current);
      }
    };
  }, [dispatch, resetToast, text]);

  if (!text) {
    return null;
  }

  return (
      <p
        className={clsx('toast', `toast-${type}`, { 'toast-shake': shouldShake, 'toast-shaked': didShake })}
        key={text}
        data-testid={`toast-${text.replaceAll('.', '-')}`}
      >
          {t(text, params)}
      </p>
  );
};

export default Toasts;
