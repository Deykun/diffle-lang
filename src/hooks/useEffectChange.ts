import { useEffect, useRef } from 'react';

import { Word } from '@common-types';

export default function useEffectChange(callback: () => void, args: (string | Word[])[] ) {
    const isInited = useRef(false);

    useEffect(() => {
        if (!isInited.current) {
            isInited.current = true;

            return;
        }

        return callback();
    }, args); // eslint-disable-line react-hooks/exhaustive-deps
}
