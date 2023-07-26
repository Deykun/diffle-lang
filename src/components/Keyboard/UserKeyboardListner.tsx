import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { letterChangeInAnswer, submitAnswer } from '../../store/gameSlice';

import { ALLOWED_KEYS } from '../../constants';

const UserKeyboardListner = () => {
    const dispatch = useDispatch();

    const handleTyped = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        const keyTyped = (event?.key || '').toLowerCase();

        if (keyTyped === 'enter') {
            // TODO is asunc
            dispatch(submitAnswer());

            return;
        }

        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch]);

    useEffect(() => {
        document.addEventListener('keydown', handleTyped);

        () => {
            document.removeEventListener('keydown', handleTyped);
        }
    }, [handleTyped])

    return null;
};

export default UserKeyboardListner;
