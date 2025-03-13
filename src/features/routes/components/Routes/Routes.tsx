import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link, Route, Switch, useLocation,
} from 'wouter';

import { getLangFromUrl } from '@utils/lang';

import { rootPath, routesByPaths } from '@features/routes/const';

const paths = Object.values(routesByPaths);

console.log(routesByPaths);

const Routes = () => {
  const [location, navigate] = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const { language: appLanguage } = i18n;
    const langToUse = getLangFromUrl();

    const isRootUrl = location === rootPath;

    const shouldRedirectToLang = isRootUrl;
    if (shouldRedirectToLang) {
      navigate(`${rootPath}${appLanguage}`);

      return;
    }

    const is404 = !langToUse;
    if (is404) {
      if (location !== `${rootPath}404`) {
        navigate(`${rootPath}404?notFound=${location.replace(rootPath, '')}`);
      }

      return;
    }

    console.log({
      langToUse,
    });

    const title = t('route.game.title', { lang: langToUse });
    document.title = title;
    document.documentElement.lang = langToUse;
  }, [t, i18n, location, navigate]);

  return (
      <div>

          <Switch>
              {paths.map(({ path, route }) => (
                  <Route key={`${route}-${path}`} path={`${rootPath}${path}`}>
                      {path}
                      {' | '}
                      {route}
                  </Route>
              ))}
              <Route>404</Route>
          </Switch>
      </div>
  );

  // <Switch>

  // </Switch>
};

export default Routes;

// <Route
// {pane === PaneType.Help && <Help />}
// {pane === PaneType.Game && <Game />}
// {pane === PaneType.Settings && <Settings />}
// {pane === PaneType.Statistics && <Statistics />}
// {pane === PaneType.YearSummary && <YearSummary />}
// {pane === PaneType.AboutLanguage && <AboutLanguage />}
