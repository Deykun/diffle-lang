import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_DICTIONARY_BY_LANG, LOCAL_STORAGE } from '@const';

import { useDispatch, useSelector } from '@store';
import { track } from '@store/appSlice';

import IconContrast from '@components/Icons/IconContrast';
import IconMoon from '@components/Icons/IconMoon';
import IconSun from '@components/Icons/IconSun';

import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

import Word from '@components/Words/Word';

import { EXAMPLE_WORD } from './constants';

const SettingsAccessibility = () => {
  const dispatch = useDispatch();

  const gameLanguage = useSelector(state => state.game.language);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const layoutVariants = useMemo(() => {
    if (gameLanguage) {
      return SUPPORTED_DICTIONARY_BY_LANG[gameLanguage].keyLinesVariants;
    }

    return [];
  }, [gameLanguage]);

  const handleToggleDarkLightMode = () => {
    const isLightThemeBeforeToggle = document.documentElement.classList.contains('light');

    localStorage.setItem(LOCAL_STORAGE.THEME, isLightThemeBeforeToggle ? 'dark' : 'light');

    dispatch(track({ name: `click_change_to_${isLightThemeBeforeToggle ? 'dark' : 'light'}_mode` }));

    document.documentElement.classList.toggle('light');
  };

  const handleToggleHighContrastMode = () => {
    const isHighContrastBeforeToggle = document.documentElement.classList.contains('contrast');

    localStorage.setItem(LOCAL_STORAGE.THEME_CONTRAST, isHighContrastBeforeToggle ? 'false' : 'true');

    dispatch(track({ name: `click_${isHighContrastBeforeToggle ? 'turn_off_contrast' : 'turn_on_contrast'}` }));

    document.documentElement.classList.toggle('contrast');
  };

  return (
      <>
          <ButtonTile
            onClick={() => setIsOpen(value => !value)}
          >
              <IconContrast />
              <span>{t('settings.highContrastMode')}</span>
          </ButtonTile>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('settings.accessibility')}</h3>
                  <br />
                  <Word guess={EXAMPLE_WORD} />
                  <br />
                  <ul className={layoutVariants.length % 3 === 0 ? 'list-col-3' : ''}>
                      <li>
                          <ButtonTile isActive onClick={handleToggleDarkLightMode}>
                              <span className="only-dark">
                                  <IconMoon />
                                  <span>{t('settings.darkMode')}</span>
                              </span>
                              <span className="only-light">
                                  <IconSun />
                                  <span>{t('settings.lightMode')}</span>
                              </span>
                          </ButtonTile>
                      </li>
                      <li>
                          <ButtonTile className="button-tile-active--contrast" onClick={handleToggleHighContrastMode}>
                              <IconContrast />
                              <span>{t('settings.highContrastMode')}</span>
                          </ButtonTile>
                      </li>
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default SettingsAccessibility;
