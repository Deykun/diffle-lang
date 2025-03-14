import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useCallback, useMemo } from 'react';

import { SupportedRoutes, rootPath, linksByPaths, path404Data } from '../const';
import { getRoute } from '../utils/getRoute';

function useLink() {
  const [location] = useLocation();
  const { i18n } = useTranslation();

  const activeLink = useMemo(() => {
    return linksByPaths[location.replace(rootPath, '')] || path404Data;
  }, [location]);

  const getLinkPath = useCallback(
    ({ lang, route }: { lang?: string; route: SupportedRoutes }) => {
      return getRoute({ lang: lang ?? i18n.language, route });
    },
    [i18n.language],
  );

  return {
    activeLink,
    getLinkPath,
  };
}

export default useLink;
