import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from '@store';
import { submitAnswer } from '@store/gameSlice';
import { selectWordToSubmit } from '@store/selectors';

import useVibrate from '@hooks/useVibrate';
import useKeyboardSettings from '@hooks/useKeyboardSettings';

import IconCheckConfirm from '@components/Icons/IconCheckConfirm';
import IconVibrateKeyboard from '@components/Icons/IconVibrateKeyboard';

import KeyCap from './KeyCap';

import './VirualKeyboardConfirm.scss';

interface Props {
    closeConfirm: () => void;
}

const VirualKeyboardConfirm = ({ closeConfirm }: Props) => {
    const dispatch = useDispatch();
    const wordToSubmit = useSelector(selectWordToSubmit);

    const { t } = useTranslation();

    const {
        shouldKeyboardVibrate,
        handleTogglKeyboardVibrate,
        shouldConfirmEnter,
        handleToggleConfirmEnter,
     } = useKeyboardSettings();

    const { vibrateKeyboard } = useVibrate();

    const handleSubmit = useCallback(() => {
        vibrateKeyboard();

        dispatch(submitAnswer());
        closeConfirm();
    }, [closeConfirm, dispatch, vibrateKeyboard]);

    return (
        <div className="keyboard-confirm">
            {wordToSubmit && <h3>{t('game.confirmCheckTheWord', { word: wordToSubmit })}</h3>}
            {!wordToSubmit && <h3>{t('game.wordToSubmitIsMissing')}</h3>}
            <div className="line">
                <KeyCap text="no" onClick={closeConfirm} />
                <KeyCap text="yes" onClick={handleSubmit} />
            </div>
            <div className="keyboard-settings">
                <button
                    className={clsx('keyboard-setting', { 'keyboard-setting-active': shouldKeyboardVibrate })}
                    onClick={handleTogglKeyboardVibrate}
                >
                    <IconVibrateKeyboard />
                    <span>{t('settings.keyboardVibration')}</span>
                </button>
                <button
                    className={clsx('keyboard-setting', { 'keyboard-setting-active': shouldConfirmEnter })}
                    onClick={handleToggleConfirmEnter}
                >
                    <IconCheckConfirm />
                    <span>{t('settings.confirmSubmition')}</span>
                </button>
            </div>
        </div>
    );
};

export default VirualKeyboardConfirm;
