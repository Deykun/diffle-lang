import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import useKeyboardSettings from '@hooks/useKeyboardSettings';
import useVibrate from '@hooks/useVibrate';

import IconConstruction from '@components/Icons/IconConstruction';
import IconContrast from '@components/Icons/IconContrast';
import IconCheckConfirm from '@components/Icons/IconCheckConfirm'; 
import IconKeyboardDown from '@components/Icons/IconKeyboardDown'; 
import IconMoon from '@components/Icons/IconMoon';
import IconSun from '@components/Icons/IconSun';
import IconTranslation from '@components/Icons/IconTranslation';
import IconVibrate from '@components/Icons/IconVibrate';
import IconVibrateKeyboard from '@components/Icons/IconVibrateKeyboard';

import './Settings.scss'

const SettingsPreferences = () => {
    const { t, i18n } = useTranslation();

    const {
        shouldVibrate,
        handleToggleVibrate,
        shouldKeyboardVibrate,
        handleTogglKeyboardVibrate,
        isSmallKeyboard,
        handleToggleKeyboardSize,
        shouldConfirmEnter,
        handleToggleConfirmEnter,
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

        document.body.classList.toggle('contrast');
    };

    const handleLanguageChange = useCallback(() => {
        vibrate();

        i18n.changeLanguage(i18n.language === 'pl' ? 'en' : 'pl');
    }, [i18n, vibrate]);

    return (
        <>
            <h2>{t('settings.preferencesTitle')}</h2>
            <ul>
                <li>
                    <button className={clsx('setting', { 'setting-active': shouldVibrate })} onClick={handleToggleVibrate}>
                        <IconVibrate />
                        <span>{t('settings.appVibration')}</span>
                    </button>
                </li>
                <li>
                    <button className="setting setting-active" onClick={handleToggleDarkLightMode}>
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
                    <button className="setting setting-active--contrast" onClick={handleToggleHighContrastMode}>
                        <IconContrast />
                        <span>{t('settings.highContrastMode')}</span>
                    </button>
                </li>
                <li>
                    <button className="setting" onClick={handleLanguageChange}>
                        <IconTranslation />
                        <span>{t('settings.currentLanguage')}</span>
                        {i18n.language === 'en'&& <span className={clsx('setting-label', 'position', 'construction')}>
                            <span>{t('settings.inDevelopment')}</span> <IconConstruction /></span>
                        }
                    </button>
                </li>
            </ul>
            <h3>Klawiatura</h3>
            <ul className="list-col-3">
                <li>
                    <button className={clsx('setting', { 'setting-active': shouldKeyboardVibrate })} onClick={handleTogglKeyboardVibrate}>
                        <IconVibrateKeyboard />
                        <span className="setting-title-small">{t('settings.keyboardVibration')}</span>
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': isSmallKeyboard })} onClick={handleToggleKeyboardSize}>
                        <IconKeyboardDown />
                        <span className="setting-title-small">{t('settings.smallerKeyboard')}</span>
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': shouldConfirmEnter })} onClick={handleToggleConfirmEnter}>
                        <IconCheckConfirm />
                        <span className="setting-title-small">{t('settings.confirmSubmition')}</span>
                    </button>
                </li>
            </ul>
        </>
    )
};

export default SettingsPreferences;
