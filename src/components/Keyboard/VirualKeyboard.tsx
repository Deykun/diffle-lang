import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';

import { SUPORTED_DICTIONARY_BY_LANG } from '@const';

import { useDispatch, useSelector } from '@store';
import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';
import { selectGameLanguage, selectIsGameEnded, selectKeyboardState } from '@store/selectors';

import useVibrate from '@hooks/useVibrate';

import KeyCap from './KeyCap';
import VirualKeyboardConfirm from './VirualKeyboardConfirm';

import './VirualKeyboard.scss';

const VirualKeyboard = () => {
    const dispatch = useDispatch();
    const gameLanguage = useSelector(selectGameLanguage);
    const shouldConfirmEnter = useSelector(state => state.app.shouldConfirmEnter);
    const isEnterSwapped = useSelector(state => state.app.isEnterSwapped);
    const isSmallKeyboard = useSelector(state => state.app.isSmallKeyboard);
    const isGameEnded = useSelector(selectIsGameEnded);
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

    const {
        keyLines,
        allowedKeys
    } = useMemo(() => {
        if (!gameLanguage || !SUPORTED_DICTIONARY_BY_LANG[gameLanguage]) {
            return { keyLines: [], allowedKeys: [] };
        }
        const dictionary = SUPORTED_DICTIONARY_BY_LANG[gameLanguage];
        
        return {
            allowedKeys: dictionary.alloweyKeys,
            keyLines: !isEnterSwapped ? dictionary.keyLines : dictionary.keyLines.map((line) => line.map((keyText) => {
                if (keyText === 'enter') {
                    return 'backspace';
                }
        
                if (keyText === 'backspace') {
                    return 'enter';
                }
        
                return keyText;
            }))
        };
    }, [gameLanguage, isEnterSwapped]);

    const handleType = useCallback((keyTyped: string) => {
        const isAllowedKey = allowedKeys.includes(keyTyped);

        if (isAllowedKey) {
            vibrateKeyboard();

            dispatch(letterChangeInAnswer(keyTyped));
        }
    }, [allowedKeys, dispatch, vibrateKeyboard]);

    const enterCallback = shouldConfirmEnter ? toggleConfirmModal : handleSubmit;

    const shouldShowConfirm = isConfirmOpen && !isGameEnded;

    if (keyLines.length === 0) {
        return null;
    }

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
