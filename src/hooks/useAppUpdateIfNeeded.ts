import { useEffect } from 'react';

import getAppStatus from '@api/getAppStatus';


export default function useAppUpdateIfNeeded( ) {
    useEffect(() => {
        getAppStatus().then(({ shouldUpdate }) => {
            if (shouldUpdate) {
                // This will be controled in future versions
                localStorage.clear();
                location.reload();
            }
        });
    }, []);
}
