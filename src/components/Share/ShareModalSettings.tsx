import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from '@store';
import { clearToast } from '@store/appSlice';

import IconCog from '@components/Icons/IconCog';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';



// import './Toast.scss';

const ShareModalSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => setIsOpen(value => !value);

  return (
    <>
      <Button onClick={onClick}>
          <IconCog />
      </Button>
      <Modal isOpen={isOpen} onClose={onClick}>
        X
      </Modal>
    </>
  )
};

export default ShareModalSettings;
