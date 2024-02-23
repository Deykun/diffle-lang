import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import { useSelector } from '@store';
import {
  selectGameLanguageKeyboardInfo,
} from '@store/selectors';

import useKeyboardSettings from '@hooks/useKeyboardSettings';
import useVibrate from '@hooks/useVibrate';

import IconContrast from '@components/Icons/IconContrast';
import IconCheckConfirm from '@components/Icons/IconCheckConfirm';
import IconKeyboard from '@components/Icons/IconKeyboard';
import IconKeyboardDown from '@components/Icons/IconKeyboardDown';
import IconMoon from '@components/Icons/IconMoon';
import IconSun from '@components/Icons/IconSun';
import IconSwap from '@components/Icons/IconSwap';
import IconVibrate from '@components/Icons/IconVibrate';
import IconVibrateKeyboard from '@components/Icons/IconVibrateKeyboard';

import LanguagePicker from '@components/Language/LanguagePicker';

import './Settings.scss';

const SettingsPreferences = () => {
  const { shouldPreferQWERTZ } = useSelector(selectGameLanguageKeyboardInfo);
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
    keyboardQWERTYMode,
    handleSetNextQWERTYMode,
  } = useKeyboardSettings();

  const { vibrate } = useVibrate();

  const handleToggleDarkLightMode = useCallback(() => {
    vibrate();

    const isLightThemeBeforeToggle = document.documentElement.classList.contains('light');

    localStorage.setItem(LOCAL_STORAGE.THEME, isLightThemeBeforeToggle ? 'dark' : 'light');

    document.documentElement.classList.toggle('light');
  }, [vibrate]);

  const handleToggleHighContrastMode = () => {
    vibrate();

    const isHighContrastBeforeToggle = document.documentElement.classList.contains('contrast');

    localStorage.setItem(LOCAL_STORAGE.THEME_CONTRAST, isHighContrastBeforeToggle ? 'false' : 'true');

    document.documentElement.classList.toggle('contrast');
  };

  return (
      <>
          <h2>{t('settings.preferencesTitle')}</h2>
          <ul>
              <li>
                  <button className="setting setting-active" onClick={handleToggleDarkLightMode} type="button">
                      <span className="only-dark">
                          <IconMoon />
                          <span>{t('settings.darkMode')}</span>
                      </span>
                      <span className="only-light">
                          <IconSun />
                          <span>{t('settings.lightMode')}</span>
                      </span>
                  </button>
              </li>
              <li>
                  <button className="setting setting-active--contrast" onClick={handleToggleHighContrastMode} type="button">
                      <IconContrast />
                      <span>{t('settings.highContrastMode')}</span>
                  </button>
              </li>
              <li>
                  <button className={clsx('setting', { 'setting-active': shouldVibrate })} onClick={handleToggleVibrate} type="button">
                      <IconVibrate />
                      <span>{t('settings.appVibration')}</span>
                  </button>
              </li>
              <li>
                  <LanguagePicker className="setting" />
              </li>
          </ul>
          <h3>{t('settings.keyboard')}</h3>
          <ul>
              <li>
                  <button
                    className={clsx('setting', { 'setting-active': shouldKeyboardVibrate })}
                    onClick={handleTogglKeyboardVibrate}
                    type="button"
                  >
                      <IconVibrateKeyboard />
                      <span>{t('settings.keyboardVibration')}</span>
                  </button>
              </li>
              <li>
                  <button
                    className={clsx('setting', { 'setting-active': isSmallKeyboard })}
                    onClick={handleToggleKeyboardSize}
                    type="button"
                  >
                      <IconKeyboardDown />
                      <span>{t('settings.smallerKeyboard')}</span>
                  </button>
              </li>
              <li>
                  <button className={clsx('setting', 'setting-active')} onClick={handleSetNextQWERTYMode} type="button">
                      <IconKeyboard />
                      <span className="setting-title-small">
                          {keyboardQWERTYMode === 'language'
                            ? (
                                <>
                                    {shouldPreferQWERTZ ? 'QWERTZ' : 'QWERTY'}
                                    {' '}
                                    <small>
                                        (
                                        {t('settings.languageDefault')}
                                        )
                                    </small>
                                </>
                            )
                            : keyboardQWERTYMode.toUpperCase()}
                      </span>
                  </button>
              </li>
              <li>
                  <button className={clsx('setting', { 'setting-active': isEnterSwapped })} onClick={handleToggleEnterSwap} type="button">
                      <IconSwap />
                      <span className="setting-title-small">{t('settings.swapEnterAndBackspace')}</span>
                  </button>
              </li>
              <li>
                  <button
                    className={clsx('setting', { 'setting-active': shouldConfirmEnter })}
                    onClick={handleToggleConfirmEnter}
                    type="button"
                  >
                      <IconCheckConfirm />
                      <span className="setting-title-small">{t('settings.confirmSubmition')}</span>
                  </button>
              </li>
          </ul>
      </>
  );
};

export default SettingsPreferences;
