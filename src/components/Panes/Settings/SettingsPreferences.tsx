import clsx from 'clsx';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { toggleVibration } from '@store/appSlice';

import IconConstruction from '@components/Icons/IconConstruction';
import IconMoon from '@components/Icons/IconMoon';
import IconSun from '@components/Icons/IconSun';
import IconTranslation from '@components/Icons/IconTranslation';
import IconVibrate from '@components/Icons/IconVibrate';

import './Settings.scss'

const SettingsPreferences = () => {
    const dispatch = useDispatch();
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);

    const { t, i18n } = useTranslation();

    const handleToggleVibrate = useCallback(() => {
        // Inverted because toggled
        localStorage.setItem(LOCAL_STORAGE.SHOULD_VIBRATE, shouldVibrate ? 'false' : 'true');

        dispatch(toggleVibration())
    }, [dispatch, shouldVibrate]);

    const handleToggleDarkLightMode = useCallback(() => {
        const isDarkThemeBeforeToggle = document.documentElement.classList.contains('dark');

        localStorage.setItem(LOCAL_STORAGE.THEME, isDarkThemeBeforeToggle ? 'light' : 'dark');

        document.documentElement.classList.toggle('dark');
    }, []);

    const handleLanguageChange = useCallback(() => {
        i18n.changeLanguage(i18n.language === 'pl' ? 'en' : 'pl');
    }, [i18n]);

    return (
        <>
            <h2>{t('settings.preferencesTitle')}</h2>
            <ul>
                <li>
                    <button className={clsx('setting', { 'setting-active': shouldVibrate })} onClick={handleToggleVibrate}>
                        <IconVibrate />
                        <span>{t('settings.phoneVibrations')}</span>
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
                    <button className="setting" onClick={handleLanguageChange}>
                        <IconTranslation />
                        <span>{t('settings.currentLanguage')}</span>
                        {i18n.language === 'en'&& <span className={clsx('setting-label', 'position', 'construction')}>
                            <span>{t('settings.inDevelopment')}</span> <IconConstruction /></span>
                        }
                    </button>
                </li>
            </ul>
        </>
    )
};

export default SettingsPreferences;
