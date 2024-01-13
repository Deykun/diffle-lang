import { useCallback } from 'react';

import { Pane } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setPane } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';

function usePanes() {
    const dispatch = useDispatch();
    const pane = useSelector(state => state.app.pane);

    const { vibrate } = useVibrate();

    const changePane = useCallback((pane: Pane) => {
        vibrate();

        dispatch(setPane(pane))
    }, [dispatch, vibrate]);

    return {
        pane,
        changePane,
    };
};

export default usePanes;
