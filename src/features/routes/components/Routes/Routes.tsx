import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation,
} from 'wouter';

import { getLangFromUrl } from '@utils/lang';

import Help from '@components/Panes/Help/Help';
import Game from '@components/Panes/Game/Game';
import Settings from '@components/Panes/Settings/Settings';
import Statistics from '@components/Panes/Statistics/Statistics';
import AboutLanguage from '@components/Panes/AboutLanguage/AboutLanguage';
import YearSummary from '@components/Panes/YearSummary/YearSummary';

import {
  rootPath,
  linksByPaths,
  SupportedRoutes,
} from '@features/routes/const';

const paths = Object.values(linksByPaths);

const componentsByRoutes: Record<SupportedRoutes, () => React.ReactNode> = {
  help: Help,
  game: Game,
  settings: Settings,
  statistics: Statistics,
  aboutLanguage: AboutLanguage,
  hejto2024: YearSummary,
  404: () => '404 component',
};

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

    if (appLanguage !== langToUse) {
      i18n.changeLanguage(langToUse);
    }

    const title = t('route.game.title', { lang: langToUse });
    document.title = title;
    document.documentElement.lang = langToUse;
  }, [t, i18n, location, navigate]);

  return (
      <div>
          <Switch>
              {paths.map(({ path, route }) => (
                  <Route
                    key={path}
                    path={`${rootPath}${path}`}
                    component={componentsByRoutes[route]}
                  />
              ))}
              <Route>404</Route>
          </Switch>
      </div>
  );
};

export default Routes;
