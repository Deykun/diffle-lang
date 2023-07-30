import { useEffect, useRef } from 'react';

import { useSelector, useDispatch } from '@store';
import { clearToast } from '@store/gameSlice';

import './Toast.scss';

const Toasts = () => {
  const setTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dispatch = useDispatch();
  const { text, timeoutSeconds = 4 } = useSelector(state => state.game.toast);

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
        {text}
    </p>
  )
};

export default Toasts;
