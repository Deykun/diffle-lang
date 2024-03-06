import { useEffect } from 'react';

import { useSelector, useDispatch } from '@store';
import { track } from '@store/appSlice';
import { selectCookiesPolicyHash } from '@store/selectors';

function useTrackGlobal() {
  const dispatch = useDispatch();

  const cookiesRefresherString = useSelector(selectCookiesPolicyHash);

  const activePane = useSelector(state => state.app.pane.active);
  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);

  useEffect(() => {
    if (activePane && gameLanguage) {
      dispatch(track({ name: `pane_view_${gameLanguage}_${activePane.replaceAll('-', '_').toLocaleLowerCase()}` }));
    }
  }, [cookiesRefresherString, dispatch, activePane, gameLanguage]);

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
