import { pathsByLangRouteKey, SupportedRoutes, rootPath } from '../const';
import { getLangRouteKey } from './getLangRouteKey';

type Params = {
  lang: string,
  route: SupportedRoutes,
};

export const getRoute = ({ lang, route }: Params) => {
  if (route === '404') {
    return `${rootPath}${lang ?? ''}`;
  }
  return `${rootPath}${pathsByLangRouteKey[getLangRouteKey({ lang, route })]}`;
};
