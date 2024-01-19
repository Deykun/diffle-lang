import { useEffect } from 'react';

import getAppStatus from '@api/getAppStatus';

export default function useAppUpdateIfNeeded( ) {
    useEffect(() => {
        getAppStatus().then(({ shouldUpdate, shouldResetStore }) => {
            if (shouldUpdate) {
                // This will be more controlled in the future
                if (shouldResetStore) {
                    localStorage.clear();
                }

                location.reload();
            }
        });
    }, []);
}
