import { useCallback } from 'react';
import { useSelector } from '@store';

function useVibrate() {
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);
    const shouldKeyboardVibrate = useSelector(state => state.app.shouldKeyboardVibrate);

    const vibrate = useCallback(({ isInverted = false, duration = 40 } = {}) => {
        if (shouldVibrate && !isInverted) {
            navigator?.vibrate(duration);
        }

        if (!shouldVibrate && isInverted) {
            navigator?.vibrate(duration);
        }
    }, [shouldVibrate]);

    const vibrateKeyboard = useCallback(({ duration = 25 } = {}) => {
        if (shouldKeyboardVibrate) {
            navigator?.vibrate(duration);
        }
    }, [shouldKeyboardVibrate]);

    const vibrateKeyboardIncorrect = useCallback(({ duration = 50 } = {}) => {
        if (shouldKeyboardVibrate) {
            navigator?.vibrate(duration);
        }
    }, [shouldKeyboardVibrate]);

    return {
        vibrate,
        vibrateKeyboard,
        vibrateKeyboardIncorrect,
    }
}

export default useVibrate;
