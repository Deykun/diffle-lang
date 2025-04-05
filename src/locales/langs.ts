import localeCs from './cs.json';
import localeDe from './de.json';
import localeEn from './en.json';
import localeEs from './es.json';
import localeFi from './fi.json';
import localeFr from './fr.json';
import localeIt from './it.json';
import localePl from './pl.json';

// TODO: manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources: {
  [lang: string]: {
    translation: {
      [key: string]: string
    },
  },
} = {
  cs: {
    translation: localeCs,
  },
  de: {
    translation: localeDe,
  },
  en: {
    translation: localeEn,
  },
  es: {
    translation: localeEs,
  },
  fi: {
    translation: localeFi,
  },
  fr: {
    translation: localeFr,
  },
  it: {
    translation: localeIt,
  },
  pl: {
    translation: localePl,
  },
};
