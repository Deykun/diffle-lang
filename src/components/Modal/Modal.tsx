import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getCssVarMillisecondsValue } from '@utils/css';

import useEffectChange from '@hooks/useEffectChange';
import useVibrate from '@hooks/useVibrate';

import IconClose from '@components/Icons/IconClose';

import './Modal.scss';

type Props = {
  classNameWraper?: string,
  children: React.ReactNode,
  isOpen: boolean,
  onClose: () => void,
}

const Modal = ({
  classNameWraper = '', children, isOpen: isOpenProp, onClose,
}: Props) => {
  const setTimeoutShowModalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(isOpenProp);
  const [isClosing, setIsClosing] = useState(false);

  const { vibrate } = useVibrate();
  const { t } = useTranslation();

  const close = () => {
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
      setIsOpen(false);
      setIsClosing(false);
    }, cssTimeoutMs);
  };

  const handleClickClose = () => {
    vibrate();

    close();
  };

  useEffect(() => () => {
    if (setTimeoutShowModalRef.current) {
      clearTimeout(setTimeoutShowModalRef.current);
    }

    setIsClosing(false);
  }, []);

  // When was open somewher is closed by change od isOpen={true -> false}
  useEffectChange(() => {
    if (isOpenProp) {
      setIsOpen(true);
    } else {
      close();
    }
  }, [isOpenProp]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
      <div className={clsx('modal-wrapper', {
        [classNameWraper]: classNameWraper,
        'modal-wrapper--is-closing': isClosing,
      })}
      >
          <button
            className="modal-overlay"
            onClick={handleClickClose}
            type="button"
          >
              {t('common.close')}
          </button>
          <div className="modal">
              <button className="modal-close" onClick={handleClickClose} type="button">
                  <IconClose />
              </button>
              {children}
          </div>
      </div>,
      document.getElementById('root-modal') as HTMLElement,
  );
};

export default Modal;
