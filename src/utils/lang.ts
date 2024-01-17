import { SUPPORTED_LANGS, SUPORTED_DICTIONARY_BY_LANG } from '@const';

export const getLangFromUrl = () => {
    const langFromUrl = SUPPORTED_LANGS.find(lang => location.pathname.endsWith(`/${lang}`));

    return langFromUrl;
};

export const getLangFromBrowser = () => {
    const { language: browserLanguage, languages: browserLanguages } = navigator;

    const langFromBrowser = SUPPORTED_LANGS.find(lang => browserLanguage === lang)
        || SUPPORTED_LANGS.find(lang => {
            const { languages: langLanguages } = SUPORTED_DICTIONARY_BY_LANG[lang];

            const isThisLanguageSupported = langLanguages.some(
                oneOfBrowserLanguages => browserLanguages.includes(oneOfBrowserLanguages)
            );

            return isThisLanguageSupported;
        });

    return langFromBrowser;
}
