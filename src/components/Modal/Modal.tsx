import ReactDOM from 'react-dom';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { getCssVarMillisecondsValue } from '@utils/css';

import IconClose from '@components/Icons/IconClose';

import './Modal.scss';

interface Props {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
}

const Modal = ({ children, isOpen, onClose }: Props) => {
    const setTimeoutShowModalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [isClosing, setIsClosing] = useState(false);

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
        <div className={clsx('modal-wrapper', { 'modal-wrapper--is-closing': isClosing })}>
            <button className="modal-overlay" onClick={handleClosing} />
            <div className="modal">
                <button className="modal-close" onClick={handleClosing}>
                    <IconClose />
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('root-modal') as HTMLElement,
    )
};

export default Modal;
