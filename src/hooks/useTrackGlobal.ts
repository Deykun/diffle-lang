import { useEffect } from 'react';

import { useSelector, useDispatch } from '@store';
import { track } from '@store/appSlice';
import { selectCookiesPolicyHash } from '@store/selectors';

import useLinks from '@features/routes/hooks/useLinks';

function useTrackGlobal() {
  const dispatch = useDispatch();
  const { activeLink } = useLinks();

  const cookiesRefresherString = useSelector(selectCookiesPolicyHash);

  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);

  useEffect(() => {
    if (activeLink.route) {
      dispatch(track({ name: `route_${activeLink.lang}_${activeLink.route}` }));
    }
  }, [cookiesRefresherString, dispatch, activeLink.route, activeLink.lang, gameLanguage]);

  useEffect(() => {
    if (gameMode && gameLanguage) {
      dispatch(track({ name: `game_mode_${gameLanguage}_${gameMode}` }));
    }
  }, [cookiesRefresherString, dispatch, gameLanguage, gameMode]);

  useEffect(() => {
    if (gameLanguage) {
      dispatch(track({ name: `game_lang_${gameLanguage}` }));
    }
  }, [cookiesRefresherString, dispatch, gameLanguage]);
}

export default useTrackGlobal;
