import { useCallback } from 'react';

import { useDispatch, useSelector } from '@store';
import { letterChangeInAnswer, submitAnswer } from '@store/gameSlice';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import useEventListener from '@hooks/useEventListener';

const UserKeyboardListner = () => {
    const dispatch = useDispatch();
    const { allowedKeys } = useSelector(selectGameLanguageKeyboardInfo);

    const handleTyped = useCallback((event: KeyboardEvent) => {
        const keyTyped = (event?.key || '').toLowerCase();

        if ([' ', 'enter'].includes(keyTyped)) {
            // Last focused button is not triggered by that
            event.preventDefault();
        }

        if (keyTyped === 'enter') {
            dispatch(submitAnswer());

            return;
        }

        const isAllowedKey = allowedKeys.includes(keyTyped);

        if (isAllowedKey) {
            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [allowedKeys, dispatch]);

    useEventListener('keydown', handleTyped);

    return null;
};

export default UserKeyboardListner;
