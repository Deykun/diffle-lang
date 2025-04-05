import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation } from 'wouter';

import { ROOT_PATH } from '@const';

import { getLangFromUrl } from '@utils/lang';

import Help from '@components/Panes/Help/Help';
import Game from '@components/Panes/Game/Game';
import Settings from '@components/Panes/Settings/Settings';
import Statistics from '@components/Panes/Statistics/Statistics';
import AboutLanguage from '@components/Panes/AboutLanguage/AboutLanguage';
import YearSummary from '@components/Panes/YearSummary/YearSummary';

import { linksByPaths, SupportedRoutes, path404Data } from '@features/routes/const';

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
  const { i18n } = useTranslation();

  useEffect(() => {
    const { language: appLanguage } = i18n;
    const langToUse = getLangFromUrl();

    const isRootUrl = location === ROOT_PATH;

    const shouldRedirectToLang = isRootUrl;
    if (shouldRedirectToLang) {
      navigate(`${ROOT_PATH}${appLanguage}`);

      return;
    }

    const is404 = !langToUse;
    if (is404) {
      if (location !== `${ROOT_PATH}404`) {
        navigate(`${ROOT_PATH}404?notFound=${location.replace(ROOT_PATH, '')}`);
      }

      return;
    }

    if (appLanguage !== langToUse) {
      i18n.changeLanguage(langToUse);
    }

    const {
      title
    } = linksByPaths[location.replace(ROOT_PATH, '')] || path404Data;

    document.title = title;
    document.documentElement.lang = langToUse;
  }, [i18n.changeLanguage, location, navigate]);

  return (
    <div>
      <Switch>
        {paths.map(({ path, route }) => (
          <Route key={path} path={`${ROOT_PATH}${path}`} component={componentsByRoutes[route]} />
        ))}
        <Route>404</Route>
      </Switch>
    </div>
  );
};

export default Routes;
