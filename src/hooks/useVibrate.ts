import { useCallback } from 'react';
import { useSelector } from '@store';

function useVibrate() {
  const shouldVibrate = useSelector(state => state.app.shouldVibrate);
  const shouldKeyboardVibrate = useSelector(state => state.app.shouldKeyboardVibrate);

  const vibrate = useCallback(({ isInverted = false, duration = 40 } = {}) => {
    try {
      if (!navigator.vibrate) {
        return;
      }

      if (shouldVibrate && !isInverted) {
        navigator.vibrate(duration);
      }

      if (!shouldVibrate && isInverted) {
        navigator.vibrate(duration);
      }
    } catch {
      // Unsupported
    }
  }, [shouldVibrate]);

  const vibrateKeyboard = useCallback(({ duration = 25 } = {}) => {
    try {
      if (!navigator.vibrate) {
        return;
      }

      if (shouldKeyboardVibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // Unsupported
    }
  }, [shouldKeyboardVibrate]);

  const vibrateKeyboardIncorrect = useCallback(({ duration = 50 } = {}) => {
    try {
      if (!navigator.vibrate) {
        return;
      }
      if (shouldKeyboardVibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // Unsupported
    }
  }, [shouldKeyboardVibrate]);

  return {
    vibrate,
    vibrateKeyboard,
    vibrateKeyboardIncorrect,
  };
}

export default useVibrate;
