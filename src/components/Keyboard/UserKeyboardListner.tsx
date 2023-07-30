import { useCallback } from 'react';

import { useDispatch } from '@store';
import { letterChangeInAnswer, submitAnswer } from '@store/gameSlice';

import useEventListener from '@hooks/useEventListener';


import { ALLOWED_KEYS } from '@const';

const UserKeyboardListner = () => {
    const dispatch = useDispatch();

    const handleTyped = useCallback((event: KeyboardEvent) => {
        const keyTyped = (event?.key || '').toLowerCase();

        if (keyTyped === 'enter') {
            // Last focused button is not triggered by that
            event.preventDefault();

            dispatch(submitAnswer());

            return;
        }

        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch]);

    useEventListener('keydown', handleTyped);

    return null;
};

export default UserKeyboardListner;
