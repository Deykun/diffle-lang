import { SUPPORTED_LANGS } from '@const';
import { resources } from '../../locales/langs';
import { getLangRouteKey } from './utils/getLangRouteKey';
import { getLangFromUrl } from '@utils/lang';

export const supportedRoutes = [
  'game',
  'help',
  'settings',
  'statistics',
  'aboutLanguage',
  'hejto2024',
] as const;

export type SupportedRoutes = (typeof supportedRoutes)[number] | '404';

type SeoData = {
  title: string;
  metaDescription: string;
  openGraphTitle: string;
  openGraphDescription: string;
};

const getSeoData = (strings: { [key: string]: string }, route: string, fallback?: SeoData): SeoData => {
  const fallbackTitle = fallback?.title || '';
  const fallbackMetaDescription = fallback?.metaDescription || '';
  const fallbackOpenGraphTitle = strings[`route.${route}.title`] || fallback?.openGraphTitle || '';
  const fallbackOpenGraphDescription =
    strings[`route.${route}.metaDescription`] || fallback?.openGraphDescription || '';

  return {
    title: strings[`route.${route}.title`] || fallbackTitle,
    metaDescription: strings[`route.${route}.metaDescription`] || fallbackMetaDescription,
    openGraphTitle: strings[`route.${route}.openGraphTitle`] || fallbackOpenGraphTitle,
    openGraphDescription: strings[`route.${route}.openGraphDescription`] || fallbackOpenGraphDescription,
  };
};

export type LinkData = SeoData & {
  path: string;
  route: SupportedRoutes;
  lang: string;
};

type Stack = {
  linksByPaths: {
    [path: string]: LinkData;
  };
  pathsByLangRouteKey: {
    [langRouteKey: string]: string;
  };
};

const routesData = SUPPORTED_LANGS.reduce(
  (stack: Stack, lang) => {
    const translationStrings = resources[lang]?.translation;

    if (!translationStrings) {
      return stack;
    }

    const defaultSeo = getSeoData(translationStrings, 'game');

    supportedRoutes.forEach((route) => {
      const path = route === 'game' ? lang : `${lang}/${resources[lang].translation[`route.${route}`]}`;

      if (!path) {
        throw `Missing path for ${lang} ${route}!`;
      }

      stack.linksByPaths[path] = {
        ...getSeoData(translationStrings, route, defaultSeo),
        path,
        route,
        lang,
      };
      stack.pathsByLangRouteKey[getLangRouteKey({ lang, route })] = path;
    });

    return stack;
  },
  {
    linksByPaths: {},
    pathsByLangRouteKey: {},
  },
);

export const { linksByPaths } = routesData;
export const { pathsByLangRouteKey } = routesData;

export const path404Data: LinkData = {
  path: '',
  route: '404',
  lang: getLangFromUrl() || '',
  ...getSeoData(resources.en.translation, '404'),
};
