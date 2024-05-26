import { useEffect } from 'react';

import { useDispatch } from '@store';
import { track } from '@store/appSlice';

import getAppStatus from '@api/getAppStatus';

export default function useAppUpdateIfNeeded() {
  const dispatch = useDispatch();

  useEffect(() => {
    getAppStatus().then(({ shouldUpdate, shouldResetStore }) => {
      if (shouldUpdate) {
        // This will be more controlled in the future
        if (shouldResetStore) {
          dispatch(track({ name: 'app_force_update_store' }));
          // localStorage.clear();
        }

        dispatch(track({ name: 'app_force_update_location' }));
        window.location.reload();
      }
    });
  }, [dispatch]);
}
