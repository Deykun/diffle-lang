import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';
import { track } from '@store/appSlice';

import useKeyboardSettings from '@hooks/useKeyboardSettings';

import IconContrast from '@components/Icons/IconContrast';
import IconCheckConfirm from '@components/Icons/IconCheckConfirm';
import IconCookie from '@components/Icons/IconCookie';
import IconCookies from '@components/Icons/IconCookies';
import IconKeyboardDown from '@components/Icons/IconKeyboardDown';
import IconMoon from '@components/Icons/IconMoon';
import IconSun from '@components/Icons/IconSun';
import IconSwap from '@components/Icons/IconSwap';
import IconVibrate from '@components/Icons/IconVibrate';
import IconVibrateKeyboard from '@components/Icons/IconVibrateKeyboard';

import ButtonTile from '@components/Button/ButtonTile';

import CookiesPopup from '@components/Cookies/CookiesPopup';
import LanguagePicker from '@components/Language/LanguagePicker';
import KeyboardLayoutPicker from '@components/Keyboard/KeyboardLayoutPicker';

import './Settings.scss';

const SettingsPreferences = () => {
  const dispatch = useDispatch();
  const cookies = useSelector(state => state.app.cookies);
  const totalOfCookiesPoliciesAccepted = Object.values(cookies).filter(Boolean).length;

  const { t } = useTranslation();

  const {
    shouldVibrate,
    handleToggleVibrate,
    shouldKeyboardVibrate,
    handleTogglKeyboardVibrate,
    isSmallKeyboard,
    handleToggleKeyboardSize,
    isEnterSwapped,
    handleToggleEnterSwap,
    shouldConfirmEnter,
    handleToggleConfirmEnter,
  } = useKeyboardSettings();

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
          <h2>{t('settings.preferencesTitle')}</h2>
          <ul className="list-col-3">
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
              <li>
                  <CookiesPopup className="button-tile" isEditMode>
                      {totalOfCookiesPoliciesAccepted > 1
                        ? <IconCookies />
                        : <IconCookie />}
                      <span>{t('settings.privacyTitle')}</span>
                  </CookiesPopup>
              </li>
              <li>
                  <ButtonTile isActive={shouldVibrate} onClick={handleToggleVibrate}>
                      <IconVibrate />
                      <span className="button-tile-title-small">{t('settings.appVibration')}</span>
                  </ButtonTile>
              </li>
              <li>
                  <LanguagePicker className="button-tile" place="settings" />
              </li>
          </ul>
          <h3>{t('settings.keyboard')}</h3>
          <ul className="list-col-3">
              <li>
                  <ButtonTile
                    isActive={shouldKeyboardVibrate}
                    onClick={handleTogglKeyboardVibrate}
                  >
                      <IconVibrateKeyboard />
                      <span className="button-tile-title-small">{t('settings.keyboardVibration')}</span>
                  </ButtonTile>
              </li>
              <li>
                  <ButtonTile
                    isActive={isSmallKeyboard}
                    onClick={handleToggleKeyboardSize}
                  >
                      <IconKeyboardDown />
                      <span className="button-tile-title-small">{t('settings.smallerKeyboard')}</span>
                  </ButtonTile>
              </li>
              <li>
                  <KeyboardLayoutPicker isTile />
              </li>
              <li>
                  <ButtonTile isActive={isEnterSwapped} onClick={handleToggleEnterSwap}>
                      <IconSwap />
                      <span className="button-tile-title-small">{t('settings.swapEnterAndBackspace')}</span>
                  </ButtonTile>
              </li>
              <li>
                  <ButtonTile
                    isActive={shouldConfirmEnter}
                    onClick={handleToggleConfirmEnter}
                  >
                      <IconCheckConfirm />
                      <span className="button-tile-title-small">{t('settings.confirmSubmition')}</span>
                  </ButtonTile>
              </li>
          </ul>
      </>
  );
};

export default SettingsPreferences;
