import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const [shouldConfirm, setShouldConfirm] = useState(false);

    const { t } = useTranslation();

    const toggleConfirmModal = useCallback(() => {
        if (shouldVibrate) {
            navigator?.vibrate(50);
        }

        setShouldConfirm((prevValue) => !prevValue);
    }, [shouldVibrate]);

    const handleSubmit = useCallback(() => {
        if (shouldVibrate) {
            navigator?.vibrate(50);
        }

        dispatch(submitAnswer());
        setShouldConfirm(false);
    }, [dispatch, shouldVibrate]);

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
            {shouldConfirm && (<div className="keyboard-confirm">
                <h3>{t('game.confirmCheckTheWord')}</h3>
                <div className="line">
                    <KeyCap text="no" onClick={toggleConfirmModal} />
                    <KeyCap text="yes" onClick={handleSubmit} />
                </div>
            </div>)}
            {KEY_LINES.map((line) => {
                return (
                    <div key={line[0]} className="line">
                        {line.map((keyText) => (
                            <KeyCap key={keyText} text={keyText} onClick={keyText === 'enter' ? toggleConfirmModal : () => handleType(keyText)} />)
                        )}
                    </div>
                );
            })}
        </aside>
    )
};

export default VirualKeyboard;
