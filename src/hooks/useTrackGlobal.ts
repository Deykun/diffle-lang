import { useEffect } from 'react';

import { useSelector, useDispatch } from '@store';
import { track } from '@store/appSlice';
import { selectCookiesPolicyHash } from '@store/selectors';

function useTrackGlobal() {
  const dispatch = useDispatch();

  const cookiesRefresherString = useSelector(selectCookiesPolicyHash);

  const activePane = useSelector(state => state.app.pane.active);
  const gameLanguage = useSelector(state => state.game.language);

  useEffect(() => {
    if (activePane && gameLanguage) {
      dispatch(track({ name: `pane_view_${activePane.replaceAll('-', '_').toLocaleLowerCase()}`, params: { lang: gameLanguage } }));
    }
  }, [activePane, cookiesRefresherString, dispatch, gameLanguage]);

  useEffect(() => {
    if (gameLanguage) {
      dispatch(track({ name: `game_lang_${gameLanguage}` }));
    }
  }, [gameLanguage, cookiesRefresherString, dispatch]);
}

export default useTrackGlobal;
