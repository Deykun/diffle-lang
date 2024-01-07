import { useEffect } from 'react';

import getAppStatus from '@api/getAppStatus';


export default function useAppUpdateIfNeeded( ) {
    useEffect(() => {
        getAppStatus().then(({ shouldUpdate }) => {
            if (shouldUpdate) {
                location.reload();
            }
        });
    }, []);
}
