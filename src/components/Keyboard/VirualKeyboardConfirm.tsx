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

import Button from '@components/Button/Button';
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
            {wordToSubmit && <h3>{t('game.confirmCheckTheWord', { word: wordToSubmit })}</h3>}
            {!wordToSubmit && <h3>{t('game.wordToSubmitIsMissing')}</h3>}
            <div className="keyboard-confirm-actions">
                <Button className="setting" onClick={closeConfirm} isInverted isText hasBorder={false}>
                    <IconUndo />
                    <span>{t('common.no')}</span>
                </Button>
                <Button className="setting setting-active" onClick={handleSubmit}>
                    <IconSubmit />
                    <span>{t('common.yes')}</span>
                </Button>
            </div>
            <Button
                className={clsx('keyboard-setting', { 'keyboard-setting-active': shouldConfirmEnter })}
                onClick={handleToggleConfirmEnter}
                isInverted
                isText={!shouldConfirmEnter}
                hasBorder={false}
            >
                <IconCheckConfirm />
                <span>{t('settings.confirmSubmition')}</span>
            </Button>
      </Modal>
    );
};

export default VirualKeyboardConfirm;
