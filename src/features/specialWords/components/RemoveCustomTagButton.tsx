import {
  useCallback, useState,
} from 'react';

import { LOCAL_STORAGE } from '@const';

import IconEraser from '@components/Icons/IconEraser';
import Button from '@components/Button/Button';

const RemoveCustomTagButton = () => {
  const [customTag, setCustomTag] = useState(localStorage.getItem(LOCAL_STORAGE.CUSTOM_TAG) || '');

  const handleRemoveCustomTag = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE.CUSTOM_TAG);

    setCustomTag('');
  }, []);

  if (!customTag) {
    return null;
  }

  return (
      <Button onClick={handleRemoveCustomTag} isInverted isText hasBorder={false}>
          <IconEraser />
          <span>{customTag}</span>
      </Button>
  );
};

export default RemoveCustomTagButton;
