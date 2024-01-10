import ReactDOM from 'react-dom';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

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

        setTimeoutShowModalRef.current = setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 100);
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
