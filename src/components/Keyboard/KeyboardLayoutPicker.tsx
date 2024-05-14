import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { useDispatch, useSelector } from '@store';
import { track, changeKeyboardLayoutIndex } from '@store/appSlice';

import { removeDiacratics } from '@api/helpers';

import {
  getLocalStorageKeyForGameKeyboardLayout,
} from '@utils/game';

import IconKeyboard from '@components/Icons/IconKeyboard';
import IconKeyboardAlt from '@components/Icons/IconKeyboardAlt';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

type Props = {
  isTile?: boolean,
  shouldHideIfDisabled?: boolean,
}

const KeyboardLayoutPicker = ({ isTile = false, shouldHideIfDisabled = false }: Props) => {
  const dispatch = useDispatch();

  const keyboardLayoutIndex = useSelector(state => state.app.keyboardLayoutIndex);
  const gameLanguage = useSelector(state => state.game.language);
  const isGameUpdating = useSelector(state => state.game.isProcessing || state.game.isLoadingGame);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const layoutVariants = useMemo(() => {
    if (gameLanguage) {
      return SUPPORTED_DICTIONARY_BY_LANG[gameLanguage].keyLinesVariants;
    }

    return [];
  }, [gameLanguage]);

  const handleLayoutChange = (index: number) => {
    if (!gameLanguage) {
      return;
    }

    const localStorageKey = getLocalStorageKeyForGameKeyboardLayout({ gameLanguage });
    localStorage.setItem(localStorageKey, String(index));

    dispatch(changeKeyboardLayoutIndex(index));

    const normalizedName = removeDiacratics(
      SUPPORTED_DICTIONARY_BY_LANG[gameLanguage].keyLinesVariants[index].name.toLowerCase().replaceAll(' ', '_'),
    );

    dispatch(track({ name: `click_keyboard_layout_${gameLanguage}_${normalizedName}` }));

    setIsOpen(false);
  };

  const isDisabled = !gameLanguage || isGameUpdating || layoutVariants.length < 2;

  if (shouldHideIfDisabled && isDisabled) {
    return null;
  }

  return (
      <>
          {isTile ? (
              <ButtonTile
                onClick={() => setIsOpen(value => !value)}
                isDisabled={isDisabled}
              >
                  <IconKeyboard />
                  <span>
                      {layoutVariants[keyboardLayoutIndex]
                        ? layoutVariants[keyboardLayoutIndex].name
                        : ''}
                  </span>
              </ButtonTile>
          ) : (
              <Button
                onClick={() => setIsOpen(value => !value)}
                isDisabled={isDisabled}
                isInverted
                isText
                hasBorder={false}
              >
                  <IconKeyboard />
              </Button>
          )}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('settings.keyboard')}</h3>
                  <ul className={layoutVariants.length % 3 === 0 ? 'list-col-3' : ''}>
                      {layoutVariants.map(({ name }, index) => (
                          <li key={name}>
                              <ButtonTile
                                isActive={index === keyboardLayoutIndex}
                                onClick={() => handleLayoutChange(index)}
                                isDisabled={isGameUpdating}
                              >
                                  {index % 2 === 0 ? <IconKeyboardAlt /> : <IconKeyboard />}
                                  <span>
                                      {name}
                                  </span>
                              </ButtonTile>
                          </li>
                      ))}
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default KeyboardLayoutPicker;
