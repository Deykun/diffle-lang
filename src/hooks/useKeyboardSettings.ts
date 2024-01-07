import { useCallback } from 'react';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';
import { toggleVibration, toggleKeyboardVibration, toggleKeyboardSize, toggleEnterSwap, toggleConfirmEnter } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';

function useKeyboardSettings() {
    const dispatch = useDispatch();
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);
    const shouldKeyboardVibrate = useSelector(state => state.app.shouldKeyboardVibrate);
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);
    const isEnterSwapped = useSelector(state => state.app.isEnterSwapped);
    const shouldConfirmEnter = useSelector(state => state.app.shouldConfirmEnter);

    const { vibrate } = useVibrate();

    const handleToggleVibrate = useCallback(() => {
        vibrate({ isInverted: true });

        // Inverted because toggled
        localStorage.setItem(LOCAL_STORAGE.SHOULD_VIBRATE, shouldVibrate ? 'false' : 'true');

        dispatch(toggleVibration());
    }, [dispatch, shouldVibrate, vibrate]);

    const handleTogglKeyboardVibrate = useCallback(() => {
        if (!shouldVibrate && !shouldKeyboardVibrate) {
            vibrate({ isInverted: true });
            localStorage.setItem(LOCAL_STORAGE.SHOULD_VIBRATE, 'true');
        } else {
            vibrate();
        }

        localStorage.setItem(LOCAL_STORAGE.SHOULD_VIBRATE_KEYBOARD, shouldKeyboardVibrate ? 'false' : 'true');

        dispatch(toggleKeyboardVibration());
    }, [vibrate, shouldVibrate, shouldKeyboardVibrate, dispatch]);

    const handleToggleKeyboardSize = useCallback(() => {
        vibrate();

        localStorage.setItem(LOCAL_STORAGE.IS_SMALL_KEYBOARD, isSmallKeyboard ? 'false' : 'true');

        dispatch(toggleKeyboardSize());
    }, [dispatch, isSmallKeyboard, vibrate]);

    const handleToggleEnterSwap = useCallback(() => {
        vibrate();

        localStorage.setItem(LOCAL_STORAGE.SHOULD_SWAP_ENTER, isEnterSwapped ? 'false' : 'true');

        dispatch(toggleEnterSwap());
    }, [dispatch, isEnterSwapped, vibrate]);

    const handleToggleConfirmEnter = useCallback(() => {
        vibrate();

        localStorage.setItem(LOCAL_STORAGE.SHOULD_CONFIRM_ENTER, shouldConfirmEnter ? 'false' : 'true');

        dispatch(toggleConfirmEnter());
    }, [dispatch, shouldConfirmEnter, vibrate]);

    return {
        shouldVibrate,
        handleToggleVibrate,
        shouldKeyboardVibrate,
        handleTogglKeyboardVibrate,
        isSmallKeyboard,
        handleToggleKeyboardSize,
        shouldConfirmEnter,
        handleToggleConfirmEnter,
        isEnterSwapped,
        handleToggleEnterSwap,
    }
}

export default useKeyboardSettings;
