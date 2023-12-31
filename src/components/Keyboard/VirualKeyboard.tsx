import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { KEY_LINES, ALLOWED_KEYS } from '@const';

import { useDispatch, useSelector } from '@store';
import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';
import { selectIsWon, selectKeyboardState } from '@store/selectors';

import useVibrate from '@hooks/useVibrate';

import KeyCap from './KeyCap';
import VirualKeyboardConfirm from './VirualKeyboardConfirm';

import './VirualKeyboard.scss';

const VirualKeyboard = () => {
    const dispatch = useDispatch();
    const shouldConfirmEnter = useSelector(state => state.app.shouldConfirmEnter);
    const isEnterSwapped = useSelector(state => state.app.isEnterSwapped);
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);
    const isWon = useSelector(selectIsWon);
    const type = useSelector(selectKeyboardState);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { vibrateKeyboard } = useVibrate();

    const closeConfirm = () => setIsConfirmOpen(false);

    const handleSubmit = useCallback(() => {
        vibrateKeyboard();

        dispatch(submitAnswer());
        setIsConfirmOpen(false);
    }, [dispatch, vibrateKeyboard]);

    const toggleConfirmModal = useCallback(() => {        
        vibrateKeyboard();

        setIsConfirmOpen((prevValue) => !prevValue);
    }, [vibrateKeyboard]);

    const handleType = useCallback((keyTyped: string) => {
        const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

        if (isAllowedKey) {
            vibrateKeyboard();

            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [dispatch, vibrateKeyboard]);

    const enterCallback = shouldConfirmEnter ? toggleConfirmModal : handleSubmit;

    const shouldShowConfirm = isConfirmOpen && !isWon;

    const keyLines = !isEnterSwapped ? KEY_LINES : KEY_LINES.map((line) => line.map((keyText) => {
        if (keyText === 'enter') {
            return 'backspace';
        }

        if (keyText === 'backspace') {
            return 'enter';
        }

        return keyText;
    }))

    return (
        <aside className={clsx('keyboard', type, { 'isSmall': isSmallKeyboard })}>
            {shouldShowConfirm && <VirualKeyboardConfirm closeConfirm={closeConfirm} />}
            {keyLines.map((line) => {
                return (
                    <div key={line[0]} className="line">
                        {line.map((keyText) => {
                            let onClick = () => handleType(keyText);

                            if (keyText === 'enter') {
                                onClick = enterCallback;
                            }

                            return (<KeyCap key={keyText} text={keyText} onClick={onClick} />);
                        })}
                    </div>
                );
            })}
        </aside>
    )
};

export default VirualKeyboard;
