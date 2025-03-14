import { ROOT_PATH } from '@const';
import { pathsByLangRouteKey, SupportedRoutes } from '../const';
import { getLangRouteKey } from './getLangRouteKey';

type Params = {
  lang: string;
  route: SupportedRoutes;
};

export const getRoute = ({ lang, route }: Params) => {
  if (route === '404') {
    return `${ROOT_PATH}${lang ?? ''}`;
  }

  return `${ROOT_PATH}${pathsByLangRouteKey[getLangRouteKey({ lang, route })]}`;
};
