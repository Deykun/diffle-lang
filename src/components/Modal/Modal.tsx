import ReactDOM from 'react-dom';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from '@store';
import { clearToast } from '@store/appSlice';

import './Modal.scss';

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-wrapper">
            <button className="modal-overlay" onClick={onClose} />
            <div className="modal">
                <button onClick={onClose}>
                    x
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('root-modal'),
    )
};

export default Modal;
