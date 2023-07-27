import { useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { letterChangeInAnswer, submitAnswer } from '@store/gameSlice';

import useEventListener from '@hooks/useEventListener';


import { ALLOWED_KEYS } from '@const';

const UserKeyboardListner = () => {
    const dispatch = useDispatch();

    const handleTyped = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
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

    // useEffect(() => {
    //     handlerRef.current = handleTyped;
    // }, [handleTyped]);

    // useEffect(() => {
    //     const eventListener = event => handlerRef.current(event);

    //     document.addEventListener('keydown', eventListener);

    //     () => {
    //         document.removeEventListener('keydown', eventListener);
    //     }
    // }, [])

    return null;
};

export default UserKeyboardListner;
