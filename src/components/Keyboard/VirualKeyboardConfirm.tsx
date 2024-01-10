import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from '@store';
import { submitAnswer } from '@store/gameSlice';
import { selectWordToSubmit } from '@store/selectors';

import useVibrate from '@hooks/useVibrate';
import useKeyboardSettings from '@hooks/useKeyboardSettings';

import IconCheckConfirm from '@components/Icons/IconCheckConfirm';
import IconSubmit from '@components/Icons/IconSubmit';
import IconUndo from '@components/Icons/IconUndo';

import Modal from '@components/Modal/Modal';

import './VirualKeyboardConfirm.scss';

interface Props {
    closeConfirm: () => void;
}

const VirualKeyboardConfirm = ({ closeConfirm }: Props) => {
    const dispatch = useDispatch();
    const wordToSubmit = useSelector(selectWordToSubmit);

    const { t } = useTranslation();

    const {
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
        <Modal isOpen={true} onClose={() => closeConfirm()}>
            <div className="settings">
                {wordToSubmit && <h3>{t('game.confirmCheckTheWord', { word: wordToSubmit })}</h3>}
                {!wordToSubmit && <h3>{t('game.wordToSubmitIsMissing')}</h3>}
                <ul>
                    <li>
                        <button className="setting" onClick={closeConfirm}>
                            <IconUndo />
                            <span>{t('common.no')}</span>
                        </button>
                    </li>
                    <li>
                        <button className="setting setting-active" onClick={handleSubmit}>
                            <IconSubmit />
                            <span>{t('common.yes')}</span>
                        </button>
                    </li>
                </ul>
                <button
                    className={clsx('keyboard-setting', { 'keyboard-setting-active': shouldConfirmEnter })}
                    onClick={handleToggleConfirmEnter}
                >
                    <IconCheckConfirm />
                    <span>{t('settings.confirmSubmition')}</span>
                </button>
            </div>
      </Modal>
    );
};

export default VirualKeyboardConfirm;
