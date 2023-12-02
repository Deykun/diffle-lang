import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from '@store';
import { clearToast } from '@store/appSlice';

import './Toast.scss';

const Toasts = () => {
  const setTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dispatch = useDispatch();
  const { text, timeoutSeconds = 4 } = useSelector(state => state.app.toast);

  const { t } = useTranslation();

  useEffect(() => {
    if (text) {
      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
      }
  
      setTimeoutRef.current = setTimeout(() => {
        dispatch(clearToast());
      }, timeoutSeconds * 1000);
    }

    () => {
      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
      }
    }
  }, [dispatch, text, timeoutSeconds]);

  if (!text) {
    return null;
  }

  return (
    <p className="toast">
        {t(text)}
    </p>
  )
};

export default Toasts;
