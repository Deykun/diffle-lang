import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';

import localeEn from './locales/en.json';
import localePl from './locales/pl.json';

// TODO: manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: localeEn,
  },
  pl: {
    translation: localePl,
  },
};

i18n
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    resources,
    lng: 'pl', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'pl',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
