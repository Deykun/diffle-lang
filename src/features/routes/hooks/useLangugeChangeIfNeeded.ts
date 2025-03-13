import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { useSelector, useDispatch } from '@store';
import { setGameLanguage } from '@store/gameSlice';

import { getLangFromUrl, getLangFromBrowser } from '@utils/lang';

import useEffectChange from '@hooks/useEffectChange';
import { useLocation } from 'wouter';
import { rootPath } from '../const';

/*
    There are two languages used by the app: one for translations (i18n), and the other for the game.
    After the app language is changed, the game follows.

    Once the language of the game is changed, the mechanism for restoring the game is triggered the same to the game mode change.
*/
export default function useLangugeChangeIfNeeded() {
  const [location, navigate] = useLocation();
  const isGameUpdating = useSelector(state => state.game.isProcessing || state.game.isLoadingGame);
  const [wasAppLanguageDetected, setWasAppLanguageDetected] = useState(false);
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);

  const { i18n } = useTranslation();

  useEffectChange(() => {
    const { language: appLanguage } = i18n;
    const langFromUrl = getLangFromUrl();

    const isRootUrl = location === rootPath;

    const shouldRedirectToLang = isRootUrl;
    if (shouldRedirectToLang) {
      navigate(`${rootPath}${appLanguage}`);
    }


    if (!langFromUrl || appLanguage !== langFromUrl) {
      // const currentUrl = window.location.href.replace(window.location.search, '');
      // const newLocation = `${currentUrl.replace(`diffle-lang/${langFromUrl}`, 'diffle-lang/')}${appLanguage}`;

      // const { title } = SUPPORTED_DICTIONARY_BY_LANG[appLanguage];
      // document.title = title;
      // document.documentElement.lang = appLanguage;

      // window.history.replaceState(null, title, newLocation);
    }

    const isMissingLang = !langFromUrl || appLanguage !== langFromUrl;

    const { title } = SUPPORTED_DICTIONARY_BY_LANG[appLanguage];
    if (appLanguage && title) {
      document.title = title;
      document.documentElement.lang = appLanguage;
    }
  }, [wasAppLanguageDetected, i18n.language, location]);

  useEffect(() => {
    if (!isGameUpdating && wasAppLanguageDetected) {
      const appLanguage = i18n.language;

      if (appLanguage !== gameLanguage) {
        dispatch(setGameLanguage(appLanguage));
      }

      localStorage.setItem(LOCAL_STORAGE.LAST_LANG, appLanguage);
    }
  }, [dispatch, gameLanguage, i18n.language, isGameUpdating, wasAppLanguageDetected]);

  useEffect(() => {
    const langFromUrl = getLangFromUrl();

    if (langFromUrl) {
      i18n.changeLanguage(langFromUrl);
      setWasAppLanguageDetected(true);

      return;
    }

    const lastLang = localStorage.getItem(LOCAL_STORAGE.LAST_LANG);

    if (lastLang) {
      i18n.changeLanguage(lastLang);
      setWasAppLanguageDetected(true);

      return;
    }

    const langFromBrowser = getLangFromBrowser();

    if (langFromBrowser) {
      i18n.changeLanguage(langFromBrowser);
      setWasAppLanguageDetected(true);

      return;
    }

    i18n.changeLanguage('en');
    setWasAppLanguageDetected(true);
  }, [i18n]);
}
