import clsx from 'clsx';
import { useCallback } from 'react';

import { KEY_LINES, ALLOWED_KEYS } from '@const';

import { useDispatch, useSelector } from '@store';
import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';
import { selectKeyboardState } from '@store/selectors';

import KeyCap from './KeyCap';

import './VirualKeyboard.scss';

const VirualKeyboard = () => {
    const dispatch = useDispatch();
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);
    const type = useSelector(selectKeyboardState);

    const handleSubmit = useCallback(() => {
        dispatch(submitAnswer());
    }, [dispatch]);

    const handleType = useCallback((keyTyped: string) => {
        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            if (shouldVibrate) {
                navigator?.vibrate(50);
            }

            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch, shouldVibrate]);

    return (
        <aside className={clsx('keyboard', type)}>
            {KEY_LINES.map((line) => {
                return (
                    <div key={line[0]} className="line">
                        {line.map((keyText) => (
                            <KeyCap key={keyText} text={keyText} onClick={keyText === 'enter' ? handleSubmit : () => handleType(keyText)} />)
                        )}
                    </div>
                );
            })}
        </aside>
    )
};

export default VirualKeyboard;
