import * as classNames from 'classnames';

import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';


import IconBackspace from '../Icons/IconBackspace';

import { submitAnswer, letterChangeInAnswer } from '../../store/gameSlice';

import UserKeyboardListner from './UserKeyboardListner';

import { KEY_LINES, ALLOWED_KEYS } from '../../constants';

import './VirualKeyboard.scss';

const USED = ['a', 'd', 'e', 'k', 'o', 'z', 'h', 'c'];

const CORRECT = ['a', 'd', 'e', 'k', 'o', 'z'];

const WRONG_ORDER = ['e', 'z'];

const Keyboard = () => {
    const dispatch = useDispatch();

    const handleClick = useCallback((keyTyped) => {
        if (keyTyped === 'enter') {
            // TODO is asunc
            dispatch(submitAnswer());

            return;
        }

        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch])

    return (
        <>
            <aside className="keyboard">
                {KEY_LINES.map((line, index) => {
                    return (
                        <div className="line">
                            {line.map((key) => {
                                return (<button
                                    key={`letter-${key}-${index}`}
                                    onClick={() => handleClick(key)}
                                    className={classNames('key', {
                                        'key-used': USED.includes(key),
                                        'key-correct': CORRECT.includes(key),
                                        'key-wrong-order': WRONG_ORDER.includes(key),
                                    })}>
                                        {key === 'backspace' ? <IconBackspace /> : key}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </aside>
        </>
    )
};

export default Keyboard;
