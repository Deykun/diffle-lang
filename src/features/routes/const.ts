import { SUPPORTED_LANGS } from '@const';
import { resources } from '../../locales/langs';

export const rootPath = '/diffle-lang/';

export const supportedRoutes = [
  'game',
  'help',
  'settings',
  'statistics',
  'aboutLanguage',
  'hejto2024',
];

type SeoData = {
  title: string,
  metaDescription: string,
  openGraphTitle: string,
  openGraphDescription: string,
};

const getSeoData = (strings: { [key: string]: string }, route: string, fallback?: SeoData): SeoData => ({
  title: strings[`route.${route}.title`] ?? fallback?.title,
  metaDescription: strings[`route.${route}.metaDescription`] ?? fallback?.title,
  openGraphTitle: strings[`route.${route}.openGraphTitle`] ?? fallback?.title,
  openGraphDescription: strings[`route.${route}..openGraphDescription`] ?? fallback?.title,
});

type RouteData = SeoData & {
  path: string,
  route: string,
};

type Stack = {
  routesByPaths: {
    [path: string]: RouteData,
  },
  pathsByLangRouteKey: {
    [langRouteKey: string]: string,
  },
};

const routesData = SUPPORTED_LANGS.reduce((stack: Stack, lang) => {
  const translationStrings = resources[lang]?.translation;

  if (!translationStrings) {
    return stack;
  }

  const defaultSeo = getSeoData(translationStrings, 'game');

  supportedRoutes.forEach((route) => {
    const path = route === 'game' ? lang : `${lang}/${resources[lang].translation[`route.${route}`]}`;

    if (!path) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw `Missing path for ${lang} ${route}!`;
    }

    stack.routesByPaths[path] = {
      ...getSeoData(translationStrings, route, defaultSeo),
      route,
      path,
    };
    stack.pathsByLangRouteKey[`${lang}-${route}`] = path;
  });

  return stack;
}, {
  routesByPaths: {},
  pathsByLangRouteKey: {},
});

export const { routesByPaths } = routesData;
export const { pathsByLangRouteKey } = routesData;
