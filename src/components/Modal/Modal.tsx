import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { getCssVarMillisecondsValue } from '@utils/css';

import useVibrate from '@hooks/useVibrate';

import IconClose from '@components/Icons/IconClose';

import './Modal.scss';

interface Props {
    classNameWraper?: string,
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
}

const Modal = ({ classNameWraper = '', children, isOpen, onClose }: Props) => {
    const setTimeoutShowModalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const { vibrate } = useVibrate();

    const handleClosing = () => {
        if (isClosing) {
            return;
        }

        if (setTimeoutShowModalRef.current) {
            clearTimeout(setTimeoutShowModalRef.current);
        }

        setIsClosing(true);

        const cssTimeoutMs = getCssVarMillisecondsValue('--modal-duration-close') || 100;

        setTimeoutShowModalRef.current = setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, cssTimeoutMs);
    }

    const handleClickClose = () => {
        vibrate();

        handleClosing();
    }

    useEffect(() => () => {
        if (setTimeoutShowModalRef.current) {
            clearTimeout(setTimeoutShowModalRef.current);
        }

        setIsClosing(false);
    }, []);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={clsx('modal-wrapper', {
            [classNameWraper]: classNameWraper,
            'modal-wrapper--is-closing': isClosing
        })}>
            <button className="modal-overlay" onClick={handleClickClose} />
            <div className="modal">
                <button className="modal-close" onClick={handleClickClose}>
                    <IconClose />
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('root-modal') as HTMLElement,
    )
};

export default Modal;
