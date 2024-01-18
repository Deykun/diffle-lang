import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPORTED_DICTIONARY_BY_LANG } from '@const';

import { useSelector, useDispatch } from '@store';
import { selectGameLanguage } from '@store/selectors';
import { setGameLanguage } from '@store/gameSlice';

import { getLangFromUrl, getLangFromBrowser } from '@utils/lang';

import useEffectChange from "@hooks/useEffectChange";

/*
    There are two languages used by the app: one for translations (i18n), and the other for the game.
    After the app language is changed, the game follows.
    
    Once the language of the game is changed, the mechanism for restoring the game is triggered the same to the game mode change.
*/
export default function useLangugeChangeIfNeeded( ) {
    const [wasAppLanguageDetected, setWasAppLanguageDetected] = useState(false);
    const dispatch = useDispatch();
    const gameLanguage = useSelector((state) => state.game.language);

    const { i18n } = useTranslation();

    useEffectChange(() => {
        const { language: appLanguage } = i18n;
        const langFromUrl = getLangFromUrl();

        if (appLanguage !== langFromUrl) {
            const currentUrl = location.href.replace(location.search, '');
            const partToAdd = currentUrl.endsWith('/') ? appLanguage : `/${appLanguage}`;
            const newLocation = `${currentUrl.replace(`/${langFromUrl}`, '')}${partToAdd}`;

            const { title } = SUPORTED_DICTIONARY_BY_LANG[appLanguage];
            document.title = title;

            window.history.replaceState(null, title, newLocation);
        }
    }, [i18n.language]);

    useEffect(() => {
        if (wasAppLanguageDetected) {
            const appLanguage = i18n.language;

            if (appLanguage !== gameLanguage) {
                dispatch(setGameLanguage(appLanguage));
            }
        }
    }, [dispatch, gameLanguage, i18n.language, wasAppLanguageDetected]);


    useEffect(() => {
        const langFromUrl = getLangFromUrl();

        if (langFromUrl) {
            i18n.changeLanguage(langFromUrl);
            setWasAppLanguageDetected(true);

            return;
        }

        const langFromBrowser = getLangFromBrowser();

        if (langFromBrowser) {
            i18n.changeLanguage(langFromBrowser);
            setWasAppLanguageDetected(true);

            return;
        }

        setWasAppLanguageDetected(true);
    }, [i18n]);
}
