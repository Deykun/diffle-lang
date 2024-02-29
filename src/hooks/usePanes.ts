import { useCallback, useEffect } from 'react';

import { Pane } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setPane, track } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';

function usePanes() {
  const dispatch = useDispatch();
  const activePane = useSelector(state => state.app.pane.active);
  const paneParams = useSelector(state => state.app.pane.params);

  const { vibrate } = useVibrate();

  useEffect(() => {
    if (activePane) {
      dispatch(track({ name: `pane_view_${activePane}` }));
    }
  }, [activePane, dispatch]);

  const changePane = useCallback((paneToSet: Pane, paneParamsToSet: { [key: string]: string } = {}) => {
    vibrate();

    dispatch(setPane({ pane: paneToSet, params: paneParamsToSet }));
  }, [dispatch, vibrate]);

  return {
    pane: activePane,
    paneParams,
    changePane,
  };
}

export default usePanes;
