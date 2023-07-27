import clsx from 'clsx';

import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import IconBackspace from '@components/Icons/IconBackspace';

import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';

import { KEY_LINES, ALLOWED_KEYS } from '@const';

import KeyCap from './KeyCap';

import './VirualKeyboard.scss';

const Keyboard = () => {
    const dispatch = useDispatch();

    const handleSubmit = useCallback(() => {
        dispatch(submitAnswer());
    }, [dispatch])

    const handleType = useCallback((keyTyped) => {
        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch])

    return (
        <aside className="keyboard">
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

export default Keyboard;
