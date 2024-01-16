import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGS, SUPORTED_LANGS_BY_LANG } from '@const';

export default function useLangugeChangeIfNeeded( ) {
    const { language, i18n,  } = useTranslation();

    useEffect(() => {
        const langFromUrl = SUPPORTED_LANGS.find(lang => location.pathname.endsWith(`/${lang}`));

        console.log('langFromUrl', langFromUrl);

        if (langFromUrl) {
            i18n.changeLanguage(langFromUrl);
            document.title = SUPORTED_LANGS_BY_LANG[langFromUrl].title;

            return;
        }

        const { language: browserLanguage, languages: browserLanguages } = navigator;

        const langFromBrowser = SUPPORTED_LANGS.find(lang => browserLanguage === lang)
            || SUPPORTED_LANGS.find(lang => {
                const { languages: langLanguages } = SUPORTED_LANGS_BY_LANG[lang];

                const isThisLanguageSupported = langLanguages.some(
                    oneOfBrowserLanguages => browserLanguages.includes(oneOfBrowserLanguages)
                );

                return isThisLanguageSupported;
            });

        console.log('langFromBrowser', langFromBrowser);

        if (langFromBrowser) {
            // It was checked earlier, but just for clarity we set in url because it weren't there
            if (!langFromUrl) {
                const currentUrl = location.href.replace(location.search, '');
                const partToAdd = currentUrl.endsWith('/') ? langFromBrowser : `/${langFromBrowser}`;

                window.history.replaceState(null, document.title, `${currentUrl}${partToAdd}`);
            }

            document.title = SUPORTED_LANGS_BY_LANG[langFromBrowser].title;
            i18n.changeLanguage(langFromBrowser);

            return;
        }
    }, [i18n]);
}
