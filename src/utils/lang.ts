import { SUPPORTED_LANGS, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

export const getLangFromUrl = () => {
  const langFromUrl = SUPPORTED_LANGS.find(lang => window.location.pathname.endsWith(`/${lang}`));

  return langFromUrl;
};

export const getLangFromBrowser = () => {
  const { language: browserLanguage, languages: browserLanguages } = navigator;

  const exactlangFromBrowser = SUPPORTED_LANGS.find((lang) => {
    const { languages: langLanguages } = SUPPORTED_DICTIONARY_BY_LANG[lang];

    const isThisExactLanguage = langLanguages.includes(browserLanguage);

    return isThisExactLanguage;
  });

  if (exactlangFromBrowser) {
    return exactlangFromBrowser;
  }

  const supportedLangFromBrowser = SUPPORTED_LANGS.find((lang) => {
    const { languages: langLanguages } = SUPPORTED_DICTIONARY_BY_LANG[lang];

    const isThisLanguageSupported = langLanguages.some(
      oneOfBrowserLanguages => browserLanguages.includes(oneOfBrowserLanguages)
        || oneOfBrowserLanguages.startsWith(`${lang}-`)
        || oneOfBrowserLanguages.startsWith(`${lang}_`),
    );

    return isThisLanguageSupported;
  });

  return supportedLangFromBrowser;
};
